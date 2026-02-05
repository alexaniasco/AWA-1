import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

export const ScrollHandler = () => {
  const { setScrollProgress, setIsLeavingOptions } = useContext(AppContext);
  
  useEffect(() => {
    const sections = [0, 0.27 , 0.45, 0.95];
    let currentSection = 0;
    let isAnimating = false;

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
            isAnimating = false;
          }, 300); // Pausa de 500ms para evitar saltos bruscos
        }
      };

      requestAnimationFrame(animateScroll);
    };

    const handleScroll = () => {
      if (isAnimating) return;
      
      const currentScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(currentScroll);
      
      // Encuentra la sección más cercana al scroll actual
      const closestSection = sections.reduce((prev, curr) => 
        Math.abs(curr - currentScroll) < Math.abs(prev - currentScroll) ? curr : prev
      );
      currentSection = sections.indexOf(closestSection);
    };

    const handleWheel = (event) => {
      event.preventDefault();
      if (isAnimating) return;

      // Detectar si estamos en la sección OPTIONS (0.45) y scrolleamos hacia arriba
      const isInOptionsSection = currentSection === 2; // sections[2] = 0.45
      const isScrollingUp = event.deltaY < 0;

      if (event.deltaY > 0 && currentSection < sections.length - 1) {
        currentSection++;
        const targetProgress = sections[currentSection];
        isAnimating = true;
        smoothScrollTo(targetProgress);
      } else if (isScrollingUp && currentSection > 0) {
        // Si estamos en OPTIONS y scrolleamos hacia arriba
        if (isInOptionsSection) {
          // Marcar que estamos animando para bloquear otros scrolls
          isAnimating = true;
          
          // Activar la salida de las imágenes glass
          setIsLeavingOptions(true);
          
          // Esperar 1 segundo para que las imágenes desaparezcan
          setTimeout(() => {
            currentSection--;
            const targetProgress = sections[currentSection];
            smoothScrollTo(targetProgress);
            
            // Reset después de que el scroll termine completamente (3s de scroll + 0.3s de pausa)
            setTimeout(() => {
              setIsLeavingOptions(false);
            }, 3500);
          }, 1000);
        } else {
          // Para otras secciones, comportamiento normal
          currentSection--;
      const targetProgress = sections[currentSection];
      isAnimating = true;
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
