import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import archiver from 'archiver';

// Creates a zip file containing all required project data
export async function createBackupZip(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  const backupFilename = `progress_accountants_backup_${timestamp}.zip`;
  const backupPath = path.join(backupDir, backupFilename);
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Create zip file
  const output = createWriteStream(backupPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression level
  });
  
  // Listen for errors
  archive.on('error', (err) => {
    throw err;
  });
  
  // Pipe archive data to the file
  archive.pipe(output);
  
  // Add directories to the archive
  const dirsToAdd = [
    'logs',
    'config',
    'uploads',
    'assets'
  ];
  
  for (const dir of dirsToAdd) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      archive.directory(dirPath, dir);
    }
  }
  
  // Add individual files
  const filesToAdd = [
    'env_template.json'
  ];
  
  for (const file of filesToAdd) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: file });
    }
  }
  
  // Generate and add manifest.json
  const manifest = generateManifest(dirsToAdd, filesToAdd);
  const manifestJson = JSON.stringify(manifest, null, 2);
  archive.append(manifestJson, { name: 'manifest.json' });
  
  // Finalize archive
  await archive.finalize();
  
  return backupPath;
}

// Generate manifest.json content
function generateManifest(directories: string[], files: string[]): any {
  return {
    project: "progress_accountants",
    backup_type: "auto",
    created_at: new Date().toISOString(),
    files_included: [...directories, ...files, 'manifest.json'],
    secrets_included: false,
    notes: "Assistant logs included. No secrets exported for security."
  };
}

// Send backup to NextMonth Vault
export async function sendBackupToVault(backupPath: string): Promise<boolean> {
  try {
    const endpoint = process.env.NEXTMONTH_BACKUP_ENDPOINT || 'https://nextmonth.ai/wp-json/nextmonth/v1/project-backup';
    
    // Create form data
    const formData = new FormData();
    formData.append('project', 'progress_accountants');
    formData.append('timestamp', new Date().toISOString());
    
    // Add file
    const fileBuffer = fs.readFileSync(backupPath);
    const filename = path.basename(backupPath);
    
    // Create a Blob from the file buffer
    const fileBlob = new Blob([fileBuffer]);
    formData.append('file', fileBlob, filename);
    
    // Send request
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send backup: ${response.statusText}`);
    }
    
    console.log(`Backup successfully sent to NextMonth Vault: ${filename}`);
    return true;
    
  } catch (error) {
    console.error('Error sending backup to vault:', error);
    return false;
  }
}

// Trigger backup process (can be called manually or on schedule)
export async function triggerBackup(): Promise<void> {
  try {
    console.log('Starting backup process...');
    const backupPath = await createBackupZip();
    console.log(`Backup created: ${backupPath}`);
    
    const sent = await sendBackupToVault(backupPath);
    if (sent) {
      console.log('Backup process completed successfully');
    } else {
      console.error('Failed to send backup to NextMonth Vault');
    }
  } catch (error) {
    console.error('Backup process failed:', error);
  }
}