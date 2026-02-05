import  { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './controllers/CameraController';
import { Section } from './components/3DScene/Section';
import { Scene } from './components/3DScene/Scene';
import ScrollHandler from './controllers/ScrollHandler';
import SectionsHTML from './components/SectionsHTML';
import * as THREE from "three";

export default function MainApp() {
  
    // Función para cambiar el z-index de todos los canvas
    const updateCanvasZIndex = () => {
      // Seleccionar todos los elementos canvas
      const canvasElements = document.querySelectorAll('canvas');

      // Cambiar el z-index de cada canvas a 10
      canvasElements.forEach(canvas => {
        canvas.style.zIndex = '1'
      });
    };
  // Nuevo useEffect para cambiar el z-index de los canvas
  useEffect(() => {
 
  

    // Ejecutar inmediatamente
    updateCanvasZIndex();

    // También ejecutar después de un pequeño retraso para asegurar que los canvas estén renderizados
    const timeoutId = setTimeout(updateCanvasZIndex, 500);

    // Limpiar timeout en desmontaje
    return () => clearTimeout(timeoutId);
  }, []);
    return (
        <div
            style={{
                height: "2400vh",
                width: "100vw",
                // backgroundColor: "black",
                position: "relative",
            }}
        >
            <Navbar
            //   isTransitioning={isTransitioning} 
            //   setIsTransitioning={setIsTransitioning}
            />
            <Canvas
                // frameloop="always"
              gl={{
                    // autoClear:true,
                    powerPreference: "high-performance",

                }}
              onCreated={({ gl }) => {
                // Exposure aumentado para que la moneda irradie más poder y luz
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.35;
                gl.outputColorSpace = THREE.SRGBColorSpace;
              }}
                // dpr={Math.min(window.devicePixelRatio, 2)} // Limita el DPR para mejor rendimiento
                style={{
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    background: "#f8f9fa", // Blanco suave, cálido y luminoso (no puro para no cansar la vista)
                    zIndex: 20, // Cambiado directamente aquí también
                }}
                // camera={{ position: [0, 0, 3], fov: 50, near: 0.1, far: 1000 }} // Cámara más cerca al inicio

                camera={{ position: [0,0,0], fov: 50, near: 1, far: 1000 }}
            >
                <CameraController />
                <Section>
                    <Scene/>
                </Section>
            </Canvas>
            <ScrollHandler />
            <SectionsHTML />

        </div>
    )
}
