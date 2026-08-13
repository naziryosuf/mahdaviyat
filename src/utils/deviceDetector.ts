export function getDeviceDetails(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'دستگاه ناشناخته (Server)';
  }

  const ua = navigator.userAgent || '';
  
  // Specific Mobile Model Detection
  if (/Redmi/i.test(ua)) {
    const match = ua.match(/Redmi\s+[\w\s]+/i);
    return match ? match[0] : 'REDMI Mobile';
  }
  if (/POCO/i.test(ua)) {
    const match = ua.match(/POCO\s+[\w\s]+/i);
    return match ? match[0] : 'POCO Mobile';
  }
  if (/Galaxy|SM-[A-Z0-9]+/i.test(ua)) {
    return 'Samsung Galaxy Mobile';
  }
  if (/iPhone/i.test(ua)) {
    return 'Apple iPhone';
  }
  if (/iPad/i.test(ua)) {
    return 'Apple iPad';
  }

  // Generic OS / Browser Detection
  let os = 'Unknown OS';
  if (ua.includes('Win')) os = 'Windows Desktop';
  else if (ua.includes('Mac')) os = 'macOS Desktop';
  else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux Desktop';
  else if (ua.includes('Android')) os = 'Android Mobile';

  let browser = '';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

  return browser ? `${os} (${browser})` : os;
}
