import { Suspense, useEffect, useMemo, useState, memo } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Canvas, useThree } from "@react-three/fiber";
import { Section } from "./components/3DScene/Section";
import { Scene } from "./components/3DScene/Scene";
import ScrollHandler from "./controllers/ScrollHandler";
import SectionsHTML from "./components/SectionsHTML";
import * as THREE from "three";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import "./components/PreloadModels";

// ─── Responsive: FOV dinámico basado en viewport (Three.js best practice) ────
// En Portrait / pantallas angostas usamos un FOV más amplio para que la escena
// no se "recorte". En Landscape / Desktop uno más estrecho para más nitidez.
const getResponsiveFov = (width, height) => {
  const aspect = width / height;
  // Si el aspect ratio es < 1 (portrait), ampliar el FOV
  if (aspect < 0.75) return 65; // Teléfono en portrait
  if (aspect < 1) return 60; // Tablet en portrait
  if (aspect < 1.4) return 55; // Cuadrado / tablet landscape
  return 50; // Desktop widescreen
};

// ─── Detector de dispositivo (basado en ancho, no solo UA) ───────────────────
const getDeviceConfig = (width) => {
  const uaIsMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  // Híbrido: usamos UA para hardware hints pero ancho para layout
  const isMobile = uaIsMobile || width <= 600;
  const isTablet = !isMobile && width <= 1024;
  // HD-DPI: limitar pixel ratio como recomienda el manual de Three.js
  const pixelRatio = Math.min(window.devicePixelRatio, 2);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    pixelRatio,
    powerPreference: isMobile ? "low-power" : "high-performance",
    antialias: !isMobile,
    shadows: !isMobile,
    // DPR acotado: en móvil [1, 1.25] evita framebuffers enormes (Three.js best practice).
    dpr: isMobile ? [1, 2] : [1, 2],
  };
};

// ─── Componente interno: actualiza camera.aspect + FOV dinámico en resize ────
// Three.js manual: "set camera.aspect to canvas.clientWidth / canvas.clientHeight
// and call camera.updateProjectionMatrix()" en cada resize.
// El buffer size lo maneja R3F internamente vía el prop `dpr`.
function ResponsiveCamera() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const canvas = gl.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (camera.isPerspectiveCamera && width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.fov = getResponsiveFov(width, height);
        camera.updateProjectionMatrix();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gl, camera]);

  return null;
}

export default memo(function MainApp() {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Recalcular deviceConfig cuando cambia el ancho de ventana
  const deviceConfig = useMemo(
    () => getDeviceConfig(windowWidth),
    [windowWidth],
  );

  // Escuchar resize para actualizar windowWidth
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const update = () => {
      document.querySelectorAll("canvas").forEach((c) => {
        c.style.zIndex = "1";
        c.style.touchAction = "none";
      });
    };
    update();
    const t = setTimeout(update, 500);
    return () => clearTimeout(t);
  }, []);

  // Prevenir scroll horizontal en móviles
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    };
  }, []);

  return (
    <div
      style={{
        height: "1200vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isLoading && <LoadingScreen />}

      <Navbar />

      <Canvas
        gl={{
          powerPreference: deviceConfig.powerPreference,
          antialias: deviceConfig.antialias,
          logarithmicDepthBuffer: deviceConfig.isMobile,
          alpha: false,
        }}
        dpr={deviceConfig.dpr}
        performance={{
          min: 0.5,
          max: 1,
          debounce: 200,
        }}
        onCreated={({ gl, scene }) => {
          gl.physicallyCorrectLights = true;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = deviceConfig.isMobile ? 1.2 : 1.35;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(new THREE.Color("#f8f9fa"));
          gl.compile(scene, scene.children[0]);
          setIsLoading(false);
        }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          background: "#f8f9fa",
          zIndex: 20,
          touchAction: "none",
          // Three.js guide: Let CSS handle display size, canvas fills container
          display: "block",
        }}
        camera={{
          position: [0, 0, 0],
          fov: 50,
          near: 1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          {/* Three.js responsive: actualiza aspect + FOV en resize */}
          <ResponsiveCamera />
          <Section deviceConfig={deviceConfig}>
            <Scene deviceConfig={deviceConfig} />
          </Section>
        </Suspense>
      </Canvas>

      <ScrollHandler />
      <SectionsHTML />
    </div>
  );
});
