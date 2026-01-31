import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

// Precarga de modelos de glasses (nombres correctos)
useGLTF.preload("/glas1final.glb");
useGLTF.preload("/glases222final.glb");
useGLTF.preload("/glases333final.glb");

function GlassModel({
  url,
  isHovered,
  debugPosition,
  debugRotation,
  debugScale,
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const scaleRef = useRef(1);

  const baseScale = 1;
  const hoverScale = 1; // sin salto

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone(true);
  }, [scene]);

  // SOLO materiales (una vez)
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
          mat.needsUpdate = true;
        });
      }
    });
  }, [clonedScene]);

  // Hover scale animado + respeta Leva
  useFrame(() => {
    if (!groupRef.current) return;

    const targetHover = isHovered ? hoverScale : 1;
    scaleRef.current += (targetHover - scaleRef.current) * 0.1;

    const finalScale = (debugScale ?? baseScale) * scaleRef.current;
    groupRef.current.scale.setScalar(finalScale);
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} position={debugPosition} rotation={debugRotation}>
      <primitive object={clonedScene} />
    </group>
  );
}

GlassModel.propTypes = {
  url: PropTypes.string.isRequired,
  isHovered: PropTypes.bool,
  debugPosition: PropTypes.arrayOf(PropTypes.number),
  debugRotation: PropTypes.arrayOf(PropTypes.number),
  debugScale: PropTypes.number,
};

export default function GlassModel3D({
  url,
  className = "",
  style = {},
  isHovered = false,
  debugPosition,
  debugRotation,
  debugScale,
}) {
  return (
    <div
      className={className}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        overflow: "hidden",
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={0.8} />
        <pointLight position={[0, 0, 5]} intensity={1} />

        <GlassModel
          url={url}
          isHovered={isHovered}
          debugPosition={debugPosition}
          debugRotation={debugRotation}
          debugScale={debugScale}
        />
      </Canvas>
    </div>
  );
}

GlassModel3D.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  isHovered: PropTypes.bool,
  debugPosition: PropTypes.arrayOf(PropTypes.number),
  debugRotation: PropTypes.arrayOf(PropTypes.number),
  debugScale: PropTypes.number,
};
