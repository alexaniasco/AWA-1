import { motion, AnimatePresence } from "motion/react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import "./SecondSection.css";

const SecondSection = () => {
  const { scrollProgress } = useContext(AppContext);
  const [showContent, setShowContent] = useState(false);

  // Mostrar contenido basado en la posición de scroll
  useEffect(() => {
    const inSection = scrollProgress >= 0.05 && scrollProgress < 0.65;

    if (inSection && !showContent) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    } else if (!inSection && showContent) {
      setShowContent(false);
    }
  }, [scrollProgress, showContent]);

  // Calcular el movimiento hacia arriba basado en el scroll (salida)
  // scrollProgress de 0.3 a 0.5 para la transición de salida
  const exitProgress = Math.min(Math.max((scrollProgress - 0.3) / 0.2, 0), 1);
  const translateY = exitProgress * -150; // Mover hacia arriba (igual que HomeSection)

  // Fade out solo cuando ya está saliendo (después del 60% del movimiento)
  const fadeOutStart = 0.6;
  let scrollOpacity = 1;
  if (exitProgress < fadeOutStart) {
    scrollOpacity = 1;
  } else {
    const fadeProgress = (exitProgress - fadeOutStart) / (1 - fadeOutStart);
    scrollOpacity = 1 - fadeProgress;
  }

  return (
    <motion.div
      className="second-section-wrapper"
      style={{
        transform: `translateY(${translateY}vh)`,
        opacity: scrollOpacity,
      }}
    >
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="second-section-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <h2 className="second-title">Tecnologia Inteligente</h2>
            <p className="second-quote">
              &ldquo; Creamos herramientas capaces de optimizar y reinventar el
              <br />
              trabajo a como lo conocemos. &rdquo;.
            </p>
            <p className="second-author">— Apolo Web Agency</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SecondSection;
