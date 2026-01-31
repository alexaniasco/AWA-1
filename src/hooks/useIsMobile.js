import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el dispositivo es móvil o tiene capacidades limitadas
 * Considera:
 * - User agent del navegador
 * - Tamaño de pantalla
 * - Número de cores del CPU
 * - Memoria disponible (si está disponible)
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      
      // Detectar dispositivos móviles por user agent
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Detectar pantallas pequeñas
      const isSmallScreen = window.innerWidth < 768;
      
      // Detectar dispositivos con bajo rendimiento
      const cores = navigator.hardwareConcurrency || 4;
      const memory = navigator.deviceMemory || 4; // GB
      const isLowPerformance = cores < 4 || memory < 4;
      
      // Detectar conexión lenta (opcional, puede causar falsos positivos)
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      
      // Es móvil si cumple cualquiera de estas condiciones
      setIsMobile(isMobileDevice || isSmallScreen || isLowPerformance);
    };
    
    // Verificar inmediatamente
    checkMobile();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkMobile);
    
    // Escuchar cambios de orientación
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);
  
  return isMobile;
};












