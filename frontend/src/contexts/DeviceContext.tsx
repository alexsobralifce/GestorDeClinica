import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DeviceContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<DeviceContextType>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');

    const handleResize = () => {
      const isMobile = mobileQuery.matches;
      const isTablet = tabletQuery.matches;
      const isDesktop = !isMobile && !isTablet;

      setDevice({ isMobile, isTablet, isDesktop });
    };

    // Initial check
    handleResize();

    // Listeners
    mobileQuery.addEventListener('change', handleResize);
    tabletQuery.addEventListener('change', handleResize);

    return () => {
      mobileQuery.removeEventListener('change', handleResize);
      tabletQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return (
    <DeviceContext.Provider value={device}>
      {children}
    </DeviceContext.Provider>
  );
}

export const useDevice = () => useContext(DeviceContext);
