/**
 * Utility to calculate estimated reading time for Persian articles automatically based on word count.
 * Average reading speed: ~200 words per minute.
 */

export function convertToPersianDigits(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (w) => persianDigits[parseInt(w, 10)]);
}

export function calculateReadingTimeFa(content: string = ''): string {
  if (!content || !content.trim()) {
    return '۱ دقیقه';
  }

  // Remove markdown symbols and extra spaces
  const cleanText = content
    .replace(/[*#_`~>\[\]\(\)\-\+=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  
  // ~200 words per minute reading speed
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${convertToPersianDigits(minutes)} دقیقه`;
}
