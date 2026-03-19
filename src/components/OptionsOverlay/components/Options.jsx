import { AnimatePresence, motion } from "motion/react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import { options } from "./data/data";

const MOBILE_BREAKPOINT = 1024;

const Options = ({
  onOptionClick,
  setPressedIndex,
  pressedIndex,
  sectionHover,
  setSectionHover,
}) => {
  const { scrollProgress } = useContext(AppContext);

  // Solución simple y robusta con fallback seguro
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {options.map((option, index) => {
        // En mobile usar posiciones específicas, en desktop las originales
        const posLeft = isMobile
          ? option.mobileLeft || option.left
          : option.left;
        const posTop = isMobile
          ? option.mobileTop || option.right
          : option.right;

        return (
          <AnimatePresence mode="popLayout" key={index}>
            {scrollProgress > 0.4 && scrollProgress < 0.49 && (
              <motion.div
                onClick={() =>
                  onOptionClick(
                    isMobile ? option.positionMobile : option.position2,
                    option.label,
                  )
                }
                key={index}
                onMouseDown={() => setPressedIndex(index)}
                onMouseEnter={() => setSectionHover(option.label)}
                onMouseUp={() => setSectionHover(null)}
                onMouseLeave={() => setSectionHover("")}
                initial={{ ...option.initial }}
                exit={{
                  ...option.exit,
                  transition: {
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  },
                }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  },
                }}
                style={{
                  fontFamily: "Bebas Neue",
                  position: "absolute",
                  left: posLeft,
                  top: posTop,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  cursor: "pointer",
                  opacity: pressedIndex === index ? 0.5 : 0.8,
                }}
              >
                <img
                  style={{ width: isMobile ? "40vw" : "400px" }}
                  src={option.img}
                  alt={option.label}
                />
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </>
  );
};

export default Options;
