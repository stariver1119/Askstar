import { useEffect } from 'react';
import { useTranslation } from './useTranslation';

/**
 * Custom hook to set the document title based on the current language
 * @param titleKey - The translation key for the title
 */
export const useDocumentTitle = (titleKey: string): void => {
  const { t } = useTranslation();
  
  useEffect(() => {
    const translatedTitle = t(titleKey);
    document.title = translatedTitle;
    
    // Clean up function to reset title when component unmounts (optional)
    return () => {
      // You could reset to a default title here if needed
    };
  }, [t, titleKey]);
};
