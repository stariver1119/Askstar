/**
 * Date correction utility for astrological calculations
 * 
 * This utility adjusts dates to account for UTC differences in astrological calculations.
 * It adds one day to the input date to ensure accurate solar palace calculations.
 */

/**
 * Corrects a date for astrological calculations by adding one day
 * If input is 2000-01-01, it returns 2000-01-02
 * If input is December 31, it returns January 1 of the next year
 * If input is the last day of a month, it returns the first day of the next month
 * 
 * @param year The year to correct
 * @param month The month to correct (1-12)
 * @param day The day to correct
 * @returns An object with corrected year, month, and day
 */
export const correctDateForAstrology = (
  year: number,
  month: number,
  day: number
): { year: number; month: number; day: number } => {
  // Special case for last day of the year
  if (month === 12 && day === 31) {
    return {
      year: year + 1,
      month: 1,
      day: 1
    };
  }
  
  // Special case for last day of the month
  const daysInMonth = getDaysInMonth(year, month);
  if (day === daysInMonth) {
    // If it's the last day of the month, return the first day of the next month
    if (month === 12) {
      // December case is handled above, but just to be safe
      return {
        year: year + 1,
        month: 1,
        day: 1
      };
    } else {
      return {
        year,
        month: month + 1,
        day: 1
      };
    }
  }
  
  // Regular case: just add one day
  return {
    year,
    month,
    day: day + 1
  };
};

/**
 * Returns the number of days in a given month
 * 
 * @param year The year
 * @param month The month (1-12)
 * @returns The number of days in the month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  // Month is 0-indexed in Date constructor
  return new Date(year, month, 0).getDate();
};

/**
 * Checks if a year is a leap year
 * 
 * @param year The year to check
 * @returns True if the year is a leap year, false otherwise
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};
