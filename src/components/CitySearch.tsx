import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CitySearchProps {
  value: string;
  onChange: (city: string, latitude: number, longitude: number) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  error?: string;
  onInputChange?: () => void; // Added prop for tracking input attempts
}

interface CityResult {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

// Define Nominatim API response type
interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  country?: string;
  [key: string]: string | undefined;
}

interface NominatimResponse {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: NominatimAddress;
  [key: string]: string | number | NominatimAddress | unknown; // For other properties we don't use
}

const CitySearch: React.FC<CitySearchProps> = ({
  value,
  onChange,
  placeholder,
  label,
  icon,
  error,
  onInputChange
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CityResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Nominatim API URL
  const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Call onInputChange prop if provided to track user attempt
    if (onInputChange) {
      onInputChange();
    }
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer for debounce (500ms)
    if (newValue.trim().length > 1) {
      setIsLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        searchCity(newValue);
      }, 500);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  // Search city using Nominatim API
  const searchCity = async (query: string) => {
    try {
      // Build the URL with parameters
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5'
      });
      
      const response = await fetch(`${NOMINATIM_API}?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Askstar_App/1.0' // Required by Nominatim usage policy
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process and filter results
      const processedResults = data
        .filter((item: NominatimResponse) => item.address && (item.address.city || item.address.town || item.address.village))
        .map((item: NominatimResponse) => {
          const city = item.address.city || item.address.town || item.address.village || '';
          const country = item.address.country || '';
          return {
            city,
            country,
            latitude: parseFloat(item.lat) || 0,
            longitude: parseFloat(item.lon) || 0,
            formattedAddress: `${city}, ${country}`
          };
        })
        .filter((result: CityResult, index: number, self: CityResult[]) => 
          // Filter unique cities
          index === self.findIndex(r => r.city === result.city && r.country === result.country)
        )
        .filter((result: CityResult) => result.city); // Only include results with a city name
      
      setResults(processedResults);
    } catch (error) {
      console.error('Error searching city:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selection of a city
  const handleSelectCity = (result: CityResult) => {
    setInputValue(result.formattedAddress);
    onChange(result.formattedAddress, result.latitude, result.longitude);
    setIsOpen(false);
    setResults([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Open dropdown when results are available
  useEffect(() => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  }, [results]);

  return (
    <div className="mb-4">
      <label className="block text-white/90 text-sm mb-2 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      <div 
        ref={searchRef}
        className="relative"
      >
        <div className={`
          bg-white backdrop-blur-md border rounded-lg px-3 py-2 flex justify-between items-center
          transition-colors relative
          ${error ? 'border-red-500' : isOpen ? 'border-white/30' : 'border-white/10 hover:border-white/20'}
        `}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-black placeholder-gray-500"
          />
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          ) : (
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}

        {/* Results dropdown */}
        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full bg-white backdrop-blur-xl border border-white/20 rounded-lg shadow-xl"
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {results.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectCity(result)}
                    className="px-4 py-2 cursor-pointer hover:bg-white/20 transition-colors text-black"
                  >
                    <div className="font-medium">{result.city}</div>
                    <div className="text-xs text-gray-600">{result.country}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CitySearch;
