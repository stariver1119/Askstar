/**
 * Manual Sun sign (solar palace) calculator
 * 
 * This utility determines the sun sign based on birth date
 * without relying on the astrology library's calculation.
 */
import type { ZodiacSign } from '../components/ZodiacIcon';

/**
 * Determines the sun sign (zodiac sign) based on month and day
 * 
 * @param month The birth month (1-12) - IMPORTANT: Uses 1-indexed months (January=1, December=12)
 * @param day The birth day (1-31) - Uses standard 1-indexed days
 * @returns The sun sign as a ZodiacSign type
 */
export const calculateSunSign = (month: number, day: number): ZodiacSign => {
  // Validate input
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error('Invalid month or day');
  }

  // Define zodiac sign date ranges
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'aries'; // March 21 - April 19
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'taurus'; // April 20 - May 20
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'gemini'; // May 21 - June 20
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'cancer'; // June 21 - July 22
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'leo'; // July 23 - August 22
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'virgo'; // August 23 - September 22
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'libra'; // September 23 - October 22
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'scorpio'; // October 23 - November 21
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'sagittarius'; // November 22 - December 21
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return 'capricorn'; // December 22 - January 19
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'aquarius'; // January 20 - February 18
  } else {
    return 'pisces'; // February 19 - March 20
  }
};
