import { useState, useMemo, useRef, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { AppContext } from "./AppContext";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import * as THREE from "three";

// Importar PreloadModels para que las precargas a nivel de módulo se ejecuten
import "../components/PreloadModels";

// ─── Configuración de carga ──────────────────────────────────────────────────
const MIN_LOADING_TIME_MS = 2500; // Tiempo mínimo de loading (para que la animación se vea)
const MAX_LOADING_TIME_MS = 10000; // Timeout máximo de seguridad

// Proveedor del contexto optimizado con memo
export const AppProvider = memo(function AppProvider({ children }) {
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

  // ─── Precarga real: esperar a que THREE.DefaultLoadingManager termine ────
  useEffect(() => {
    const startTime = Date.now();
    let finished = false;

    const finishLoading = () => {
      if (finished) return;
      finished = true;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_TIME_MS - elapsed);
      // Esperar al menos MIN_LOADING_TIME_MS para que la animación se vea
      setTimeout(() => {
        setLoadingProgress(1);
        setIsLoading(false);
      }, remaining);
    };

    const mgr = THREE.DefaultLoadingManager;

    // Guardar handlers originales
    const prevOnLoad = mgr.onLoad;
    const prevOnProgress = mgr.onProgress;
    const prevOnError = mgr.onError;

    // Rastrear progreso real
    mgr.onProgress = (url, loaded, total) => {
      prevOnProgress?.(url, loaded, total);
      if (total > 0) {
        setLoadingProgress(loaded / total);
      }
    };

    // Cuando TODO se carga, terminar
    mgr.onLoad = () => {
      prevOnLoad?.();
      finishLoading();
    };

    // En caso de error en algún recurso, no bloquear la app para siempre
    mgr.onError = (url) => {
      prevOnError?.(url);
      console.warn("[Loading] Error cargando:", url);
    };

    // Timeout de seguridad: si los modelos están cacheados o algo falla,
    // no mantener el loading indefinidamente
    const safetyTimeout = setTimeout(finishLoading, MAX_LOADING_TIME_MS);

    // Si ya no hay nada pendiente (todo cacheado), resolver rápido
    // DefaultLoadingManager.isLoading es false cuando no hay items pendientes
    const quickCheck = setTimeout(() => {
      if (!mgr.isLoading) {
        finishLoading();
      }
    }, 500);

    return () => {
      clearTimeout(safetyTimeout);
      clearTimeout(quickCheck);
      mgr.onLoad = prevOnLoad;
      mgr.onProgress = prevOnProgress;
      mgr.onError = prevOnError;
    };
  }, []);

  const moveCameraTo = useCallback((position, lookAt = [0, 0, 0]) => {
    setCameraTarget(position);
    setCameraLookAtTarget(lookAt);
  }, []);

  const moveModelTo = useCallback(
    (modelRef, targetPosition, duration = 1500) => {
      if (!modelRef.current) return;

      const startPosition = modelRef.current.position.clone();
      const startTime = performance.now();

      const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };

      const animateMove = (currentTime) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(rawProgress);

        modelRef.current.position.lerpVectors(
          startPosition,
          targetPosition,
          easedProgress,
        );

        if (rawProgress < 1) {
          requestAnimationFrame(animateMove);
        }
      };

      requestAnimationFrame(animateMove);
    },
    [],
  );

  const handleOptionClick = useCallback((position, label, modelRef) => {
    setActiveInfo(label);
    setCameraTarget(position);

    // En mobile, activar animación de salida de los glasses
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      setIsLeavingOptions(true);
      // Resetear después de que termine la animación
      setTimeout(() => {
        setIsLeavingOptions(false);
      }, 2500);
    }

    if (modelRef?.current) {
      const modelPosition = modelRef.current.position;
      setCameraLookAtTarget([
        modelPosition.x,
        modelPosition.y,
        modelPosition.z,
      ]);
    }
  }, []);

  const scrollToSection = useCallback(
    (targetProgress) => {
      const easeInOutQuad = (t) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const startProgress = scrollProgress;
      const distance = targetProgress - startProgress;
      const duration = 1000;
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
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [scrollProgress, setScrollProgress],
  );

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
      scrollToSection,
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
      moveCameraTo,
      moveModelTo,
      handleOptionClick,
      scrollToSection,
    ],
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
});

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
