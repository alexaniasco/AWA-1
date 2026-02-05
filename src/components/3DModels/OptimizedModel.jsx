import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { LOD } from 'three';
import { useGLTF } from '@react-three/drei';

/**
 * Componente OptimizedModel que implementa Level of Detail (LOD) para mejorar el rendimiento
 * Carga diferentes niveles de detalle del modelo según la distancia a la cámara
 * 
 * @param {string} url - URL del modelo principal (alta calidad)
 * @param {string} urlLow - URL del modelo de baja calidad (opcional)
 * @param {Array} position - Posición del modelo [x, y, z]
 * @param {Array} rotation - Rotación del modelo [x, y, z]
 * @param {number} scale - Escala del modelo
 * @param {Object} ref - Referencia al modelo (opcional)
 */
const OptimizedModel = ({
  url,
  urlLow,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelRef
}) => {
  const lodRef = useRef();
  const [highDetailModel, setHighDetailModel] = useState(null);
  const [lowDetailModel, setLowDetailModel] = useState(null);
  const internalRef = useRef();
  const actualRef = modelRef || internalRef;
  
  // Cargar el modelo de alta calidad usando useGLTF
  const highQualityGLTF = useGLTF(url);
  
  // Cargar el modelo de baja calidad si está disponible
  const lowQualityGLTF = urlLow ? useGLTF(urlLow) : null;
  
  // Configurar modelos cuando se cargan
  useEffect(() => {
    if (highQualityGLTF) {
      const model = highQualityGLTF.scene.clone();
      
      // Habilitar sombras
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      setHighDetailModel(model);
    }
    
    if (lowQualityGLTF) {
      const model = lowQualityGLTF.scene.clone();
      
      // Habilitar sombras
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      setLowDetailModel(model);
    }
    
    // Limpiar recursos
    return () => {
      if (highDetailModel) highDetailModel.dispose();
      if (lowDetailModel) lowDetailModel.dispose();
    };
  }, [highQualityGLTF, lowQualityGLTF]);
  
  // Configurar LOD cuando los modelos estén cargados
  useEffect(() => {
    if (lodRef.current && highDetailModel) {
      // Limpiar LOD existente
      while (lodRef.current.children.length > 0) {
        lodRef.current.remove(lodRef.current.children[0]);
      }
      
      // Añadir modelo de alta calidad (visible desde cerca)
      lodRef.current.addLevel(highDetailModel, 0);
      
      // Añadir modelo de baja calidad si está disponible (visible desde lejos)
      if (lowDetailModel) {
        lodRef.current.addLevel(lowDetailModel, 50);
      }
    }
  }, [highDetailModel, lowDetailModel]);
  
  // Actualizar LOD en cada frame
  useFrame(({ camera }) => {
    if (lodRef.current) {
      lodRef.current.update(camera);
    }
  });
  
  return (
    <primitive 
      ref={(el) => {
        lodRef.current = el;
        if (actualRef) actualRef.current = el;
      }}
      object={new LOD()} 
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

// Precargar los modelos

export default OptimizedModel;