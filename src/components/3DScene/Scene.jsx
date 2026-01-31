/* eslint-disable react/no-unknown-property */
import { useRef, useContext, useEffect } from "react";
import { CoinModel } from "../3DModels/CoinModel";
import { CombinedGlasses } from "../3DModels/CombinedGlasses";
import { useFrame, useThree } from "@react-three/fiber";
import { SoftShadows, Environment, Lightformer } from "@react-three/drei";
import { AppContext } from "../../context/AppContext";
import { IconParticles } from "./IconParticles";

// Layer dedicado para las luces de la moneda
const COIN_LIGHT_LAYER = 1;

// Resplandor ambiental que sigue a la moneda e ilumina el espacio alrededor
const CoinAmbientGlow = () => {
  const { coinRef } = useContext(AppContext);
  const glowRef = useRef();

  useFrame(() => {
    if (glowRef.current && coinRef?.current) {
      glowRef.current.position.copy(coinRef.current.position);
    }
  });

  return (
    <group ref={glowRef}>
      {/* Luces ambientales globales que iluminan el espacio */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        color={"#ffd700"}
        distance={25}
        decay={1.5}
      />
      <pointLight
        position={[0, 0, 5]}
        intensity={1.0}
        color={"#ffe8a8"}
        distance={20}
        decay={1.8}
      />
      <pointLight
        position={[0, 0, -5]}
        intensity={0.8}
        color={"#fff5d6"}
        distance={18}
        decay={1.8}
      />
    </group>
  );
};

// Sistema de iluminación dedicado para la moneda
const CoinLightRig = () => {
  const { coinRef } = useContext(AppContext);
  const rigRef = useRef();
  const ambientRef = useRef();
  const hemiRef = useRef();
  const keyRef = useRef();
  const fillRef = useRef();
  const rimRef = useRef();
  const bounceRef = useRef();
  const sparkleARef = useRef();
  const sparkleBRef = useRef();
  const frontRef = useRef();

  useEffect(() => {
    [
      ambientRef,
      hemiRef,
      keyRef,
      fillRef,
      rimRef,
      bounceRef,
      sparkleARef,
      sparkleBRef,
      frontRef,
    ].forEach((r) => {
      if (r.current) r.current.layers.set(COIN_LIGHT_LAYER);
    });
  }, []);

  useFrame(() => {
    if (rigRef.current && coinRef?.current) {
      rigRef.current.position.copy(coinRef.current.position);
    }
  });

  return (
    <group ref={rigRef}>
      <ambientLight ref={ambientRef} intensity={0.28} color={"#fff8e6"} />
      <hemisphereLight
        ref={hemiRef}
        intensity={0.52}
        color={"#fffaed"}
        groundColor={"#d4a557"}
      />
      <directionalLight
        ref={keyRef}
        position={[15, 10, 20]}
        intensity={1.8}
        color={"#ffd39a"}
        castShadow={false}
      />
      <pointLight
        ref={fillRef}
        position={[-15, 8, 12]}
        intensity={1.0}
        color={"#ffffff"}
        distance={120}
        decay={2.2}
        castShadow={false}
      />
      <pointLight
        ref={rimRef}
        position={[0.0, 12, -15]}
        intensity={1.2}
        color={"#e8f2ff"}
        distance={120}
        decay={2.2}
        castShadow={false}
      />
      <pointLight
        ref={bounceRef}
        position={[0.0, -10, 8]}
        intensity={0.8}
        color={"#ffdb8f"}
        distance={100}
        decay={2.2}
        castShadow={false}
      />
      <spotLight
        ref={sparkleARef}
        position={[12, 5, 18]}
        intensity={2.0}
        color={"#ffffff"}
        angle={0.3}
        penumbra={1}
        distance={150}
        decay={2.2}
        castShadow={false}
      />
      <spotLight
        ref={sparkleBRef}
        position={[-12, 6, 18]}
        intensity={1.6}
        color={"#fff9e3"}
        angle={0.3}
        penumbra={1}
        distance={150}
        decay={2.2}
        castShadow={false}
      />
      <pointLight
        ref={frontRef}
        position={[0.0, 1, 25]}
        intensity={1.8}
        color={"#ffe8ba"}
        distance={180}
        decay={2.2}
        castShadow={false}
      />
      {/* Luces de "halo" para que irradie poder alrededor - más suaves */}
      <pointLight
        position={[0.0, 0.0, 0.0]}
        intensity={1.0}
        color={"#ffd700"}
        distance={20}
        decay={2.2}
      />
      <pointLight
        position={[10.0, 0.0, 0.0]}
        intensity={0.5}
        color={"#ffe97d"}
        distance={25}
        decay={2.5}
      />
      <pointLight
        position={[-10.0, 0.0, 0.0]}
        intensity={0.5}
        color={"#ffe97d"}
        distance={25}
        decay={2.5}
      />
      <pointLight
        position={[0.0, 10.0, 0.0]}
        intensity={0.5}
        color={"#fff4d6"}
        distance={25}
        decay={2.5}
      />
      <pointLight
        position={[0.0, -10.0, 0.0]}
        intensity={0.5}
        color={"#ffda6a"}
        distance={25}
        decay={2.5}
      />
    </group>
  );
};

export const Scene = () => {
  const { scrollProgress, activeInfo, coinHasLanded, isLeavingOptions } =
    useContext(AppContext);
  const { camera } = useThree();

  const combinedGlasses = {
    position: [0, 0, -8],
    rotation: [0, 0, 0],
    scale: 1,
  };

  // Calcular visibilidad de los glases basado en scrollProgress
  // Importante: antes se usaba un end (0.52) distinto al fin de la sección (0.55),
  // eso causaba cortes bruscos entre secciones. Ahora lo dejamos consistente.
  const isInOptionsScreen = scrollProgress >= 0.35 && scrollProgress < 0.55;
  // Mantener glasses visibles incluso cuando hay activeInfo (para que la moneda pase por detrás)
  const showGlasses = isInOptionsScreen && !isLeavingOptions;
  // Cuando hay activeInfo, mover los glasses hacia adelante para que la moneda pase por detrás
  const glassesZOffset = activeInfo ? 15 : -3;

  // Habilitar el layer de luces de la moneda en la cámara
  useEffect(() => {
    camera.layers.enable(COIN_LIGHT_LAYER);
  }, [camera]);

  // Nota: antes se escuchaba `mousemove` y se guardaba en estado, pero no se usaba.
  // Eso causaba renders en cada movimiento del mouse.

  return (
    <>
      <SoftShadows size={25} samples={16} focus={0.5} />
      <ambientLight intensity={0.5} />
      {/* Iluminación ambiental local para mantener materiales (sin HDR remoto) */}
      <Environment resolution={256} background={false}>
        <Lightformer
          intensity={2.0}
          position={[5, 5, 5]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[10, 10, 1]}
        />
        <Lightformer
          intensity={1.2}
          position={[-5, -2, 5]}
          rotation={[0, -Math.PI / 4, 0]}
          scale={[8, 8, 1]}
        />
      </Environment>
      <CoinLightRig />
      <CoinAmbientGlow />
      {coinHasLanded && (
        <IconParticles
          count={6}
          zMin={-60}
          zMax={-40}
          opacityMultiplier={0.4}
        />
      )}
      {coinHasLanded && <IconParticles count={9} />}

      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 2, -5]} intensity={0.5} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />
      <directionalLight
        scale={2}
        position={[-2, 0, 5]}
        intensity={scrollProgress > 0.4 && scrollProgress < 0.8 ? 0.5 : 0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <CoinModel scrollProgress={scrollProgress} />

      {/* Modelo combinado de gafas integrado en el canvas principal */}
      <CombinedGlasses
        position={[
          combinedGlasses.position[0],
          combinedGlasses.position[1],
          combinedGlasses.position[2] + glassesZOffset,
        ]}
        rotation={combinedGlasses.rotation}
        scale={combinedGlasses.scale}
        visible={showGlasses}
        opacity={1}
      />
    </>
  );
};
