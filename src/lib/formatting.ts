import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize and format text with basic markdown-like syntax.
 * Uses DOMPurify to prevent XSS attacks.
 *
 * Supported syntax:
 * - **text** → bold
 * - *text* → italic
 * - __text__ → underline
 * - • item → bullet list
 * - 1. item → numbered list
 * - Line breaks preserved
 */
export function renderFormattedText(text: string): string {
  if (!text) return '';

  // First, escape any HTML to prevent XSS
  let formattedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Now apply markdown-like formatting to escaped text
  formattedText = formattedText
    // Bold: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Underline: __text__ -> <u>text</u>
    .replace(/__(.*?)__/g, '<u>$1</u>');

  // Handle bullet points and numbered lists line by line
  const lines = formattedText.split('\n');
  const formattedLines = lines.map(line => {
    if (line.trim().startsWith('• ')) {
      return `<li>${line.trim().substring(2)}</li>`;
    }
    if (/^\d+\.\s/.test(line.trim())) {
      return `<li>${line.trim().replace(/^\d+\.\s/, '')}</li>`;
    }
    return line;
  });

  // Join lines with <br> tags
  formattedText = formattedLines.join('<br>');

  // Wrap consecutive list items in <ul> tags
  if (formattedText.includes('<li>')) {
    formattedText = formattedText.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  }

  // Sanitize the final HTML with DOMPurify
  // Only allow safe formatting tags
  return DOMPurify.sanitize(formattedText, {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}
