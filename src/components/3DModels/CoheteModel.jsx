import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  
  // Optimización: Simplificar sombras y geometrías
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Reducir la calidad de sombras para objetos pequeños
        if (child.material) {
          child.material.roughness = 0.8; // Más rugoso = menos cálculos
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} ref={groupRef} />;
}

export default function Model3D() {
  const canvasRef = useRef();

  return (
    <Canvas 
      ref={canvasRef}
      camera={{ position: [0, 0, 3], fov: 25 }}
      style={{ background: 'transparent' }}
      shadows={{ type: 'basic' }} // Usar sombras básicas
      frameloop="demand" // Solo renderizar cuando sea necesario
      dpr={[1, 2]} // Balance entre calidad y rendimiento
      gl={{ antialias: false }} // Desactivar antialiasing para mejor rendimiento
    >
      {/* Configuración de luces optimizada */}
      <ambientLight intensity={0.3} />
      
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={512} // Reducir resolución de sombras
        shadow-mapSize-height={512}
        shadow-camera-far={20} // Reducir distancia de sombras
      />
      
      {/* Modelo optimizado */}
      <Model url="/cohetenuevo2.glb" />
      
      {/* OrbitControls con inercia reducida */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        dampingFactor={0.1} // Menos inercia = menos cálculos
      />
    </Canvas>
  );
}