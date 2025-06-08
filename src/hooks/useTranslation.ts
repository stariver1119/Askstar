import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import type { LanguageContextType } from '../contexts/LanguageContext';

/**
 * Custom hook to access the translation function and current language
 * @returns The translation function and current language
 */
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  return context;
};
