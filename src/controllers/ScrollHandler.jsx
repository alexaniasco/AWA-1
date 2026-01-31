import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";

export const ScrollHandler = () => {
  const { setScrollProgress, setIsLeavingOptions } = useContext(AppContext);
  
  // Usar refs para mantener el estado entre re-renders sin causar re-renders
  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  
  useEffect(() => {
    const sections = [0, 0.27 , 0.45, 0.95];
    
    // Sincronizar la sección actual basándose en el scroll inicial
    const initialScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const closestSection = sections.reduce((prev, curr) => 
      Math.abs(curr - initialScroll) < Math.abs(prev - initialScroll) ? curr : prev
    );
    currentSectionRef.current = sections.indexOf(closestSection);
    setScrollProgress(initialScroll);

    // Función de suavizado equilibrado (se comporta igual en ambos sentidos)
    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const smoothScrollTo = (targetProgress) => {
      const startProgress =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const distance = targetProgress - startProgress;
      const duration = 1000; // Más lenta y pareja en ambas direcciones
      let startTime = null;

      const animateScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);

        const newScrollY =
          (startProgress + distance * easedProgress) *
          (document.body.scrollHeight - window.innerHeight);

        window.scrollTo(0, newScrollY);
        setScrollProgress(startProgress + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 300); // Pausa de 300ms para evitar saltos bruscos
        }
      };

      requestAnimationFrame(animateScroll);
    };

    const handleScroll = () => {
      if (isAnimatingRef.current) return;
      
      const currentScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(currentScroll);
      
      // Encuentra la sección más cercana al scroll actual
      const closestSection = sections.reduce((prev, curr) => 
        Math.abs(curr - currentScroll) < Math.abs(prev - currentScroll) ? curr : prev
      );
      currentSectionRef.current = sections.indexOf(closestSection);
    };

    const handleWheel = (event) => {
      event.preventDefault();
      if (isAnimatingRef.current) return;

      // Detectar si estamos en la sección OPTIONS (0.45) y scrolleamos hacia arriba
      const isInOptionsSection = currentSectionRef.current === 2; // sections[2] = 0.45
      const isScrollingUp = event.deltaY < 0;

      if (event.deltaY > 0 && currentSectionRef.current < sections.length - 1) {
        currentSectionRef.current++;
        const targetProgress = sections[currentSectionRef.current];
        isAnimatingRef.current = true;
        smoothScrollTo(targetProgress);
      } else if (isScrollingUp && currentSectionRef.current > 0) {
        // Si estamos en OPTIONS y scrolleamos hacia arriba
        if (isInOptionsSection) {
          // Marcar que estamos animando para bloquear otros scrolls
          isAnimatingRef.current = true;
          
          // Activar la salida de las imágenes glass
          setIsLeavingOptions(true);
          
          // Esperar 1 segundo para que las imágenes desaparezcan
          setTimeout(() => {
            currentSectionRef.current--;
            const targetProgress = sections[currentSectionRef.current];
            smoothScrollTo(targetProgress);
            
            // Reset después de que el scroll termine completamente (3s de scroll + 0.3s de pausa)
            setTimeout(() => {
              setIsLeavingOptions(false);
            }, 3500);
          }, 1000);
        } else {
          // Para otras secciones, comportamiento normal
          currentSectionRef.current--;
          const targetProgress = sections[currentSectionRef.current];
          isAnimatingRef.current = true;
          smoothScrollTo(targetProgress);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setScrollProgress, setIsLeavingOptions]);

  return null;
};

export default ScrollHandler;
