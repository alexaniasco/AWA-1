import React, { useEffect, useMemo, useState } from "react";
import "./BladesAndReveal.css"; // Archivo CSS para los estilos
import { AnimatePresence, motion } from "motion/react";
import { FirstReveal } from "./components/FirstReveal";
import { SecondReveal } from "./components/SecondReveal";
import { ThirdReveal } from "./components/ThirdReveal";

export const BladesAndReveal = ({ scrollProgress, sectionRange }) => {
  const [rangeStart, rangeEnd] = sectionRange;
  const relativeProgress =
    (scrollProgress - rangeStart) / (rangeEnd - rangeStart);
  // Calcular el ángulo de rotación basado en el scrollProgress
  const rotationAngle = useMemo(() => scrollProgress * 3160, [scrollProgress]);
  // Calcular el ancho de los divs basado en el scrollProgress
  const calculateWidth = (progress) => {
    if (progress >= 0.6) {
      return `${Math.max(0, 25 - (progress - 0.6) * 60)}%`;
    }
    return "25%";
  };

  // Determinar si estamos en la transición entre secciones
  const isTransitioning = useMemo(() => {
    return scrollProgress > 0.583 && scrollProgress < 0.695;
  }, [scrollProgress]);

  // Calcular el progreso de la transición (0 al inicio, 1 al final).
  const transitionProgress = useMemo(() => {
    if (!isTransitioning) return 0;
    return (scrollProgress - 0.583) / (0.695 - 0.583);
  }, [scrollProgress, isTransitioning]);

  // Calcular el gap entre las líneas fragmentadas
  const gapSize = useMemo(() => {
    // Líneas separadas solo cuando estamos exactamente en las secciones específicas
    // Sección 1: scrollProgress = 0.583 (con un pequeño margen)
    // Sección 2: scrollProgress = 0.695 (con un pequeño margen)
    const inSection1 = Math.abs(scrollProgress - 0.579) < 0.01;
    const inSection2 = Math.abs(scrollProgress - 0.695) < 0.01;
    const inSection3 = Math.abs(scrollProgress - 0.820) < 0.01;


    if (inSection1 || inSection2 || inSection3) {
      return "35%"; // Separadas cuando estamos en las secciones exactas
    }

    // En cualquier otro caso (carga inicial, transición, saliendo de secciones)
    return "100%"; // Líneas unidas
  }, [scrollProgress]);

  const divWidth = calculateWidth(relativeProgress);

  return (
    <div className="blades-and-reveal-container">
      <FirstReveal isVisible={relativeProgress < 0.3} scrollProgress={relativeProgress} />
      {relativeProgress > 0.3 && relativeProgress < 0.64 && (
        <SecondReveal isVisible={true} scrollProgress={relativeProgress} />

      )}
       {relativeProgress > 0.66 && (
        <ThirdReveal isVisible={true} scrollProgress={relativeProgress} />

      )}
      <AnimatePresence mode="wait">
        <motion.div
          animate={{
            opacity: 1,
            transition: { duration: 1 },
          }}
          className="mask"
          style={{
            width: "100%",
            height: "1%",
            borderWidth: "1px",
            borderColor: "white",
            top: "50%",
            right: "50%",
            zIndex: 22,
            backgroundColor: "transparent",
            transform: `rotate(${rotationAngle}deg)`,
            placeItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "140%",
              display: "flex",
              justifyContent: "center",
              alignSelf: "center",
              flexDirection: "column",
              position: "absolute",
              zIndex: 22,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "14vw",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <motion.div
                style={{
                  display: "flex",
                  width: divWidth,
                  justifyContent: "flex-end",
                  gap: gapSize, // Usar el gap calculado dinámicamente
                  zIndex: 22,
                }}
                animate={{
                  // gap: gapSize,
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
              >
                {/* <div
                  style={{
                    height: 3,
                    width: `80%`,
                    zIndex: 20,
                    backgroundColor: "white",
                  }}
                ></div> */}
              <motion.div
               animate={{
                // gap: gapSize,
                width: gapSize,

                transition: { duration: 0.9, ease: "easeInOut" }
              }}
                  style={{
                    height: 3,
                    width: gapSize,
                    zIndex: 20,
                    backgroundColor: "whitesmoke",
                  }}
                ></motion.div>
              </motion.div>
              <div
                style={{
                  height: 3,
                  width: divWidth,
                  zIndex: 22,
                  backgroundColor: "white",
                }}
              ></div>
            </div>

            <div style={{
              display: relativeProgress < 1 ? "flex" : "none",
              position: "relative",

              zIndex: 22,
            }}>
              <svg
                width="100%"
                height="40"
                viewBox="0 0 400 40"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  zIndex: 100,
                }}
              >
                <path
                style={{zIndex: 100}}
                  d="M0 20 H180 A20 20 0 0 0 220 20 H400 V40 H0 Z"
                  fill="black"
                />
              </svg>
              <div
                style={{
                  width: "100%",
                  height: 1500,
                  backgroundColor: "black",
                  zIndex: 100,
                  position: "absolute",
                  marginTop: -1,
                  top: "100%",
                  left: 0,
                }}
              ></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
