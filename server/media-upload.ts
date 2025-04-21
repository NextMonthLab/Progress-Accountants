import { v2 as cloudinary } from 'cloudinary';
import { db } from './db';
import { creditUsageLog, insertCreditUsageLogSchema, insertMediaUploadSchema, mediaUploads } from '../shared/schema';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import multer from 'multer';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { suggestImagePlacement } from './media-ai';

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
// Get current directory path using import.meta.url for ES modules
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

export const upload = multer({ storage });

// Helper function to calculate credits based on file size
export function calculateCredits(bytes: number): number {
  // 1 credit per 2MB, rounded up
  const MB = 1024 * 1024;
  const creditsPerTwoMB = 1;
  return Math.ceil(bytes / (2 * MB)) * creditsPerTwoMB;
}

// Log credit usage for media uploads
async function logCreditUsage(businessId: string, credits: number, entityId: string): Promise<void> {
  await db.insert(creditUsageLog).values({
    businessId,
    credits, 
    reason: 'media_upload',
    description: `Media upload charge: ${credits} credits`,
    entityType: 'media',
    entityId
  });
}

// Upload file to Cloudinary
export async function uploadToCloudinary(
  filePath: string, 
  businessId: string,
  fileName: string
): Promise<{
  publicUrl: string;
  bytes: number;
  format: string;
  cloudinaryId: string;
  folder: string;
}> {
  // Create folder path: /nextmonth/{business_id}/
  const folder = `nextmonth/${businessId}`;
  
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto', // auto-detect the resource type
      public_id: path.parse(fileName).name, // Use filename without extension as public_id
    });

    return {
      publicUrl: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      cloudinaryId: result.public_id,
      folder
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
}

// Handle media upload request
export async function handleMediaUpload(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  // Validate request data
  const uploadSchema = z.object({
    business_id: z.string().min(1),
    description: z.string().optional(),
  });

  try {
    const { business_id, description } = uploadSchema.parse(req.body);
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const contentType = req.file.mimetype;
    const uploadedBy = req.user?.id || null;

    // Upload to Cloudinary
    const { publicUrl, bytes, cloudinaryId, folder } = await uploadToCloudinary(filePath, business_id, fileName);
    
    // Calculate credits
    const credits = calculateCredits(bytes);
    
    // Get AI suggestion for image placement
    const suggestedLocation = await suggestImagePlacement(publicUrl, business_id);
    
    // Save to database
    const [mediaUpload] = await db.insert(mediaUploads).values({
      businessId: business_id,
      publicUrl,
      fileName,
      contentType,
      bytes,
      credits,
      cloudinaryId,
      folder,
      suggestedLocation,
      uploadedBy
    }).returning();
    
    // Log credit usage
    await logCreditUsage(business_id, credits, mediaUpload.id.toString());
    
    // Remove temporary file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      data: {
        id: mediaUpload.id,
        publicUrl,
        fileName,
        contentType,
        bytes,
        credits,
        suggestedLocation,
        uploadedAt: mediaUpload.uploadedAt
      }
    });
  } catch (error) {
    console.error('Media upload error:', error);
    
    // Clean up temporary file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false, 
      message: `Media upload failed: ${error.message}` 
    });
  }
}

// Get media usage statistics for a business
export async function getMediaUsage(req: Request, res: Response): Promise<void> {
  const { businessId } = req.params;
  
  if (!businessId) {
    res.status(400).json({ success: false, message: 'Business ID is required' });
    return;
  }
  
  try {
    // Get all media uploads for the business
    const uploads = await db.select().from(mediaUploads).where(eq(mediaUploads.businessId, businessId));
    
    // Calculate totals
    const totalFiles = uploads.length;
    const totalBytes = uploads.reduce((sum, upload) => sum + upload.bytes, 0);
    const totalCredits = uploads.reduce((sum, upload) => sum + upload.credits, 0);
    
    // Group by content type
    const breakdown: Record<string, { files: number, bytes: number, credits: number }> = {};
    uploads.forEach(upload => {
      const contentType = upload.contentType.split('/')[0] || 'other'; // Use main type (image, video, etc.)
      
      if (!breakdown[contentType]) {
        breakdown[contentType] = { files: 0, bytes: 0, credits: 0 };
      }
      
      breakdown[contentType].files += 1;
      breakdown[contentType].bytes += upload.bytes;
      breakdown[contentType].credits += upload.credits;
    });
    
    // Convert bytes to MB for readability
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    
    res.status(200).json({
      success: true,
      data: {
        totalFiles,
        totalBytes,
        totalMB,
        totalCredits,
        breakdown
      }
    });
  } catch (error) {
    console.error('Error fetching media usage:', error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to get media usage: ${error.message}` 
    });
  }
}

// Update media placement location
export async function updateMediaPlacement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { suggestedLocation } = req.body;
  
  if (!id) {
    res.status(400).json({ success: false, message: 'Media ID is required' });
    return;
  }
  
  if (!suggestedLocation) {
    res.status(400).json({ success: false, message: 'Suggested location is required' });
    return;
  }
  
  try {
    // Update media placement and set manual override flag
    const [updatedMedia] = await db.update(mediaUploads)
      .set({
        suggestedLocation,
        manualOverride: true,
        updatedAt: new Date()
      })
      .where(eq(mediaUploads.id, parseInt(id)))
      .returning();
    
    if (!updatedMedia) {
      res.status(404).json({ success: false, message: 'Media file not found' });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedMedia
    });
  } catch (error: any) {
    console.error('Error updating media placement:', error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to update media placement: ${error.message}` 
    });
  }
}

// Register media upload routes
export function registerMediaRoutes(app: any): void {
  // Upload media file
  app.post('/api/media/upload', upload.single('file'), handleMediaUpload);
  
  // Get media usage statistics for a business
  app.get('/api/media/usage/:businessId', getMediaUsage);
  
  // Get all media files for a business
  app.get('/api/media/files/:businessId', async (req: Request, res: Response) => {
    const { businessId } = req.params;
    
    try {
      const files = await db.select().from(mediaUploads).where(eq(mediaUploads.businessId, businessId));
      res.status(200).json({ success: true, data: files });
    } catch (error: any) {
      console.error('Error fetching media files:', error);
      res.status(500).json({ 
        success: false, 
        message: `Failed to get media files: ${error.message}` 
      });
    }
  });
  
  // Update media placement location
  app.put('/api/media/files/:id', updateMediaPlacement);
}