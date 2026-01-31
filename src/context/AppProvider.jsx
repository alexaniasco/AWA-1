import React, { useState, useMemo, useRef, useEffect } from "react";
import { AppContext } from "./AppContext";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

// Proveedor del contexto
export const AppProvider = ({ children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cameraTarget, setCameraTarget] = useState([0, 0, 3]);
  const [cameraLookAtTarget, setCameraLookAtTarget] = useState([0, 0, 0]);
  const [activeInfo, setActiveInfo] = useState("");
  const [contactModal, setContactModal] = useState(false);
  const coinRef = useRef(null);
  const maletinRef = useRef(null);
  const cajafuerteRef = useRef(null);
  const astronautaRef = useRef(null);
  const astronauta2Ref = useRef(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [coinHasLanded, setCoinHasLanded] = useState(false);
  const [isLeavingOptions, setIsLeavingOptions] = useState(false);
  const [sectionHover, setSectionHover] = useState("");
  // Loader liviano: evitamos importar `three/examples/jsm/Addons.js` (muy pesado) para no inflar el bundle.
  // Si en el futuro querés precargar GLBs, conviene usar `useGLTF.preload()` desde drei.
  useEffect(() => {
    setLoadingProgress(1);
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const moveCameraTo = (position, lookAt = [0, 0, 0]) => {
    setCameraTarget(position);
    setCameraLookAtTarget(lookAt);
  };

  const moveModelTo = (modelRef, targetPosition, duration = 1500) => {
    if (!modelRef.current) return;

    const startPosition = modelRef.current.position.clone();
    const startTime = performance.now();

    // Función de easing para suavizar la animación
    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animateMove = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(rawProgress);

      // Interpolación suave con easing
      modelRef.current.position.lerpVectors(
        startPosition,
        targetPosition,
        easedProgress
      );

      if (rawProgress < 1) {
        requestAnimationFrame(animateMove);
      }
    };

    requestAnimationFrame(animateMove);
  };

  // Reactotron removido para producción/optimización de bundle.
  const handleOptionClick = (position, label, modelRef) => {
    setActiveInfo(label);
    setCameraTarget(position);

    // Asegurarnos de que el lookAt apunte al modelo seleccionado
    if (modelRef?.current) {
      const modelPosition = modelRef.current.position;
      setCameraLookAtTarget([
        modelPosition.x,
        modelPosition.y,
        modelPosition.z,
      ]);
    }
  };

  const value = useMemo(
    () => ({
      scrollProgress,
      setScrollProgress,
      cameraTarget,
      cameraLookAtTarget,
      setCameraLookAtTarget,
      moveCameraTo,
      setCameraTarget,
      activeInfo,
      setActiveInfo,
      handleOptionClick,
      contactModal,
      setContactModal,
      moveModelTo,
      isLoading,
      loadingProgress,
      coinHasLanded,
      setCoinHasLanded,
      isLeavingOptions,
      setIsLeavingOptions,
      sectionHover,
      setSectionHover,
    }),
    [
      scrollProgress,
      cameraTarget,
      cameraLookAtTarget,
      activeInfo,
      contactModal,
      isLoading,
      loadingProgress,
      coinHasLanded,
      isLeavingOptions,
      sectionHover,
    ]
  );

  return (
    <>
      {isLoading && (
        <LoadingScreen progress={loadingProgress} isVisible={isLoading} />
      )}
      <AppContext.Provider
        value={{
          ...value,
          coinRef,
          maletinRef,
          cajafuerteRef,
          astronautaRef,
          isLoading,
          astronauta2Ref,
        }}
      >
        {children}
      </AppContext.Provider>
    </>
  );
};
