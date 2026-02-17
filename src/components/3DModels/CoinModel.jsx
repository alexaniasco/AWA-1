/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import { AppContext } from "../../context/AppContext";
import { setupCoinMaterials } from "./coin/setupMaterials";
import {
  SPEED,
  SCROLL,
  MOBILE_BREAKPOINT,
  getResponsiveScale,
  getPositions,
  easeOutCubic,
} from "./coin/config";

// ⚡ Preloads centralizados en PreloadModels.jsx — NO duplicar aquí.

// Objetos reutilizables para evitar allocations en useFrame
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _offsetQuat = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(0, Math.PI / 2, 0),
);
const _vec3 = new THREE.Vector3();

// ─── Componente ──────────────────────────────────────────────────────────────

export const CoinModel = ({ scrollProgress }) => {
  const { coinRef: ref, activeInfo, setCoinHasLanded } = useContext(AppContext);
  const { scene } = useGLTF("/coinpintada.glb");
  const { camera } = useThree();

  const [hasLanded, setHasLanded] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT,
  );

  const hasInitialized = useRef(false);
  const lastScroll = useRef(0);
  const targetPos = useRef(new THREE.Vector3());

  // ─── Responsive ────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Posiciones según dispositivo
  const pos = getPositions(isMobile);

  // ─── Inicialización (una sola vez) ─────────────────────────────────────
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setupCoinMaterials(scene);

    if (ref.current) {
      ref.current.position.copy(pos.start);
    }

    setTimeout(() => {
      setHasLanded(true);
      setCoinHasLanded?.(true);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, setCoinHasLanded]);

  // ─── Reset al volver al inicio ────────────────────────────────────────
  useEffect(() => {
    const wasAdvanced = lastScroll.current > SCROLL.WAS_ADVANCED;
    const isAtStart = scrollProgress < SCROLL.RESET_THRESHOLD;

    if (wasAdvanced && isAtStart && ref.current) {
      ref.current.position.copy(pos.start);

      const s = getResponsiveScale();
      ref.current.scale.set(s, s, s);
      ref.current.rotation.set(0, 0, 0);

      setHasLanded(false);
      setCoinHasLanded?.(false);

      setTimeout(() => {
        setHasLanded(true);
        setCoinHasLanded?.(true);
      }, 500);
    }

    lastScroll.current = scrollProgress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollProgress, setCoinHasLanded]);

  // ─── Frame loop ────────────────────────────────────────────────────────
  useFrame((_state, delta) => {
    const coin = ref.current;
    if (!coin) return;

    // Cuando hay info activa: solo mirar a cámara
    if (activeInfo) {
      lookAtCamera(coin, camera);
      return;
    }

    // Escala
    updateScale(coin, scrollProgress, isMobile);

    // Posición
    updatePosition(coin, scrollProgress, hasLanded, isMobile, pos, targetPos);

    // Rotación
    updateRotation(coin, scrollProgress, camera, delta);
  });

  return <primitive ref={ref} object={scene} scale={2} />;
};

CoinModel.propTypes = {
  scrollProgress: PropTypes.number.isRequired,
};

// ─── Helpers de animación (fuera del componente para evitar recreaciones) ────

/** Orienta la moneda hacia la cámara con slerp suave. */
function lookAtCamera(coin, camera) {
  _mat4.lookAt(coin.position, camera.position, coin.up);
  _quat.setFromRotationMatrix(_mat4).multiply(_offsetQuat);
  coin.quaternion.slerp(_quat, SPEED.LOOK_AT);
}

/** En móvil, escala extra en la sección de opciones (glasses). */
const MOBILE_OPTIONS_SCALE = 1.35;

/** Actualiza la escala: zoom en la sección final, responsiva el resto. */
function updateScale(coin, scroll, isMobile) {
  if (scroll >= SCROLL.ZOOM_START) {
    const factor = 1 + (scroll - SCROLL.ZOOM_START) * 2200;
    coin.scale.lerp(_vec3.set(factor, factor, factor), 0.03);
  } else {
    let s = getResponsiveScale();
    // En móvil, agrandar un poco la moneda en la sección de opciones (glasses)
    if (isMobile && scroll >= SCROLL.FINAL_SECTION) {
      s *= MOBILE_OPTIONS_SCALE;
    }
    coin.scale.lerp(_vec3.set(s, s, s), SPEED.SCALE);
  }
}

/** Lerp factor suave para centrar X en mobile (en vez de snap a 0). */
const MOBILE_X_LERP = 0.04;

/** Actualiza la posición según el scroll y el estado de aterrizaje. */
function updatePosition(coin, scroll, hasLanded, isMobile, pos, targetRef) {
  if (scroll >= SCROLL.ZOOM_START) {
    // Sección zoom: subir en Y
    const lift = (scroll - SCROLL.LOOK_AT_START) * 2;
    coin.position.y = THREE.MathUtils.lerp(coin.position.y, 2 + lift, 0.03);
  } else if (!hasLanded) {
    // Caída inicial
    coin.position.lerp(pos.center, SPEED.FALL);
    if (isMobile)
      coin.position.x = THREE.MathUtils.lerp(coin.position.x, 0, MOBILE_X_LERP);
  } else if (scroll < SCROLL.ENTRY_LIMIT) {
    // Primer desplazamiento
    coin.position.lerp(pos.entry, SPEED.ENTRY);
    if (isMobile)
      coin.position.x = THREE.MathUtils.lerp(coin.position.x, 0, MOBILE_X_LERP);
  } else if (scroll < SCROLL.FINAL_SECTION) {
    // Recorrido por el path (el path ya define X, no forzamos a 0)
    interpolatePath(coin, scroll, pos.path, targetRef);
  } else {
    // Sección de opciones (0.4 – 0.9)
    // En móvil: mover a la izquierda para encajar en el semicírculo de los vidrios
    const optionsX = isMobile ? -1.4 : 0;
    const y = scroll >= SCROLL.LOOK_AT_START ? coin.position.y : 0;
    coin.position.lerp(_vec3.set(optionsX, y, 10), SPEED.FINAL);
  }
}

/** Interpola posición a lo largo del path según scroll. */
function interpolatePath(coin, scroll, path, targetRef) {
  const segCount = path.length - 1;
  const idx = Math.min(Math.floor(scroll * segCount), segCount - 1);
  const local = THREE.MathUtils.clamp(scroll * segCount - idx, 0, 1);
  targetRef.current.lerpVectors(path[idx], path[idx + 1], easeOutCubic(local));
  coin.position.lerp(targetRef.current, SPEED.MOVE);
}

/** Actualiza rotación: mira a cámara en sección final, gira libre el resto. */
function updateRotation(coin, scroll, camera, delta) {
  if (scroll >= SCROLL.LOOK_AT_START) {
    lookAtCamera(coin, camera);

    // Levitar ligeramente
    const lift = (scroll - SCROLL.LOOK_AT_START) * 0.5;
    coin.position.y = THREE.MathUtils.lerp(coin.position.y, lift, 0.05);
  } else {
    // Rotación libre
    coin.rotation.y += delta * 0.5;
    coin.rotation.x += delta * 0.2;
  }
}
