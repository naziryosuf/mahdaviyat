export function toEnglishDigits(str: string): string {
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)));
}

// Natural WhatsApp Voice Wave Heights
export const AUDIO_WAVE_HEIGHTS: number[] = [28, 50, 20, 18, 57, 85, 20, 48, 100, 78, 12, 25, 88, 28, 28, 55, 72, 12, 22, 38, 95, 65, 18, 45, 22];

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

/**
 * Parses any duration string (Persian or numeric, e.g. "12 دقیقه", "12:18", "00.12.00")
 * into total seconds.
 */
export function parseDurationToSeconds(dur: string | undefined | null): number {
  if (!dur) return 0;
  const clean = toEnglishDigits(dur.trim());

  // Check if numeric format e.g. "01:12:00", "01.12.00", "12:18", "12.18"
  const numMatch = clean.match(/^(\d{1,2})[:.](\d{1,2})(?:[:.](\d{1,2}))?$/);
  if (numMatch) {
    if (numMatch[3] !== undefined) {
      const h = parseInt(numMatch[1], 10);
      const m = parseInt(numMatch[2], 10);
      const s = parseInt(numMatch[3], 10);
      return h * 3600 + m * 60 + s;
    } else {
      const m = parseInt(numMatch[1], 10);
      const s = parseInt(numMatch[2], 10);
      return m * 60 + s;
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

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats remaining playback seconds into numeric countdown string with dots:
 * e.g. "11.59", "11.58" (or "01.12.45" if total duration >= 1 hour).
 */
export function formatRemainingCountdown(remainingSec: number, totalSec?: number): string {
  if (isNaN(remainingSec) || !isFinite(remainingSec) || remainingSec < 0) {
    remainingSec = 0;
  }
  const total = totalSec !== undefined && isFinite(totalSec) && totalSec > 0 ? totalSec : remainingSec;
  const isOverHour = total >= 3600;

  const totalRemaining = Math.ceil(remainingSec);
  const hours = Math.floor(totalRemaining / 3600);
  const minutes = Math.floor((totalRemaining % 3600) / 60);
  const seconds = Math.floor(totalRemaining % 60);

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  if (isOverHour) {
    const hStr = String(hours).padStart(2, '0');
    return `${hStr}.${mStr}.${sStr}`;
  }

  return `${mStr}.${sStr}`;
}

