import { db } from "../db";
import { pageBuilderPages, pageBuilderComponents, pageBuilderSections } from "@shared/schema";
import { eq, and, or } from "drizzle-orm";

/**
 * Interface for keyword analysis results
 */
export interface KeywordAnalysisResult {
  totalWords: number;
  primaryKeyword: {
    keyword: string;
    count: number;
    density: number;
    positions: number[];
    suggestions: string[];
  };
  secondaryKeywords: Array<{
    keyword: string;
    count: number;
    density: number;
    positions: number[];
  }>;
  relatedKeywords: string[];
  overuseWarnings: string[];
  recommendations: string[];
}

/**
 * Analyze keyword density and usage for a page
 * @param pageId - ID of the page to analyze
 * @returns Detailed keyword analysis
 */
export async function analyzeKeywordDensity(pageId: number): Promise<KeywordAnalysisResult> {
  try {
    // Get page with its sections and components
    const page = await getPageWithComponents(pageId);
    
    if (!page) {
      throw new Error("Page not found");
    }

    // Extract page content
    const { fullText, words } = extractPageContent(page);
    
    // Get primary keyword from page SEO settings
    const pageSeo = page.seo as any || {};
    const primaryKeyword = pageSeo.primaryKeyword || '';
    const secondaryKeywords = pageSeo.keywords || [];
    
    // Initialize result
    const result: KeywordAnalysisResult = {
      totalWords: words.length,
      primaryKeyword: {
        keyword: primaryKeyword,
        count: 0,
        density: 0,
        positions: [],
        suggestions: []
      },
      secondaryKeywords: [],
      relatedKeywords: [],
      overuseWarnings: [],
      recommendations: []
    };
    
    // Analyze primary keyword
    if (primaryKeyword) {
      const primaryAnalysis = analyzeKeyword(words, primaryKeyword);
      result.primaryKeyword.count = primaryAnalysis.count;
      result.primaryKeyword.density = primaryAnalysis.density;
      result.primaryKeyword.positions = primaryAnalysis.positions;
      
      // Add recommendations based on density
      if (primaryAnalysis.density === 0) {
        result.recommendations.push(`Your primary keyword "${primaryKeyword}" is not present in the content. Consider adding it naturally to your text.`);
        
        // Suggest variations of the keyword
        result.primaryKeyword.suggestions = suggestKeywordVariations(primaryKeyword);
      } else if (primaryAnalysis.density < 0.5) {
        result.recommendations.push(`Your primary keyword "${primaryKeyword}" density is low (${(primaryAnalysis.density * 100).toFixed(2)}%). Consider using it more prominently, especially in headings and first paragraph.`);
      } else if (primaryAnalysis.density > 3) {
        result.overuseWarnings.push(`Your primary keyword "${primaryKeyword}" appears too frequently (${(primaryAnalysis.density * 100).toFixed(2)}%). This might be seen as keyword stuffing.`);
      }
      
      // Check if primary keyword appears in title
      if (pageSeo.title && !pageSeo.title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        result.recommendations.push(`Your primary keyword "${primaryKeyword}" is not in your page title. Adding it can improve SEO ranking.`);
      }
      
      // Check if primary keyword appears in the first 100 words
      const isInIntro = primaryAnalysis.positions.some(pos => pos < 100);
      if (!isInIntro && primaryAnalysis.count > 0) {
        result.recommendations.push(`Your primary keyword "${primaryKeyword}" doesn't appear in the first 100 words. Consider adding it to your introduction.`);
      }
    } else {
      result.recommendations.push("No primary keyword defined. Set a primary keyword in your SEO settings to improve optimization efforts.");
    }
    
    // Analyze secondary keywords
    for (const keyword of secondaryKeywords) {
      if (keyword && typeof keyword === 'string') {
        const analysis = analyzeKeyword(words, keyword);
        
        result.secondaryKeywords.push({
          keyword,
          count: analysis.count,
          density: analysis.density,
          positions: analysis.positions
        });
        
        // Add keyword-specific recommendations
        if (analysis.density > 2.5) {
          result.overuseWarnings.push(`Your secondary keyword "${keyword}" appears too frequently (${(analysis.density * 100).toFixed(2)}%). Consider reducing usage.`);
        }
      }
    }
    
    // Suggest related keywords based on content
    result.relatedKeywords = identifyRelatedKeywords(words, primaryKeyword);
    
    return result;
  } catch (error) {
    console.error("Error analyzing keyword density:", error);
    
    // Return default analysis in case of error
    return {
      totalWords: 0,
      primaryKeyword: {
        keyword: '',
        count: 0,
        density: 0,
        positions: [],
        suggestions: []
      },
      secondaryKeywords: [],
      relatedKeywords: [],
      overuseWarnings: [],
      recommendations: [
        "An error occurred while analyzing keywords. Please try again later.",
        "Ensure you have set a primary keyword in your SEO settings."
      ]
    };
  }
}

/**
 * Suggest variations and related forms of a keyword
 */
function suggestKeywordVariations(keyword: string): string[] {
  const variations: string[] = [];
  
  // Simple word transformations
  if (keyword) {
    // Add plural form for singular keywords
    if (!keyword.endsWith('s') && !keyword.endsWith('es')) {
      variations.push(`${keyword}s`);
    }
    
    // Add singular form for plural keywords
    if (keyword.endsWith('s') && !keyword.endsWith('ss')) {
      variations.push(keyword.slice(0, -1));
    }
    
    // Add variations with common prefixes
    const commonPrefixes = ['best', 'top', 'guide to', 'how to', 'affordable', 'professional'];
    for (const prefix of commonPrefixes) {
      variations.push(`${prefix} ${keyword}`);
    }
    
    // Add variations with common suffixes
    const commonSuffixes = ['guide', 'tips', 'advice', 'service', 'solutions'];
    for (const suffix of commonSuffixes) {
      variations.push(`${keyword} ${suffix}`);
    }
  }
  
  // Return unique variations, up to 5
  return [...new Set(variations)].slice(0, 5);
}

/**
 * Identify potentially related keywords based on content
 */
function identifyRelatedKeywords(words: string[], primaryKeyword: string): string[] {
  // This is a simplified version - in a real system, this would use
  // more advanced NLP techniques or external APIs for better suggestions
  
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for',
    'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or',
    'such', 'that', 'the', 'their', 'then', 'there', 'these',
    'they', 'this', 'to', 'was', 'will', 'with'
  ]);
  
  // Count word frequencies
  const wordCounts: Record<string, number> = {};
  
  for (const word of words) {
    // Skip stop words and short words
    if (word.length < 4 || stopWords.has(word.toLowerCase())) {
      continue;
    }
    
    const lowerWord = word.toLowerCase();
    wordCounts[lowerWord] = (wordCounts[lowerWord] || 0) + 1;
  }
  
  // Sort by frequency and get top words
  let candidates = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .filter(word => word.toLowerCase() !== primaryKeyword.toLowerCase())
    .slice(0, 10);
    
  // Add some bigrams (combinations of 2 consecutive words)
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length >= 4 && words[i+1].length >= 4) {
      const bigram = `${words[i].toLowerCase()} ${words[i+1].toLowerCase()}`;
      if (!stopWords.has(words[i].toLowerCase()) && !stopWords.has(words[i+1].toLowerCase())) {
        bigrams.push(bigram);
      }
    }
  }
  
  // Count bigram frequencies and get top ones
  const bigramCounts: Record<string, number> = {};
  for (const bigram of bigrams) {
    bigramCounts[bigram] = (bigramCounts[bigram] || 0) + 1;
  }
  
  const topBigrams = Object.entries(bigramCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .filter(bigram => !bigram.includes(primaryKeyword.toLowerCase()))
    .slice(0, 5);
  
  // Combine single words and bigrams
  candidates = [...candidates, ...topBigrams].slice(0, 10);
  
  return candidates;
}

/**
 * Analyze a specific keyword in the content
 */
function analyzeKeyword(words: string[], keyword: string): { count: number; density: number; positions: number[] } {
  if (!keyword) {
    return { count: 0, density: 0, positions: [] };
  }
  
  const keywordLower = keyword.toLowerCase();
  const keywordParts = keywordLower.split(' ');
  
  let count = 0;
  const positions: number[] = [];
  
  // For single-word keywords
  if (keywordParts.length === 1) {
    for (let i = 0; i < words.length; i++) {
      if (words[i].toLowerCase() === keywordLower) {
        count++;
        positions.push(i);
      }
    }
  }
  // For multi-word keywords
  else {
    for (let i = 0; i <= words.length - keywordParts.length; i++) {
      let matches = true;
      
      for (let j = 0; j < keywordParts.length; j++) {
        if (words[i + j].toLowerCase() !== keywordParts[j]) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        count++;
        positions.push(i);
      }
    }
  }
  
  // Calculate density as percentage of total words
  const density = words.length > 0 ? (count / words.length) : 0;
  
  return { count, density, positions };
}

/**
 * Extracts full content from a page
 */
function extractPageContent(page: any): { fullText: string; words: string[] } {
  const textParts: string[] = [];
  
  // Process all sections and their components
  if (page.sections) {
    page.sections.forEach((section: any) => {
      if (section.components) {
        section.components.forEach((component: any) => {
          // Extract content based on component type
          if (component.content) {
            // Text content
            if (component.type === 'text' || component.type === 'richtext' || component.type === 'paragraph') {
              textParts.push(component.content.text || '');
            }
            
            // Headings
            if (component.type === 'heading') {
              textParts.push(component.content.text || '');
            }
          }
        });
      }
    });
  }
  
  // Combine all text parts
  const fullText = textParts.join(' ');
  
  // Split into words, removing punctuation
  const words = fullText
    .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
    .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
    .trim()
    .split(' ')
    .filter(word => word.length > 0);
  
  return { fullText, words };
}

/**
 * Retrieves a page with all its sections and components
 */
async function getPageWithComponents(pageId: number) {
  try {
    // Get the page
    const [page] = await db
      .select()
      .from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      return null;
    }
    
    // Get all sections for the page
    const sections = await db
      .select()
      .from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, pageId))
      .orderBy(pageBuilderSections.order);
    
    // Get all components for each section
    const sectionIds = sections.map(section => section.id);
    let components: any[] = [];
    
    if (sectionIds.length > 0) {
      components = await db
        .select()
        .from(pageBuilderComponents)
        .where(
          or(...sectionIds.map(id => eq(pageBuilderComponents.sectionId, id)))
        )
        .orderBy(pageBuilderComponents.order);
    }
    
    // Add components to their respective sections
    const sectionsWithComponents = sections.map(section => ({
      ...section,
      components: components.filter(comp => comp.sectionId === section.id)
    }));
    
    // Return the complete page structure
    return {
      ...page,
      sections: sectionsWithComponents
    };
  } catch (error) {
    console.error("Error fetching page with components:", error);
    return null;
  }
}