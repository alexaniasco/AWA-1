import { motion, AnimatePresence } from "motion/react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import "./HomeSection.css";

const HomeSection = () => {
  const { setContactModal, scrollProgress, coinHasLanded } = useContext(AppContext);
  const [showContent, setShowContent] = useState(false);

  const handleContactClick = () => {
    setContactModal(true);
  };

  // Mostrar contenido con delay después de que la moneda haya aterrizado
  useEffect(() => {
    if (coinHasLanded) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1200); // Delay de 1.2s después del aterrizaje de la moneda
      
      return () => clearTimeout(timer);
    }
  }, [coinHasLanded]);

  // Calcular el movimiento hacia arriba basado en el scroll
  // scrollProgress va de 0 a 0.15 en esta sección
  const normalizedProgress = Math.min(Math.max((scrollProgress - 0) / 0.15, 0), 1);
  const translateY = normalizedProgress * -150; // Mover hacia arriba más distancia
  
  // Fade out solo cuando ya está saliendo (después del 60% del movimiento)
  const fadeOutStart = 0.6;
  let scrollOpacity = 1;
  if (normalizedProgress < fadeOutStart) {
    scrollOpacity = 1;
  } else {
    const fadeProgress = (normalizedProgress - fadeOutStart) / (1 - fadeOutStart);
    scrollOpacity = 1 - fadeProgress;
  }

  return (
    <motion.div 
      className="home-section-wrapper"
      style={{
        transform: `translateY(${translateY}vh)`,
        opacity: scrollOpacity
      }}
    >
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="home-section-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ 
              duration: 1.2,
              ease: [0.25, 0.1, 0.25, 1] // Ease suave y gradual
            }}
          >
            <h1 className="home-title">
              Bienvenido a Apolo<br />Web Agency
            </h1>
            <p className="home-subtitle">
              Potenciamos empresas, profesionales y proyectos<br />
              digitales a través de nuestros servicios.
            </p>
            <button className="home-contact-button" onClick={handleContactClick}>
              Contacto
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomeSection;

