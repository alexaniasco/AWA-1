import React, { useState, useMemo, useRef, useEffect } from "react";
import { AppContext } from "./AppContext";
import reactotron from "../ReactotronConfig";
import { useGLTF } from "@react-three/drei";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

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



  // Estado para gestionar modelos precargados y progreso de carga
  const [preloadedModels, setPreloadedModels] = useState({
    maletin: null,
    cajafuerte: null,
    // Agregar otros modelos aquí
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [coinHasLanded, setCoinHasLanded] = useState(false);
  const [isLeavingOptions, setIsLeavingOptions] = useState(false);


  useEffect(() => {
    const totalModels = 4;
    let loadedModels = 0;
    
    const updateProgress = () => {
      loadedModels++;
      setLoadingProgress(loadedModels / totalModels);
      
      if (loadedModels === totalModels) {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    
    const loadModels = async () => {
      try {
        // Cargar modelos usando promesas
        const loadModel = (url) => {
          return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
              url,
              (gltf) => {
                resolve(gltf);
                updateProgress();
              },
              (xhr) => {
                if (xhr.lengthComputable) {
                  const modelProgress = xhr.loaded / xhr.total;
                  console.log(`Modelo ${url}: ${Math.round(modelProgress * 100)}% cargado`);
                }
              },
              (error) => {
                console.error(`Error cargando ${url}:`, error);
                reject(error);
              }
            );
          });
        };
        
        // Cargar modelos en paralelo
        const [cajafuerteModel,maletinModel,atronautaModel,atronauta2Model] = await Promise.all([
          loadModel('/cajafuerteFinal.glb'),
          loadModel('/maletinFinal.glb'),
          loadModel('/astronauta1Final.glb'),
          loadModel('/astronauta2Final.glb'),

        ]);
        
        console.log("Modelos cargados exitosamente");
        setPreloadedModels({
          astronauta: atronautaModel.scene,
          astronauta2: atronauta2Model.scene,

          maletin: maletinModel.scene,
          cajafuerte: cajafuerteModel.scene,
        });
      } catch (error) {
        console.error("Error al cargar modelos:", error);
        setIsLoading(false);
      }
    };
    
    loadModels();
  }, []);

  const moveCameraTo = (position, lookAt = [0, 0, 0]) => {
    setCameraTarget(position);
    setCameraLookAtTarget(lookAt);
  };

  const swapModelPositions = (model1Ref, model2Ref) => {
      if (!model1Ref.current || !model2Ref.current) return;
      
      // Guardar posiciones originales
      const model1Pos = model1Ref.current.position.clone();
      const model2Pos = model2Ref.current.position.clone();
      
      // Animación de intercambio
      const duration = 1000; // 1 segundo de duración
      const startTime = performance.now();
      
      const animateSwap = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Interpolación lineal para movimiento suave
          model1Ref.current.position.lerpVectors(
              model1Pos,
              model2Pos,
              progress
          );
          
          model2Ref.current.position.lerpVectors(
              model2Pos,
              model1Pos,
              progress
          );
          
          if (progress < 1) {
              requestAnimationFrame(animateSwap);
          }
      };
      
      requestAnimationFrame(animateSwap);
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

  reactotron.onCustomCommand({
    command: "GO TO SCROLL",
    description: "PARA CAMBIAR EL SCROLL",
    handler: async () => {
      reactotron.log(scrollProgress, "holaaa");
      // window.scrollTo(100, 0);
      setScrollProgress(0.9);
    },
  });
  const handleOptionClick = (position, label, modelRef) => {
    setActiveInfo(label);
    setCameraTarget(position);
    
    // Asegurarnos de que el lookAt apunte al modelo seleccionado
    if (modelRef?.current) {
      const modelPosition = modelRef.current.position;
      setCameraLookAtTarget([modelPosition.x, modelPosition.y, modelPosition.z]);
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
      swapModelPositions,
      moveModelTo,
      preloadedModels,
      isLoading,
      loadingProgress,
      coinHasLanded,
      setCoinHasLanded,
      isLeavingOptions,
      setIsLeavingOptions
    }),
    [scrollProgress, cameraTarget, cameraLookAtTarget, activeInfo, contactModal, isLoading, loadingProgress, coinHasLanded, isLeavingOptions]
  );

  return (
    <>
      {isLoading && <LoadingScreen progress={loadingProgress} isVisible={isLoading} />}
      <AppContext.Provider value={{ ...value, coinRef, maletinRef, cajafuerteRef,astronautaRef, isLoading,astronauta2Ref }}>
        {children}
      </AppContext.Provider>
    </>
  );
};
