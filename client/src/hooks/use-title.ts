import { useEffect } from 'react';

/**
 * A custom hook for setting the page title
 * @param title The title to set for the page
 */
export const useTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    
    // Cleanup function to restore the previous title when component unmounts
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};