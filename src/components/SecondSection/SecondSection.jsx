import { motion } from "motion/react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import "./SecondSection.css";

const SecondSection = () => {
  const { scrollProgress } = useContext(AppContext);
  const [showContent, setShowContent] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Mostrar contenido basado en la posición de scroll (altura de pantalla)
  useEffect(() => {
    // El contenido siempre está "montado" en el rango de la sección 2
    // La visibilidad se controla únicamente por opacity/transform
    const inSection = scrollProgress >= 0.05 && scrollProgress < 0.4;
    
    if (inSection && !showContent) {
      // Delay de 0.5 segundos antes de aparecer
      const timer = setTimeout(() => {
        setShowContent(true);
        setAnimationProgress(0); // Resetear animación
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (!inSection && showContent) {
      // Ocultar cuando salimos del rango
      setShowContent(false);
      setAnimationProgress(0);
    }
  }, [scrollProgress, showContent]);

  // Animar el contenido cuando aparece (independiente del scroll)
  useEffect(() => {
    if (!showContent) return;

    const startTime = Date.now();
    const duration = 1000; // 1.2 segundos para la animación

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [showContent]);

  // Calcular el movimiento basado en el scroll
  // scrollProgress va de 0.05 a 0.3 en esta sección (anclado a altura de scroll)
  let translateY = 0;
  let scrollOpacity = 1;
  
  // Movimiento adicional del contenido para el efecto de deslizamiento con scroll
  let contentTranslateY = 0;
  let contentOpacity = 1;

  if (scrollProgress < 0.05) {
    // Scroll hacia atrás (a sección 1): mover hacia ABAJO
    const backProgress = Math.max(0, (0.05 - scrollProgress) / 0.05);
    translateY = backProgress * 400; // Mover hacia abajo más distancia (positivo)
    
    // Fade out solo cuando ya está saliendo (después del 60% del movimiento)
    const fadeOutStart = 0.6;
    if (backProgress < fadeOutStart) {
      scrollOpacity = 1;
    } else {
      const fadeProgress = (backProgress - fadeOutStart) / (1 - fadeOutStart);
      scrollOpacity = 1 - fadeProgress;
    }
  } else if (scrollProgress >= 0.05 && scrollProgress < 0.3) {
    // Dentro de la sección: efecto de deslizamiento hacia arriba
    
    // Si estamos cerca del límite inferior (scrollProgress cercano a 0.05),
    // hacer que el contenido baje en lugar de usar la animación
    const distanceFromBottom = scrollProgress - 0.05; // 0 a 0.25
    const exitThreshold = 0.05; // 5% del rango para empezar a bajar
    
    if (distanceFromBottom < exitThreshold) {
      // Estamos cerca del límite inferior, bajar el contenido
      const exitProgress = 1 - (distanceFromBottom / exitThreshold); // 0 a 1
      contentTranslateY = exitProgress * 40; // Baja hacia abajo
      contentOpacity = 1 - exitProgress; // Fade out mientras baja
    } else {
      // Usar animationProgress para la animación temporal (no basada en scroll)
      // El contenido empieza 40vh abajo y sube hasta 0
      contentTranslateY = (1 - Math.min(animationProgress * 2, 1)) * 40;
      
      // Fade in gradual mientras sube
      contentOpacity = Math.min(animationProgress * 2, 1);
    }
    
    translateY = 0;
    scrollOpacity = 1;
  } else if (scrollProgress >= 0.3) {
    // Transición hacia sección 3: mover hacia ARRIBA
    const forwardProgress = Math.min((scrollProgress - 0.3) / 0.50, 1);
    translateY = forwardProgress * -300; // Mover hacia arriba más distancia (negativo)
    
    // Fade out solo cuando ya está saliendo (después del 60% del movimiento)
    const fadeOutStart = 0.6;
    if (forwardProgress < fadeOutStart) {
      scrollOpacity = 1;
    } else {
      const fadeProgress = (forwardProgress - fadeOutStart) / (1 - fadeOutStart);
      scrollOpacity = 1 - fadeProgress;
    }
  }

  return (
    <motion.div 
      className="second-section-wrapper"
      style={{
        transform: `translateY(${translateY}vh)`,
        opacity: scrollOpacity
      }}
    >
      {showContent && (
        <div
          className="second-section-container"
          style={{
            transform: `translateY(${contentTranslateY}vh)`,
            opacity: contentOpacity,
            transition: 'none' // Sin transición, movimiento directo con el scroll
          }}
        >
          <h2 className="second-title">Tecnologia Inteligente</h2>
          <p className="second-quote">
            " Creamos herramientas capaces de optimizar y reinventar el<br />
            trabajo a como lo conocemos. ".
          </p>
          <p className="second-author">— Apolo Web Agency</p>
        </div>
      )}
    </motion.div>
  );
};

export default SecondSection;

