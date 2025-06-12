import { Horoscope, Origin } from 'circular-natal-horoscope-js';

// Define zodiac sign type
export type ZodiacSign = 
  | 'aries' 
  | 'taurus' 
  | 'gemini' 
  | 'cancer' 
  | 'leo' 
  | 'virgo' 
  | 'libra' 
  | 'scorpio' 
  | 'sagittarius' 
  | 'capricorn' 
  | 'aquarius' 
  | 'pisces';

// Type guard to check if a string is a valid ZodiacSign
export function isValidZodiacSign(sign: string): sign is ZodiacSign {
  const validSigns: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 
    'leo', 'virgo', 'libra', 'scorpio', 
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  return validSigns.includes(sign as ZodiacSign);
}

// Big 3 calculation result interface
export interface Big3Result {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
}

// Birth data interface
export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
}

/**
 * Calculate Big 3 (Sun, Moon, Rising) based on birth data
 * @param birthData Birth date, time, and location data
 * @returns The calculated Big 3 zodiac signs
 */
export const calculateBig3 = (birthData: BirthData): Big3Result => {
  try {
    // Log input data for debugging
    console.log('Calculating Big 3 with data:', JSON.stringify(birthData, null, 2));
    
    // Validate input data
    if (!birthData.year || !birthData.month || !birthData.day || 
        birthData.hour === undefined || birthData.minute === undefined ||
        !birthData.latitude || !birthData.longitude) {
      console.error('Invalid birth data:', birthData);
      throw new Error('Invalid birth data provided');
    }
    
    // Create origin object for the horoscope using the Origin class
    // The Origin class properly handles date/time conversions and timezone calculations
    console.log('Creating Origin with:', {
      year: birthData.year,
      month: birthData.month - 1, // 0-11 in the library (0 = January)
      date: birthData.day,    // 1-31
      hour: birthData.hour,   // 0-23
      minute: birthData.minute, // 0-59
      latitude: birthData.latitude,
      longitude: birthData.longitude
    });
    
    // Create an Origin object which handles timezone calculations
    const origin = new Origin({
      year: birthData.year,
      month: birthData.month - 1, // 0-11 in the library (0 = January)
      date: birthData.day,    // 1-31
      hour: birthData.hour,   // 0-23
      minute: birthData.minute, // 0-59
      latitude: birthData.latitude,
      longitude: birthData.longitude
    });
    
    console.log('Origin created successfully:', origin);
    
    // Create a new horoscope using the circular-natal-horoscope-js library
    // Pass the origin object instead of raw data
    const horoscope = new Horoscope({
      origin: origin,
      houseSystem: 'placidus',
      zodiac: 'tropical',
      aspectPoints: ['bodies', 'points', 'angles'],
      aspectWithPoints: ['bodies', 'points', 'angles'],
      aspectTypes: ['major', 'minor'],
    });
    
    // Log raw chart data with detailed information
    console.log('Horoscope created successfully');
    
    try {
      // Log all available data for debugging
      console.log('Sun Sign:', horoscope.SunSign.key);
      console.log('Sun Sign Full Data:', horoscope.SunSign);
      console.log('Moon Sign:', horoscope.CelestialBodies.moon.Sign.key);
      console.log('Moon Sign Full Data:', horoscope.CelestialBodies.moon);
      console.log('Ascendant Sign:', horoscope.Ascendant.Sign.key);
      console.log('Ascendant Full Data:', horoscope.Ascendant);
      
      // Log house system and zodiac info
      console.log('House System:', horoscope._houseSystem);
      console.log('Zodiac System:', horoscope._zodiac);
      
      // Log origin data used for calculation
      console.log('Origin Local Time:', origin.localTime);
      console.log('Origin UTC Time:', origin.utcTime);
      console.log('Origin Julian Date:', origin.julianDate);
      console.log('Origin Local Sidereal Time:', origin.localSiderealTime);
    } catch (err) {
      console.error('Error accessing horoscope properties:', err);
    }

    // Get sun sign and ensure it's a valid ZodiacSign
    const rawSunSign = horoscope.SunSign.key.toLowerCase();
    const sunSign = isValidZodiacSign(rawSunSign) ? rawSunSign : 'aries';
    
    // Get moon sign and ensure it's a valid ZodiacSign
    const rawMoonSign = horoscope.CelestialBodies.moon.Sign.key.toLowerCase();
    const moonSign = isValidZodiacSign(rawMoonSign) ? rawMoonSign : 'aries';
    
    // Get rising sign (ascendant) and ensure it's a valid ZodiacSign
    const rawRisingSign = horoscope.Ascendant.Sign.key.toLowerCase();
    const risingSign = isValidZodiacSign(rawRisingSign) ? rawRisingSign : 'aries';

    const result = {
      sunSign,
      moonSign,
      risingSign
    };
    
    console.log('Calculated Big 3 result:', result);
    return result;
  } catch (error) {
    console.error('Error calculating Big 3:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Log the input data that caused the error
    console.error('Input data that caused error:', birthData);
    
    // Return default values in case of error
    const defaultResult: Big3Result = {
      sunSign: 'aries',
      moonSign: 'aries',
      risingSign: 'aries'
    };
    console.log('Returning default result due to error:', defaultResult);
    return defaultResult;
  }
};
