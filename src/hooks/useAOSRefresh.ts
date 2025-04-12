
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';

/**
 * Custom hook to refresh AOS animations on route changes
 */
export const useAOSRefresh = () => {
  const location = useLocation();

  useEffect(() => {
    // Wait for DOM to update after route change
    const timer = setTimeout(() => {
      // Refresh AOS animations
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};
