import fs from 'fs';
import path from 'path';
import { log } from './vite';
import OpenAI from 'openai';

// Types for feature request classification
export type ModuleCategory = 'template_ready' | 'simple_custom' | 'wishlist';

export interface ModuleRegistry {
  [key: string]: ModuleCategory;
}

export interface WishlistItem {
  business_id: string;
  description: string;
  category: 'screen' | 'feature' | 'automation' | 'unknown';
  submitted_at: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Loads the modules registry from the config file
 */
export function loadModulesRegistry(): ModuleRegistry {
  try {
    const filePath = path.join(process.cwd(), 'config', 'modules.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as ModuleRegistry;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Error loading modules registry: ${errorMessage}`, 'feature-screening');
    // Return a minimal default registry if file can't be loaded
    return {
      "analytics": "template_ready",
      "simple_info_page": "simple_custom",
      "client_upload_portal": "wishlist"
    };
  }
}

/**
 * Classifies a feature request based on its description
 */
export async function classifyFeatureRequest(description: string): Promise<{
  category: ModuleCategory;
  matchedModule?: string;
}> {
  const modulesRegistry = loadModulesRegistry();
  
  // First, try a simple keyword match
  const normalizedDescription = description.toLowerCase().trim();
  
  for (const [module, category] of Object.entries(modulesRegistry)) {
    if (normalizedDescription.includes(module)) {
      return { 
        category, 
        matchedModule: module 
      };
    }
  }
  
  // If no direct match, use OpenAI to classify
  try {
    if (!process.env.OPENAI_API_KEY) {
      log('No OpenAI API key provided, defaulting to wishlist category', 'feature-screening');
      return { category: 'wishlist' };
    }
    
    const modulesList = Object.keys(modulesRegistry).join(', ');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a feature request classifier. You will be given a description of a feature request, and your task is to determine the most closely matching module from this list: ${modulesList}. Only respond with the exact module name that best matches. If none match well, respond with "unknown".`
        },
        {
          role: "user",
          content: description
        }
      ],
      temperature: 0.3, // Keep the response focused and precise
      max_tokens: 50
    });
    
    const predictedModule = response.choices[0].message.content?.toLowerCase().trim() || 'unknown';
    
    if (predictedModule !== 'unknown' && modulesRegistry[predictedModule]) {
      return {
        category: modulesRegistry[predictedModule],
        matchedModule: predictedModule
      };
    }
    
    // No match found or AI returned "unknown"
    return { category: 'wishlist' };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Error classifying with OpenAI: ${errorMessage}`, 'feature-screening');
    
    // Default to wishlist if classification fails
    return { category: 'wishlist' };
  }
}

/**
 * Determines the appropriate response based on the feature category
 */
export function getResponseForCategory(category: ModuleCategory, moduleName?: string): string {
  switch (category) {
    case 'template_ready':
      return `Great news — the ${moduleName || 'requested module'} already exists as a template in our system. I'll send it over to the development team right away for integration into your project.`;
      
    case 'simple_custom':
      return `We don't have a pre-built template for this specific request yet, but it's relatively straightforward to implement. I'll draft the specifications and submit it to our development team for creation.`;
      
    case 'wishlist':
      return `That's an interesting idea! It would require some additional development work from our team, so I've added it to our Wishlist for future consideration. In the meantime, would you like to explore a simpler alternative or discuss other options that might meet your needs?`;
      
    default:
      return `Thank you for your feature request. I'll look into this and get back to you with more information on how we can proceed.`;
  }
}

/**
 * Submits a wishlist item to the NextMonth API
 */
export async function submitToWishlist(request: WishlistItem): Promise<boolean> {
  try {
    const response = await fetch('https://nextmonth.ai/wp-json/nextmonth/v1/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to submit to wishlist: ${response.statusText}`);
    }
    
    const result = await response.json();
    log(`Wishlist item submitted successfully: ${JSON.stringify(result)}`, 'feature-screening');
    return true;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Error submitting to wishlist: ${errorMessage}`, 'feature-screening');
    return false;
  }
}

/**
 * Determines the best category (screen, feature, etc.) for a wishlist item
 */
export async function determineRequestCategory(description: string): Promise<'screen' | 'feature' | 'automation' | 'unknown'> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return 'unknown';
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `Classify the following feature request into exactly one of these categories: "screen" (new UI), "feature" (new functionality), "automation" (process improvement), or "unknown". Only respond with the category name, nothing else.`
        },
        {
          role: "user",
          content: description
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });
    
    const category = response.choices[0].message.content?.toLowerCase().trim();
    
    if (category === 'screen' || category === 'feature' || category === 'automation') {
      return category;
    }
    
    return 'unknown';
    
  } catch (error) {
    log(`Error determining request category: ${error}`, 'feature-screening');
    return 'unknown';
  }
}

/**
 * Handles the full screening process for a feature request
 */
export async function handleFeatureRequest(description: string): Promise<{
  category: ModuleCategory;
  response: string;
  shouldSubmitToDev: boolean;
  wishlistSubmitted?: boolean;
  matchedModule?: string;
}> {
  // Classify the request
  const { category, matchedModule } = await classifyFeatureRequest(description);
  
  // Generate appropriate response
  const response = getResponseForCategory(category, matchedModule);
  
  // Determine if we should submit to dev
  const shouldSubmitToDev = category === 'template_ready' || category === 'simple_custom';
  
  // Submit to wishlist if needed
  let wishlistSubmitted = false;
  
  if (category === 'wishlist') {
    const requestCategory = await determineRequestCategory(description);
    
    const wishlistItem: WishlistItem = {
      business_id: 'progress_accountants',
      description,
      category: requestCategory,
      submitted_at: new Date().toISOString()
    };
    
    wishlistSubmitted = await submitToWishlist(wishlistItem);
  }
  
  return {
    category,
    response,
    shouldSubmitToDev,
    wishlistSubmitted,
    matchedModule
  };
}