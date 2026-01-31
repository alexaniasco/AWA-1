import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import { AppContext } from "../../context/AppContext";

const COIN_LIGHT_LAYER = 1;

// =========================
// VELOCIDADES DE MOVIMIENTO
// =========================
const FALL_SPEED = 0.012; // caída inicial
const ENTRY_SPEED = 0.02; // 🔹 primer desplazamiento lateral
const MOVE_SPEED = 0.02; // recorrido general
const FINAL_SPEED = 0.05; // salida final
const ENTRY_SCROLL_LIMIT = 0.07;
// =========================

const tempMatrix = new THREE.Matrix4();
const tempQuat = new THREE.Quaternion();
const offsetQuat = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(0, Math.PI / 2, 0)
);

const getResponsiveScale = () => {
  const baseScale = 3;
  const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 800;
  return baseScale * scaleFactor;
};

// Detectar si estamos en móvil
const isMobile = () => {
  return window.innerWidth <= 768;
};

// =========================
// PARTICULAS TIPO RÍO
// =========================
const PARTICLE_COUNT = 300;

const createParticles = () => {
  const arr = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const side = Math.random() > 0.5 ? -1 : 1;
    arr.push({
      pos: new THREE.Vector3(
        side * (10 + Math.random() * 5),
        Math.random() * 4 - 2,
        Math.random() * 2 - 1
      ),
      vel: new THREE.Vector3(
        -side * (4 + Math.random() * 2),
        1 + Math.random() * 1.5,
        0
      ),
      life: 0,
    });
  }
  return arr;
};

export const CoinModel = ({ scrollProgress }) => {
  const { coinRef: ref, activeInfo, setCoinHasLanded } = useContext(AppContext);

  const { scene } = useGLTF("/coinhd.glb");
  const { camera } = useThree();

  const [isManuallyMoved, setIsManuallyMoved] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [particles, setParticles] = useState([]);
  
  // Ref para trackear si ya se inicializó (evita re-inicialización en HMR)
  const hasInitialized = useRef(false);
  // Ref para la última posición de scroll conocida
  const lastScrollProgress = useRef(0);

  // Posiciones para desktop
  const startPosition = new THREE.Vector3(2.5, 15, -3);
  const centerPosition = new THREE.Vector3(0, 0, -3);
  const entryPosition = new THREE.Vector3(2.6, 0, -2);
  
  // Posiciones para móvil (siempre centradas horizontalmente)
  const mobileStartPosition = new THREE.Vector3(0, 15, -5);
  const mobileCenterPosition = new THREE.Vector3(0, 0, -3);
  const mobileEntryPosition = new THREE.Vector3(0, -1, -2);
  
  const targetPosition = useRef(new THREE.Vector3());
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // =========================
  // Detectar cambios de tamaño de pantalla
  // =========================
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // =========================
  // Inicialización de moneda y escena
  // =========================
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Usar posición inicial según el dispositivo
    const initialPosition = isMobile() ? mobileStartPosition : startPosition;
    if (ref.current) ref.current.position.copy(initialPosition);

    setTimeout(() => {
      setHasLanded(true);
      setCoinHasLanded?.(true);
    }, 500);
  }, [scene, setCoinHasLanded]);

  // =========================
  // Reset cuando volvemos al inicio (scrollProgress cerca de 0)
  // =========================
  useEffect(() => {
    // Detectar cuando volvemos al inicio desde una posición avanzada
    const wasAdvanced = lastScrollProgress.current > 0.1;
    const isAtStart = scrollProgress < 0.02;
    
    if (wasAdvanced && isAtStart && ref.current) {
      // Reset de la posición de la moneda
      const initialPosition = isMobile() ? mobileStartPosition : startPosition;
      ref.current.position.copy(initialPosition);
      
      // Reset de la escala
      const s = getResponsiveScale();
      ref.current.scale.set(s, s, s);
      
      // Reset de la rotación
      ref.current.rotation.set(0, 0, 0);
      
      // Reset del estado de aterrizaje para que vuelva a animar
      setHasLanded(false);
      setCoinHasLanded?.(false);
      setIsManuallyMoved(false);
      
      // Volver a activar el aterrizaje después de un delay
      setTimeout(() => {
        setHasLanded(true);
        setCoinHasLanded?.(true);
      }, 500);
    }
    
    lastScrollProgress.current = scrollProgress;
  }, [scrollProgress, setCoinHasLanded]);

  // Posiciones del recorrido según dispositivo
  const desktopPositions = [
    new THREE.Vector3(2.6, 0, -2),
    new THREE.Vector3(-2.5, 0, 1),
    new THREE.Vector3(-3.5, 0, 1),
    new THREE.Vector3(0, 0, 20),
  ];

  // En móvil: recorrido vertical centrado (solo cambia Y y Z)
  const mobilePositions = [
    new THREE.Vector3(10, 0, -2),      // Después del aterrizaje, centrada
    new THREE.Vector3(0, -1.3, 1),     // Baja un poco
    new THREE.Vector3(0, -4, 5),     // Baja más
    new THREE.Vector3(0, 0, 20),     // Final
  ];
  
  const modelPositions = isMobileDevice ? mobilePositions : desktopPositions;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // =========================
  // Loop principal de frame
  // =========================
  useFrame((state, delta) => {
    if (!ref.current) return;

    // =========================
    // INFO ACTIVA
    // =========================
    if (activeInfo) {
      tempMatrix.lookAt(ref.current.position, camera.position, ref.current.up);
      tempQuat.setFromRotationMatrix(tempMatrix);
      tempQuat.multiply(offsetQuat);
      ref.current.quaternion.slerp(tempQuat, 0.08);
      return;
    }

    if (!isManuallyMoved) {
      //Transicion de la seccion de opciones a la screen final
      if (scrollProgress >= 0.9) {
        const scaleFactor = 1 + (scrollProgress - 0.9) * 2200;
        ref.current.scale.lerp(
          new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor),
          0.03
        );
        const liftAmount = (scrollProgress - 0.82) *2 // Sube hasta 0.2 unidades
        const baseY = 2; // Posición base Y
        const targetY = baseY + liftAmount;
        ref.current.position.y = THREE.MathUtils.lerp(
          ref.current.position.y,
          targetY,
          0.03
        );
      } else {
        const s = getResponsiveScale();
        ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
      }

      // POSICIÓN
      const currentCenterPosition = isMobileDevice ? mobileCenterPosition : centerPosition;
      const currentEntryPosition = isMobileDevice ? mobileEntryPosition : entryPosition;
      
      if (!hasLanded) {
        ref.current.position.lerp(currentCenterPosition, FALL_SPEED);
        // Forzar centrado en móvil
        if (isMobileDevice) ref.current.position.x = 0;
      } else if (scrollProgress < ENTRY_SCROLL_LIMIT) {
        ref.current.position.lerp(currentEntryPosition, ENTRY_SPEED);
        // Forzar centrado en móvil
        if (isMobileDevice) ref.current.position.x = 0;
      } else {
        const isFinalSection = scrollProgress >= 0.4;
        if (!isFinalSection) {
          const index = Math.min(
            Math.floor(scrollProgress * (modelPositions.length - 1)),
            modelPositions.length - 2
          );
          const start = modelPositions[index];
          const end = modelPositions[index + 1];
          const rawProgress = scrollProgress * (modelPositions.length - 1);
          const localProgress = Math.min(Math.max(rawProgress - index, 0), 1);
          const easedProgress = easeOutCubic(localProgress);
          targetPosition.current.lerpVectors(start, end, easedProgress);
          ref.current.position.lerp(targetPosition.current, MOVE_SPEED);
          // Forzar centrado en móvil durante el recorrido
          if (isMobileDevice) ref.current.position.x = 0;
        } else {
          //aca se edita cuando la moneda esta al centro de las opciones
          // Mantener Y actual cuando scrollProgress >= 0.9 (se ajusta en la sección de rotación)
          if (scrollProgress >= 0.9) {
            const currentY = ref.current.position.y;
            // En móvil siempre centrada horizontalmente
            const finalX = 0;
            ref.current.position.lerp(new THREE.Vector3(finalX, currentY, 10), FINAL_SPEED);
            if (isMobileDevice) ref.current.position.x = 0;
          } else {
            // En móvil siempre centrada horizontalmente
            const finalX = 0;
            ref.current.position.lerp(new THREE.Vector3(finalX, 0, 10), FINAL_SPEED);
            if (isMobileDevice) ref.current.position.x = 0;
          }
        }
      }

      // ROTACIÓN
      if (scrollProgress >= 0.82) {
        // Cuando scrollProgress >= 0.82, orientar la moneda hacia la cámara
        tempMatrix.lookAt(
          ref.current.position,
          camera.position,
          ref.current.up
        );
        tempQuat.setFromRotationMatrix(tempMatrix);
        tempQuat.multiply(offsetQuat);
        ref.current.quaternion.slerp(tempQuat, 0.08);
        
        // Subir la moneda levemente mientras se orienta hacia la cámara
        if (scrollProgress >= 0.82) {
          const liftAmount = (scrollProgress - 0.82) * 0.5; // Sube hasta 0.2 unidades
          const baseY = 0; // Posición base Y
          const targetY = baseY + liftAmount;
          ref.current.position.y = THREE.MathUtils.lerp(
            ref.current.position.y,
            targetY,
            0.05
          );
          // Forzar centrado en móvil durante la rotación
          if (isMobileDevice) ref.current.position.x = 0;
        }
      } else {
        // Rotación normal antes de llegar a 0.9
        ref.current.rotation.y += delta * 0.5;
        ref.current.rotation.x += delta * 0.2;
      }
    }

    // =========================
    // ACTUALIZAR PARTICULAS
    // =========================
    if (particles.length > 0) {
      const positions = [];
      let alive = false;
      particles.forEach((p) => {
        if (p.life < 3) {
          alive = true;
          p.pos.addScaledVector(p.vel, delta);
          p.life += delta;
          positions.push(p.pos.x, p.pos.y, p.pos.z);
        }
      });

      if (!alive) setParticles([]); // Termina efecto

      if (pointsRef.current) {
        pointsRef.current.geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const moveCoinTo = (position) => {
    if (!ref.current || activeInfo) return;
    setIsManuallyMoved(true);
    ref.current.position.copy(position);
  };

  const pointsRef = useRef();

  return (
    <>
      <primitive ref={ref} object={scene} scale={2} />

      {particles.length > 0 && (
        <points ref={pointsRef}>
          <bufferGeometry />
          <pointsMaterial color="#00ffff" size={0.05} />
        </points>
      )}
    </>
  );
};

CoinModel.propTypes = {
  scrollProgress: PropTypes.number.isRequired,
};
