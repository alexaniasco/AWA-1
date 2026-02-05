import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Control de la cámara
export const SectionCameraControls = ({
  scrollProgress,
  cameraTarget,
  setCameraTarget,
  activeInfo,
  setActiveInfo,
} : {
  scrollProgress: number,
  cameraTarget: number[],
  setCameraTarget: (target: number[]) => void,
  activeInfo: string
}) => {
  const { camera } = useThree();
  const lookAtTarget = new THREE.Vector3(0, 0, 0);

  // Función para interpolar la posición de la cámara
  const interpolateCameraPosition = (targetPosition, lerpFactor) => {
    camera.position.lerp(targetPosition, lerpFactor);
    lookAtTarget.lerp(targetPosition, lerpFactor);
    camera.lookAt(lookAtTarget);
  };

  useFrame(() => {
    if (scrollProgress <= 0.1) {
      camera.position.set(0, 0, 5); // Posición inicial
      setActiveInfo("");
    } else if (scrollProgress >= 0.4 && scrollProgress < 0.55) {
      if (activeInfo === "") {
        interpolateCameraPosition(new THREE.Vector3(0, 0, 15), 0.03);
      } else {
        interpolateCameraPosition(new THREE.Vector3(...cameraTarget), 0.03);
      }
    } else if (scrollProgress >= 0.55 && scrollProgress < 0.9) {
      setActiveInfo("");

      interpolateCameraPosition(new THREE.Vector3(0, 0, 24), 0.03);
    } else if (scrollProgress >= 0.9) {
      // interpolateCameraPosition(new THREE.Vector3(0, -0.03, 10.15), 0.05);
      interpolateCameraPosition(new THREE.Vector3(0, -0.03, 15), 0.05);
    } else {
      setActiveInfo("");

      interpolateCameraPosition(new THREE.Vector3(0, 0, 5), 0.03);
    }
  });

  return null;
};
