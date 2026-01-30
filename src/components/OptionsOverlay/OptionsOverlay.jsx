import { motion } from "motion/react";
import { useState, useEffect, useContext } from "react";
import Options from "./components/Options";
import SectionsGroup from "./components/OptionsSections.jsx/SectionsGroup";
import GlassGroup from "./components/GlassGroup";

import { AppContext } from "../../context/AppContext";

export const OptionsOverlay = ({ onOptionClick }) => {
  const { setCameraTarget, setActiveInfo, activeInfo, isLeavingOptions } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isGlassVisible, setIsGlassVisible] = useState(false);
  const [pressedIndex, setPressedIndex] = useState(null);
  const [sectionHover, setSectionHover] = useState("");


  useEffect(() => {
    // Delay para las imágenes de vidrio (GlassGroup)
    const glassTimer = setTimeout(() => {
      setIsGlassVisible(true);
    }, 1500); // 3.5 segundos para que las partículas escapen primero

    // Delay para los botones/opciones
    const optionsTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000); // 4 segundos

    return () => {
      clearTimeout(glassTimer);
      clearTimeout(optionsTimer);
    };
  }, []);


  useEffect(() => {
    if (activeInfo) {
      const timer = setTimeout(() => {
        setIsVisible2(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible2(false); // Resetear isVisible2 cuando activeInfo está vacío
    }
  }, [activeInfo]);

  const handleBackClick = () => {
    setActiveInfo("");
    setCameraTarget([0, 0, 15]);

    setIsVisible(false); // Ocultar opciones antes de volver a mostrarlas
    setIsGlassVisible(false); // Ocultar también las imágenes de vidrio
    setTimeout(() => {
      setIsGlassVisible(true); // Mostrar imágenes después de 3.5 segundos
      setIsVisible(true); // Volver a mostrar opciones después de 4 segundos
    }, 500);
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 20,
      }}
    >
    
      {isVisible && !activeInfo && !isLeavingOptions && (
        <Options
          sectionHover={sectionHover}
          setSectionHover={setSectionHover}
          onOptionClick={onOptionClick}
          setPressedIndex={setPressedIndex}
          pressedIndex={pressedIndex}
        />
      )}
      <SectionsGroup
        activeInfo={activeInfo}
        isVisible2={isVisible2}
        handleBackClick={handleBackClick}
      />
    </motion.div>
  );
};
