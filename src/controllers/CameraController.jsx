import { useThree, useFrame } from "@react-three/fiber";
import { useContext, useRef, useEffect } from "react";
import * as THREE from "three";
import { AppContext } from "../context/AppContext";

// Smooth easing function
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export const CameraController = () => {
  const { camera } = useThree();
  const { cameraTarget, cameraLookAtTarget } = useContext(AppContext);

  // Refs to store animation state
  const animatingRef = useRef(false);
  const startTimeRef = useRef(0);
  const durationRef = useRef(1.5); // seconds
  const startPositionRef = useRef(new THREE.Vector3());
  const targetPositionRef = useRef(new THREE.Vector3());
  const startLookAtRef = useRef(new THREE.Vector3());
  const targetLookAtRef = useRef(new THREE.Vector3());
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Start animation when targets change
  useEffect(() => {
    if (!cameraTarget || !cameraLookAtTarget) return;

    // Set up animation state
    animatingRef.current = true;
    startTimeRef.current = performance.now();
    durationRef.current = 1.5;
    startPositionRef.current.copy(camera.position);
    targetPositionRef.current.set(...cameraTarget);
    startLookAtRef.current.copy(currentLookAtRef.current);
    targetLookAtRef.current.set(...cameraLookAtTarget);
  }, [cameraTarget, cameraLookAtTarget, camera]);

  useFrame(() => {
    if (!animatingRef.current) return;

    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    const duration = durationRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);

    // Interpolate position
    camera.position.lerpVectors(
      startPositionRef.current,
      targetPositionRef.current,
      easedProgress
    );

    // Interpolate lookAt
    const newLookAt = new THREE.Vector3().lerpVectors(
      startLookAtRef.current,
      targetLookAtRef.current,
      easedProgress
    );
    currentLookAtRef.current.copy(newLookAt);

    camera.lookAt(newLookAt);
    camera.up.set(0, 1, 0);
    camera.updateProjectionMatrix();

    if (progress >= 1) {
      // Ensure final state is exact
      camera.position.copy(targetPositionRef.current);
      camera.lookAt(targetLookAtRef.current);
      currentLookAtRef.current.copy(targetLookAtRef.current);
      camera.updateProjectionMatrix();
      animatingRef.current = false;
    }
  });

  return null;
};
