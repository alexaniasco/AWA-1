/* eslint-disable react/no-unknown-property */
import { useContext, useEffect, memo } from "react";
import { useThree } from "@react-three/fiber";
import {
  SoftShadows,
  Environment,
  PerformanceMonitor,
} from "@react-three/drei";
import PropTypes from "prop-types";
import { AppContext } from "../../context/AppContext";
import { IconParticles } from "./IconParticles";

// Import directo temporalmente para debuggear
import CoinModel from "../3DModels/CoinModel";
import CombinedGlasses from "../3DModels/CombinedGlasses";

const COIN_LIGHT_LAYER = 1;

export const Scene = memo(function Scene({ deviceConfig }) {
  const { scrollProgress, activeInfo, coinHasLanded, isLeavingOptions } =
    useContext(AppContext);
  const { camera } = useThree();

  // En mobile/tablet el scroll puede quedar “justo” en el borde de sección,
  // así que ampliamos el rango para que los glasses se vean siempre.
  const isMobileLike = deviceConfig.isMobile || deviceConfig.isTablet;
  const optionsStart = isMobileLike ? 0.4 : 0.45;
  const optionsEnd = isMobileLike ? 0.65 : 0.55;
  const isInOptionsScreen =
    scrollProgress >= optionsStart && scrollProgress <= optionsEnd;
  const showGlasses = isInOptionsScreen && !isLeavingOptions && !activeInfo;
  const glassesZOffset = activeInfo ? 15 : -3;

  useEffect(() => {
    camera.layers.enable(COIN_LIGHT_LAYER);
  }, [camera]);

  // Menos partículas en móvil para mantener FPS (sprites + raycast son costosos)
  const particleCount = deviceConfig.isMobile ? 2 : 6;
  const particleCountSecondary = deviceConfig.isMobile ? 4 : 9;

  return (
    <>
      {/* Monitor de rendimiento: AdaptiveDpr ya reduce DPR; aquí solo log en dev si hace falta */}
      <PerformanceMonitor flipflop={false} onDecline={() => {}} />

      {/* Sombras optimizadas: solo en desktop y con menor resolución */}
      {deviceConfig.shadows && (
        <SoftShadows
          size={deviceConfig.isMobile ? 10 : 20}
          samples={deviceConfig.isMobile ? 4 : 8}
          focus={0.5}
        />
      )}

      <ambientLight intensity={0.5} />

      <Environment
        preset="city"
        background={false}
        environmentIntensity={0.8}
      />

      {/* Partículas: menos en móvil para mejor rendimiento */}
      {coinHasLanded && (
        <>
          <IconParticles
            count={particleCount}
            zMin={-60}
            zMax={-40}
            opacityMultiplier={0.4}
            deviceConfig={deviceConfig}
          />
          <IconParticles
            count={particleCountSecondary}
            deviceConfig={deviceConfig}
          />
        </>
      )}

      {/* Luces principales optimizadas para rendimiento */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={deviceConfig.isMobile ? 0.5 : 0.8}
        castShadow={deviceConfig.shadows}
        shadow-mapSize-width={deviceConfig.isMobile ? 256 : 512}
        shadow-mapSize-height={deviceConfig.isMobile ? 256 : 512}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <CoinModel scrollProgress={scrollProgress} deviceConfig={deviceConfig} />

      <CombinedGlasses
        position={[0, 0, -8 + glassesZOffset]}
        rotation={[0, 0, 0]}
        scale={deviceConfig.isMobile ? 0.8 : 1}
        visible={showGlasses}
        opacity={1}
        deviceConfig={deviceConfig}
      />
    </>
  );
});

Scene.propTypes = {
  deviceConfig: PropTypes.shape({
    isMobile: PropTypes.bool,
    isTablet: PropTypes.bool,
    shadows: PropTypes.bool,
  }).isRequired,
};
