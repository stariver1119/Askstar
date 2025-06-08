/**
 * Detects the browser language and returns either 'ko' or 'en'
 * @returns 'ko' if browser language starts with 'ko', otherwise 'en'
 */
export function detectBrowserLanguage(): 'ko' | 'en' {
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
  return browserLang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}
