import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

// ⚡ Preloads centralizados en PreloadModels.jsx — NO duplicar aquí.

/**
 * Componente de modelo de gafas que se renderiza dentro del canvas principal.
 * Incluye animaciones suaves de entrada/salida y respeta los controles de Leva.
 */
export const GlassModel = ({
  url,
  isHovered = false,
  debugPosition = [0, 0, 0],
  debugRotation = [0, 0, 0],
  debugScale = 1,
  visible = true,
  opacity = 1,
}) => {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const scaleRef = useRef(1);
  const opacityRef = useRef(1);

  const baseScale = 1;
  const hoverScale = 1; // Sin salto en hover

  // Clonar la escena para evitar problemas de referencia
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone(true);
  }, [scene]);

  // Configurar materiales
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];

        mats.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = 1;
          mat.side = THREE.DoubleSide;
          // Evita artefactos en transparencias entre piezas
          mat.depthWrite = false;
          mat.needsUpdate = true;
        });
      }
    });
  }, [clonedScene]);

  // Animaciones: hover scale y opacity
  useFrame(() => {
    if (!groupRef.current) return;

    // Hover scale
    const targetHover = isHovered ? hoverScale : 1;
    scaleRef.current += (targetHover - scaleRef.current) * 0.1;
    const finalScale = (debugScale ?? baseScale) * scaleRef.current;
    groupRef.current.scale.setScalar(finalScale);

    // Opacity animation
    opacityRef.current += (opacity - opacityRef.current) * 0.1;

    // Aplicar opacity a los materiales
    if (clonedScene) {
      clonedScene.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((mat) => {
            mat.opacity = opacityRef.current;
          });
        }
      });
    }
  });

  if (!clonedScene || !visible) return null;

  return (
    <group ref={groupRef} position={debugPosition} rotation={debugRotation}>
      <primitive object={clonedScene} />
    </group>
  );
};

GlassModel.propTypes = {
  url: PropTypes.string.isRequired,
  isHovered: PropTypes.bool,
  debugPosition: PropTypes.arrayOf(PropTypes.number),
  debugRotation: PropTypes.arrayOf(PropTypes.number),
  debugScale: PropTypes.number,
  visible: PropTypes.bool,
  opacity: PropTypes.number,
};
