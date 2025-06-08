import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { detectBrowserLanguage } from '../utils/detectLanguage';
import mainPageTranslations from '../data/mainPageTranslations.json';
import inputPageTranslations from '../data/inputPageTranslations.json';

// Define the language type
export type Language = 'ko' | 'en';

// Define the context type
export interface LanguageContextType {
  currentLanguage: Language;
  t: (key: string) => string;
}

// Create the context with default values
export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  t: (key: string) => key,
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  
  // Properly merge the translations by language
  const [translations] = useState<Record<string, any>>(() => {
    // Create a deep merge of the translations
    const merged: Record<string, any> = {};
    
    // Get all languages
    const languages = ['ko', 'en'];
    
    // For each language, merge the translations
    languages.forEach(lang => {
      merged[lang] = {
        ...(mainPageTranslations as any)[lang],
        ...(inputPageTranslations as any)[lang]
      };
    });
    
    return merged;
  });

  // Detect browser language on initial load
  useEffect(() => {
    const detectedLanguage = detectBrowserLanguage();
    setCurrentLanguage(detectedLanguage);
  }, []);

  // Translation function
  const t = (key: string): string => {
    try {
      // Split the key by dots to navigate through the nested object
      const keys = key.split('.');
      let value = translations[currentLanguage];
      
      // Navigate through the nested object
      for (const k of keys) {
        if (value && value[k] !== undefined) {
          value = value[k];
        } else {
          // If the key doesn't exist, return the key itself
          return key;
        }
      }
      
      return typeof value === 'string' ? value : key;
    } catch (error) {
      // In case of any error, return the key itself
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
