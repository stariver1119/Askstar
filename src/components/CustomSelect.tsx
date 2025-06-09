import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="mb-4">
      <label className="block text-white/90 text-sm mb-2 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      <div 
        ref={selectRef}
        className="relative"
      >
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            bg-white backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 cursor-pointer
            flex justify-between items-center hover:border-white/20 transition-colors
            ${isOpen ? 'border-white/30' : ''}
          `}
        >
          <span className={`${!selectedOption ? 'text-gray-500' : 'text-black'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full bg-white backdrop-blur-xl border border-white/20 rounded-lg shadow-xl overflow-visible"
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      px-4 py-2 cursor-pointer hover:bg-white/20 transition-colors
                      ${option.value === value ? 'bg-white/30 text-black font-medium' : 'text-black'}
                    `}
                  >
                    {option.label}
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

export default CustomSelect;
