// Count words in a string
export const countWords = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  return text.trim().split(/\s+/).length;
};

// Count characters in a string
export const countCharacters = (text: string): number => {
  return text.length;
};

// Estimate reading time in minutes (average 200 words per minute)
export const estimateReadingTime = (text: string): number => {
  const words = countWords(text);
  return Math.ceil(words / 200);
};

// Truncate text with ellipsis
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Highlight search matches in text
export const highlightText = (text: string, search: string): string => {
  if (!search || !text) return text;
  
  const regex = new RegExp(`(${escapeRegExp(search)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Escape special regex characters
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
