import React, { useEffect, useState, useContext, forwardRef } from "react";
import { Vector3 } from "three";
import { AppContext } from "./AppContext";
import * as THREE from "three";

// Definimos las props usando TypeScript
interface ModelProps {
  modelType: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

// Usamos forwardRef para permitir refs en componentes funcionales
const Model = forwardRef<THREE.Object3D, ModelProps>(
  ({ modelType, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }, ref = null) => {
    const { preloadedModels } = useContext(AppContext);
    const [currentScene, setCurrentScene] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
      if (preloadedModels[modelType]) {
        const clonedScene = preloadedModels[modelType].clone();
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = false;
            child.material.needsUpdate = true;
          }
        });
        setCurrentScene(clonedScene);
      }
    }, [modelType, preloadedModels]);

    return currentScene ? (
      <primitive
        ref={ref as React.MutableRefObject<THREE.Object3D>}
        object={currentScene}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    ) : null;
  }
);

export default Model;
