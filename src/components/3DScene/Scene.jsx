import { useRef, useContext, useState, useEffect } from "react";
import { CoinModel } from "../3DModels/CoinModel";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars, SoftShadows, Html, Environment } from "@react-three/drei";
import { AppContext } from "../../context/AppContext";
import { IconParticles } from './IconParticles';
import Model from "../../context/Models";
import * as THREE from "three";
import OptimizedModel from "../3DModels/OptimizedModel";

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
    [ambientRef, hemiRef, keyRef, fillRef, rimRef, bounceRef, sparkleARef, sparkleBRef, frontRef].forEach((r) => {
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
        position={[4.2, 2.4, 5.2]}
        intensity={2.8}
        color={"#ffd39a"}
        castShadow={false}
      />
      <pointLight
        ref={fillRef}
        position={[-4.0, 1.4, 3.2]}
        intensity={1.8}
        color={"#ffffff"}
        distance={90}
        decay={1.9}
        castShadow={false}
      />
      <pointLight
        ref={rimRef}
        position={[0.0, 3.8, -5.2]}
        intensity={2.0}
        color={"#e8f2ff"}
        distance={90}
        decay={1.9}
        castShadow={false}
      />
      <pointLight
        ref={bounceRef}
        position={[0.0, -2.2, 2.2]}
        intensity={1.3}
        color={"#ffdb8f"}
        distance={70}
        decay={1.9}
        castShadow={false}
      />
      <spotLight
        ref={sparkleARef}
        position={[2.2, 0.6, 3.6]}
        intensity={4.0}
        color={"#ffffff"}
        angle={0.6}
        penumbra={0.7}
        distance={110}
        decay={1.9}
        castShadow={false}
      />
      <spotLight
        ref={sparkleBRef}
        position={[-2.4, 1.2, 3.8]}
        intensity={3.2}
        color={"#fff9e3"}
        angle={0.55}
        penumbra={0.75}
        distance={110}
        decay={1.9}
        castShadow={false}
      />
      <pointLight
        ref={frontRef}
        position={[0.0, 0.2, 6.5]}
        intensity={3.2}
        color={"#ffe8ba"}
        distance={130}
        decay={1.9}
        castShadow={false}
      />
      
      {/* Luces de "halo" para que irradie poder alrededor */}
      <pointLight
        position={[0.0, 0.0, 0.0]}
        intensity={1.8}
        color={"#ffd700"}
        distance={20}
        decay={1.8}
      />
      <pointLight
        position={[3.0, 0.0, 0.0]}
        intensity={1.0}
        color={"#ffe97d"}
        distance={18}
        decay={2}
      />
      <pointLight
        position={[-3.0, 0.0, 0.0]}
        intensity={1.0}
        color={"#ffe97d"}
        distance={18}
        decay={2}
      />
      <pointLight
        position={[0.0, 3.0, 0.0]}
        intensity={1.0}
        color={"#fff4d6"}
        distance={18}
        decay={2}
      />
      <pointLight
        position={[0.0, -3.0, 0.0]}
        intensity={1.0}
        color={"#ffda6a"}
        distance={18}
        decay={2}
      />
    </group>
  );
};

// Añade este componente justo después de la definición de Scene
const RotatingGroup = ({ children }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};


const FloatingModel = ({ position = [0, 0, 0], offset = 0, children ,character}) => {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if(character === 1){
      ref.current.position.y = Math.sin(t * 1.1 + offset) * 0.08 // flotación con desfase

    }
    else {
      ref.current.position.y = Math.sin(t * 1.1 + offset) * 0.1 // flotación con desfase

    }
  })

  return <group ref={ref} position={position}>{children}</group>
}


export const Scene = () => {
  const { scrollProgress, activeInfo, maletinRef, cajafuerteRef, astronautaRef, moveModelTo, astronauta2Ref, coinHasLanded } = useContext(AppContext);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { viewport, camera } = useThree();

  // Habilitar el layer de luces de la moneda en la cámara
  useEffect(() => {
    camera.layers.enable(COIN_LIGHT_LAYER);
  }, [camera]);

  // NUEVO: referencia para el grupo del maletín
  const maletinGroupRef = useRef();

  const handleMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showModels = scrollProgress <= 0.01 || activeInfo;
  const positionModel = scrollProgress <= 0.1 || !activeInfo;

  return (
    <>
      <SoftShadows size={25} samples={16} focus={0.5} />
      <ambientLight intensity={0.5} />
      
      {/* Environment para reflexiones realistas en la moneda */}
      <Environment preset="city" background={false} blur={0.25} />
      
      {/* Sistema de iluminación dedicado para la moneda */}
      <CoinLightRig />
      
      {/* Resplandor ambiental que hace que la moneda irradie luz al espacio */}
      <CoinAmbientGlow />
      
      {/* Partículas de fondo (más lejanas) para dar profundidad */}
      {coinHasLanded && <IconParticles count={6} zMin={-60} zMax={-40} opacityMultiplier={0.4} />}
      
      {/* Partículas de íconos hexagonales (primer plano) - aparecen cuando la moneda ha aterrizado */}
      {coinHasLanded && <IconParticles />}
      
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
      <directionalLight scale={2}
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

      <DynamicStars
        scrollProgress={scrollProgress}
        count={4000}
      />
      <CoinModel scrollProgress={scrollProgress} />

  

  

     



    </>
  );
};

const DynamicStars = ({ scrollProgress, count }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = scrollProgress * 100;
      ref.current.rotation.x = scrollProgress * 5;
    }
  });

  return (
    <Stars
      ref={ref}
      radius={100}
      depth={300}
      count={count}
      factor={1}
      saturation={0}
      fade
      speed={1}
    />
  );
};


