/**
 * Utility functions for cleaning and formatting text content
 */

/**
 * Removes HTML tags from text (works in both browser and Node.js)
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags using regex
  let cleaned = html
    // Remove script and style tags with their content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  
  // Decode numeric entities
  cleaned = cleaned.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  cleaned = cleaned.replace(/&#x([a-f\d]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return cleaned.trim();
}

/**
 * Removes WordPress shortcodes (e.g., [caption id="..." align="..." width="..."]...[/caption])
 */
export function stripWordPressShortcodes(text: string): string {
  if (!text) return '';
  
  let cleaned = text;
  
  // Remove WordPress caption shortcodes: [caption ...]...[/caption]
  cleaned = cleaned.replace(/\[caption[^\]]*\][\s\S]*?\[\/caption\]/gi, '');
  
  // Remove any other WordPress shortcodes: [shortcode ...] or [shortcode ...]...[/shortcode]
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');
  
  // Remove any remaining shortcode-like patterns
  cleaned = cleaned.replace(/\[\/?[^\]]+\]/g, '');
  
  return cleaned.trim();
}

/**
 * Cleans text by removing HTML tags and WordPress shortcodes
 */
export function cleanText(text: string): string {
  if (!text) return '';
  
  // First strip WordPress shortcodes
  let cleaned = stripWordPressShortcodes(text);
  
  // Then strip HTML tags
  cleaned = stripHtmlTags(cleaned);
  
  // Clean up extra whitespace but preserve newlines
  // First normalize newlines
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Replace multiple spaces/tabs (but not newlines) with single space
  cleaned = cleaned.replace(/[^\S\n]+/g, ' ');
  // Replace multiple consecutive newlines with double newline
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  // Trim each line
  cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');
  // Remove leading/trailing newlines
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * Sanitizes HTML content for display
 * - Removes WordPress shortcodes (e.g., [caption], [gallery], etc.)
 * - Replaces &nbsp; with regular spaces (allows word wrapping)
 * - Converts inline bullet points (•, –) to line breaks for better desktop display
 * - Preserves HTML structure (p, br, strong, etc.)
 */
export function sanitizeHtmlContent(html: string): string {
  if (!html) return '';

  // First, remove WordPress shortcodes
  let sanitized = stripWordPressShortcodes(html);

  // Replace &nbsp; with regular space to allow word wrapping
  sanitized = sanitized.replace(/&nbsp;/g, ' ');

  // Convert inline bullet points to line breaks for better display
  // Only match bullet (•) and en-dash (–), NOT regular hyphen (-) to avoid breaking words like "e-commerce"
  // This converts inline lists like "• Item 1 • Item 2 • Item 3" to proper line breaks
  sanitized = sanitized.replace(/([a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF.,;:!?\)\]\}])\s*([•–])\s+/g, '$1<br/>$2 ');

  // Replace multiple consecutive spaces with single space
  sanitized = sanitized.replace(/  +/g, ' ');

  return sanitized;
}

/**
 * Formats text for display: ensures bullet points are on separate lines
 */
export function formatDescription(text: string): string {
  if (!text) return '';
  
  // First clean the text
  let formatted = cleanText(text);
  
  // Ensure each bullet point (– or -) starts on a new line
  formatted = formatted.replace(/([^\n])\s*[–-]\s*/g, '$1\n– ');
  formatted = formatted.replace(/^[–-]\s*/, '– ');
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Trim and format each line
  return formatted
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

