export function toEnglishDigits(str: string): string {
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)));
}

/**
 * Converts any audio duration string (e.g. "۱۵ دقیقه", "یک ساعت و ۱۰ دقیقه", "12 دقیقه")
 * into clean numeric format: "HH.MM.SS" (e.g. "00.15.00", "01.10.00") without Persian words.
 */
export function formatDurationNumeric(dur: string | undefined | null): string {
  if (!dur) return '00.00.00';
  const clean = toEnglishDigits(dur.trim());

  // Check if already numeric like 01.02.00 or 01:02:00 or 15:00
  const numMatch = clean.match(/^(\d{1,2})[:.](\d{1,2})(?:[:.](\d{1,2}))?$/);
  if (numMatch) {
    if (numMatch[3] !== undefined) {
      const h = numMatch[1].padStart(2, '0');
      const m = numMatch[2].padStart(2, '0');
      const s = numMatch[3].padStart(2, '0');
      return `${h}.${m}.${s}`;
    } else {
      const m = numMatch[1].padStart(2, '0');
      const s = numMatch[2].padStart(2, '0');
      return `00.${m}.${s}`;
    }
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (clean.includes('یک ساعت') || clean.includes('1 ساعت')) hours = 1;
  else if (clean.includes('دو ساعت') || clean.includes('2 ساعت')) hours = 2;
  else if (clean.includes('سه ساعت') || clean.includes('3 ساعت')) hours = 3;
  else {
    const hMatch = clean.match(/(\d+)\s*ساعت/);
    if (hMatch) hours = parseInt(hMatch[1], 10);
  }

  const mMatch = clean.match(/(\d+)\s*دقیقه/);
  if (mMatch) {
    minutes = parseInt(mMatch[1], 10);
  } else if (clean.includes('نیم ساعت')) {
    minutes = 30;
  }

  const sMatch = clean.match(/(\d+)\s*ثانیه/);
  if (sMatch) {
    seconds = parseInt(sMatch[1], 10);
  }

  // If only a single number exists in the string (e.g. '15')
  if (hours === 0 && minutes === 0 && seconds === 0) {
    const singleMatch = clean.match(/\d+/);
    if (singleMatch) minutes = parseInt(singleMatch[0], 10);
  }

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return `${hStr}.${mStr}.${sStr}`;
}
