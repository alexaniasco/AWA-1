import { Suspense, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Canvas } from "@react-three/fiber";
import { Section } from "./components/3DScene/Section";
import { Scene } from "./components/3DScene/Scene";
import ScrollHandler from "./controllers/ScrollHandler";
import SectionsHTML from "./components/SectionsHTML";
import * as THREE from "three";

// Importar para que las precargas a nivel de módulo se ejecuten inmediatamente
import "./components/PreloadModels";

export default function MainApp() {
  // Z-index de canvas (evitar conflicto con HTML overlay)
  useEffect(() => {
    const update = () => {
      document.querySelectorAll("canvas").forEach((c) => {
        c.style.zIndex = "1";
      });
    };
    update();
    const t = setTimeout(update, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        height: "2400vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <Navbar />

      <Canvas
        gl={{
          powerPreference: "high-performance",
          antialias: true,
        }}
        dpr={[1, 1.5]} // Limitar DPR en pantallas retina para mejor rendimiento
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.35;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          background: "#f8f9fa",
          zIndex: 20,
        }}
        camera={{ position: [0, 0, 0], fov: 50, near: 1, far: 1000 }}
      >
        {/* Suspense captura la carga de todos los modelos/texturas dentro del Canvas */}
        <Suspense fallback={null}>
          <Section>
            <Scene />
          </Section>
        </Suspense>
      </Canvas>

      <ScrollHandler />
      <SectionsHTML />
    </div>
  );
}
