import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Control de la cámara
export const SectionCameraControls = ({
  scrollProgress,
  cameraTarget,
  setCameraTarget,
  activeInfo,
  setActiveInfo,
  cameraLookAtTarget,
}: {
  scrollProgress: number;
  cameraTarget: number[];
  setCameraTarget: (target: number[]) => void;
  activeInfo: string;
  setActiveInfo: (info: string) => void;
  cameraLookAtTarget: number[];
}) => {
  const { camera } = useThree();
  const lookAtTarget = new THREE.Vector3(
    cameraLookAtTarget[0] || 0,
    cameraLookAtTarget[1] || 0,
    cameraLookAtTarget[2] || 0
  );

  // Función para interpolar la posición de la cámara
  const interpolateCameraPosition = (
    targetPosition: THREE.Vector3,
    lerpFactor: number,
    lookAt: THREE.Vector3 | null = null
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
    // Actualizar lookAtTarget desde el contexto
    lookAtTarget.set(
      cameraLookAtTarget[0] || 0,
      cameraLookAtTarget[1] || 0,
      cameraLookAtTarget[2] || 0
    );
    
    if (scrollProgress <= 0.1) {
      camera.position.set(0, 0, 5); // Posición inicial
      camera.lookAt(0, 0, 0); // Mirar al centro
      setActiveInfo("");
    } else if (scrollProgress >= 0.4 && scrollProgress < 0.55) {
      if (activeInfo === "") {
        // Cuando no hay activeInfo, mirar siempre al centro (moneda)
        interpolateCameraPosition(new THREE.Vector3(0, 0, 15), 0.03, new THREE.Vector3(0, 0, 0));
      } else {
        // Cuando hay activeInfo, usar el lookAt del contexto
        interpolateCameraPosition(
          new THREE.Vector3(
            cameraTarget[0] || 0,
            cameraTarget[1] || 0,
            cameraTarget[2] || 0
          ), 
          0.03, 
          new THREE.Vector3(
            cameraLookAtTarget[0] || 0,
            cameraLookAtTarget[1] || 0,
            cameraLookAtTarget[2] || 0
          )
        );
      }
    } else if (scrollProgress >= 0.55 && scrollProgress < 0.9) {
      setActiveInfo("");
      interpolateCameraPosition(new THREE.Vector3(0, 0, 24), 0.03, new THREE.Vector3(0, 0, 0));
    } else if (scrollProgress >= 0.9) {
      // interpolateCameraPosition(new THREE.Vector3(0, -0.03, 10.15), 0.05);
      interpolateCameraPosition(new THREE.Vector3(0, -0.03, 15), 0.05, new THREE.Vector3(0, 0, 0));
    } else {
      setActiveInfo("");
      interpolateCameraPosition(new THREE.Vector3(0, 0, 5), 0.03, new THREE.Vector3(0, 0, 0));
    }
  });

  return null;
};
