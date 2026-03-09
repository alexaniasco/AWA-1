import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Aspect-ratio + FOV correction ────────────────────────────────────────────
// When the viewport is in portrait orientation (aspect < 1), objects appear
// cropped because the horizontal FOV shrinks. To compensate, we push the camera
// further back proportionally to the aspect ratio.
// Additionally, when FOV changes dynamically, we must adjust Z to maintain
// the same apparent object size.
// Formula: effectiveZ = baseZ / aspect * tan(baseFov/2) / tan(currentFov/2)
const getCorrectedZ = (
  baseZ: number,
  aspect: number,
  currentFov: number,
): number => {
  const baseFov = 50; // FOV base de referencia (desktop)
  const fovCorrection =
    Math.tan((baseFov * Math.PI) / 360) /
    Math.tan((currentFov * Math.PI) / 360);

  if (aspect < 1) {
    // Portrait: push camera back to fit the scene horizontally
    return (baseZ / aspect) * fovCorrection;
  }
  return baseZ * fovCorrection;
};

// Control de la cámara
export const SectionCameraControls = ({
  scrollProgress,
  cameraTarget,
  setCameraTarget,
  activeInfo,
  setActiveInfo,
  cameraLookAtTarget,
  deviceConfig = {},
}: {
  scrollProgress: number;
  cameraTarget: number[];
  setCameraTarget: (target: number[]) => void;
  activeInfo: string;
  setActiveInfo: (info: string) => void;
  cameraLookAtTarget: number[];
  deviceConfig?: {
    isMobile?: boolean;
    isTablet?: boolean;
    isDesktop?: boolean;
  };
}) => {
  const { camera, viewport } = useThree();
  const { isMobile, isTablet } = deviceConfig;

  const lookAtTarget = new THREE.Vector3(
    cameraLookAtTarget[0] || 0,
    cameraLookAtTarget[1] || 0,
    cameraLookAtTarget[2] || 0,
  );

  // Función para interpolar la posición de la cámara
  const interpolateCameraPosition = (
    targetPosition: THREE.Vector3,
    lerpFactor: number,
    lookAt: THREE.Vector3 | null = null,
  ) => {
    camera.position.lerp(targetPosition, lerpFactor);
    // Si no hay activeInfo, siempre mirar al centro (moneda)
    if (lookAt) {
      lookAtTarget.lerp(lookAt, lerpFactor);
    } else {
      // Cuando no hay activeInfo, siempre apuntar al centro
      lookAtTarget.lerp(new THREE.Vector3(0, 0, 0), lerpFactor);
    }
    camera.lookAt(lookAtTarget);
  };

  useFrame(() => {
    // Aspect ratio actual del viewport - usar viewport de R3F (sincronizado con ResponsiveCamera)
    const aspect =
      camera instanceof THREE.PerspectiveCamera
        ? camera.aspect
        : viewport.width / viewport.height;

    // Usar deviceConfig para detectar mobile/tablet (mismo criterio que MainApp: mobile <= 600, tablet <= 1024)
    const isMobileDevice = isMobile || false;
    const isTabletDevice = isTablet || false;

    // Actualizar lookAtTarget desde el contexto
    lookAtTarget.set(
      cameraLookAtTarget[0] || 0,
      cameraLookAtTarget[1] || 0,
      cameraLookAtTarget[2] || 0,
    );

    if (scrollProgress <= 0.1) {
      // Posición inicial – Z corregido por aspect ratio y FOV dinámico
      const currentFov =
        camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
      const z = getCorrectedZ(5, aspect, currentFov);
      camera.position.set(0, 0, z);
      camera.lookAt(0, 0, 0);
      setActiveInfo("");
    } else if (scrollProgress >= 0.4 && scrollProgress < 0.65) {
      // Sección de glasses: usar valores base más conservadores en mobile
      // Sincronizado con Scene.jsx (isMobileLike ? 0.65 : 0.55)
      const baseZ = isMobileDevice ? 16 : isTabletDevice ? 15 : 15;
      const currentFov =
        camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
      const z = getCorrectedZ(baseZ, aspect, currentFov);

      if (activeInfo === "") {
        interpolateCameraPosition(
          new THREE.Vector3(0, 0, z),
          0.03,
          new THREE.Vector3(0, 0, 0),
        );
      } else {
        // Cuando se toca una opción: en mobile, usar valores más cercanos
        // pero mantener la misma posición relativa X/Y que desktop
        const adjustedZ = isMobileDevice ? 22 : cameraTarget[2] || 0;
        const adjustedX = isMobileDevice ? -4 : cameraTarget[0] || 0;

        interpolateCameraPosition(
          new THREE.Vector3(adjustedX, cameraTarget[1] || 0, adjustedZ),
          0.03,
          new THREE.Vector3(
            cameraLookAtTarget[0] || 0,
            cameraLookAtTarget[1] || 0,
            cameraLookAtTarget[2] || 0,
          ),
        );
      }
    } else if (scrollProgress >= 0.65 && scrollProgress < 0.9) {
      const currentFov =
        camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
      const z = getCorrectedZ(20, aspect, currentFov);
      setActiveInfo("");
      interpolateCameraPosition(
        new THREE.Vector3(0, 0, z),
        0.03,
        new THREE.Vector3(0, 0, 0),
      );
    } else if (scrollProgress >= 0.9) {
      const baseZ = isMobileDevice ? 12 : isTabletDevice ? 12 : 15;
      const currentFov =
        camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
      const z = getCorrectedZ(baseZ, aspect, currentFov);
      interpolateCameraPosition(
        new THREE.Vector3(0, -0.03, z),
        0.05,
        new THREE.Vector3(0, 0, 0),
      );
    } else {
      const currentFov =
        camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
      const z = getCorrectedZ(5, aspect, currentFov);
      setActiveInfo("");
      interpolateCameraPosition(
        new THREE.Vector3(0, 0, z),
        0.03,
        new THREE.Vector3(0, 0, 0),
      );
    }
  });

  return null;
};
