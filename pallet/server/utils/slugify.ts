/**
 * Converts a string into a URL-friendly slug
 * 
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export default function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')           // Split accented characters into base character and accent
    .replace(/[\u0300-\u036f]/g, '') // Remove accent characters
    .toLowerCase()              // Convert to lowercase
    .trim()                     // Remove whitespace from both ends
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')    // Remove non-word characters except hyphens
    .replace(/--+/g, '-')       // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '')         // Remove leading hyphens
    .replace(/-+$/, '');        // Remove trailing hyphens
}