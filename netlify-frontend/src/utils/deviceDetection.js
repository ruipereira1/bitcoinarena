// Utilitário para detecção de dispositivos e otimizações
export const detectDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: screenWidth < 480,
    isMediumScreen: screenWidth >= 480 && screenWidth < 768,
    isLargeScreen: screenWidth >= 768 && screenWidth < 1200,
    isExtraLargeScreen: screenWidth >= 1200,
    screenWidth,
    screenHeight,
    orientation: screenWidth > screenHeight ? 'landscape' : 'portrait',
    pixelRatio: window.devicePixelRatio || 1,
    hasTouch: 'ontouchstart' in window,
    canHover: window.matchMedia('(hover: hover)').matches
  };
};

// Breakpoints responsivos
export const breakpoints = {
  xs: '320px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  xxl: '1600px'
};

// Função para obter configurações otimizadas baseadas no dispositivo
export const getOptimizedSettings = () => {
  const device = detectDevice();
  
  // Configurações otimizadas para diferentes dispositivos
  const settings = {
    // Configurações para mobile
    mobile: {
      animationDuration: 0.3, // Animações mais rápidas
      particleCount: 10, // Menos partículas para performance
      blurAmount: '15px', // Menos blur para performance
      shadowIntensity: 0.3,
      fontSize: {
        title: '2rem',
        subtitle: '1.1rem',
        body: '0.9rem'
      },
      spacing: {
        padding: '1rem',
        margin: '0.5rem',
        gap: '0.8rem'
      }
    },
    
    // Configurações para tablet
    tablet: {
      animationDuration: 0.4,
      particleCount: 20,
      blurAmount: '20px',
      shadowIntensity: 0.5,
      fontSize: {
        title: '2.5rem',
        subtitle: '1.3rem',
        body: '1rem'
      },
      spacing: {
        padding: '1.5rem',
        margin: '1rem',
        gap: '1.2rem'
      }
    },
    
    // Configurações para desktop
    desktop: {
      animationDuration: 0.6,
      particleCount: 50,
      blurAmount: '25px',
      shadowIntensity: 0.8,
      fontSize: {
        title: '3.5rem',
        subtitle: '1.4rem',
        body: '1.1rem'
      },
      spacing: {
        padding: '2rem',
        margin: '1.5rem',
        gap: '2rem'
      }
    }
  };
  
  if (device.isMobile) return { ...settings.mobile, device };
  if (device.isTablet) return { ...settings.tablet, device };
  return { ...settings.desktop, device };
};

// Hook personalizado para usar configurações responsivas
export const useResponsiveSettings = () => {
  const [settings, setSettings] = React.useState(getOptimizedSettings());
  
  React.useEffect(() => {
    const handleResize = () => {
      setSettings(getOptimizedSettings());
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  return settings;
};

// Função para otimizar performance em dispositivos móveis
export const optimizePerformance = () => {
  const device = detectDevice();
  
  if (device.isMobile) {
    // Reduzir qualidade de blur e sombras em mobile
    document.documentElement.style.setProperty('--blur-amount', '10px');
    document.documentElement.style.setProperty('--shadow-intensity', '0.3');
    
    // Desabilitar animações complexas em dispositivos com baixo performance
    if (device.pixelRatio < 2) {
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }
  }
};

// CSS helpers para media queries
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.sm})`,
  tablet: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
  highDPI: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
};

// Função para aplicar estilos condicionais baseados no dispositivo
export const applyDeviceStyles = (styles) => {
  const device = detectDevice();
  
  return {
    ...styles.base,
    ...(device.isMobile && styles.mobile),
    ...(device.isTablet && styles.tablet),
    ...(device.isDesktop && styles.desktop),
    ...(device.isSmallScreen && styles.small),
    ...(device.canHover && styles.hover)
  };
}; 