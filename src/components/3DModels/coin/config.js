/**
 * Configuración centralizada de la moneda.
 * Editar posiciones, velocidades y breakpoints aquí — no en CoinModel.jsx.
 */
import * as THREE from "three";

// ─── Layer de iluminación dedicado para la moneda ────────────────────────────
export const COIN_LIGHT_LAYER = 1;

// ─── Breakpoint móvil ────────────────────────────────────────────────────────
export const MOBILE_BREAKPOINT = 768;

// ─── Velocidades de interpolación (lerp factor por frame) ────────────────────
export const SPEED = {
  FALL: 0.012, // caída inicial
  ENTRY: 0.02, // primer desplazamiento lateral
  MOVE: 0.02, // recorrido general
  FINAL: 0.05, // sección final / opciones
  SCALE: 0.1, // transición de escala
  LOOK_AT: 0.08, // slerp hacia cámara
};

// ─── Umbrales de scroll ──────────────────────────────────────────────────────
export const SCROLL = {
  ENTRY_LIMIT: 0.07, // hasta aquí se usa ENTRY_SPEED
  FINAL_SECTION: 0.4, // >= aquí: sección de opciones / final
  LOOK_AT_START: 0.82, // >= aquí: moneda mira a cámara
  ZOOM_START: 0.9, // >= aquí: zoom out final
  RESET_THRESHOLD: 0.02, // < aquí: se considera "inicio"
  WAS_ADVANCED: 0.1, // > aquí: se considera que el usuario avanzó
};

// ─── Posiciones: Desktop ─────────────────────────────────────────────────────
export const DESKTOP = {
  start: new THREE.Vector3(2.5, 15, -3),
  center: new THREE.Vector3(0, 0, -3),
  entry: new THREE.Vector3(2.6, 0, -2),
  path: [
    new THREE.Vector3(2.6, 0, -2),
    new THREE.Vector3(-2.5, 0, 1),
    new THREE.Vector3(-3.5, 0, 1),
    new THREE.Vector3(0, 0, 20),
  ],
};

// ─── Posiciones: Móvil (centrado horizontal) ─────────────────────────────────
// El último punto del path debe coincidir con el target de la sección de opciones
// para que la transición entre secciones sea fluida (sin salto).
export const MOBILE = {
  start: new THREE.Vector3(0, 15, -5),
  center: new THREE.Vector3(0, 0, -3),
  entry: new THREE.Vector3(0, 1, -2),
  path: [
    new THREE.Vector3(10, 0, -2),
    new THREE.Vector3(0, -1.3, 1),
    new THREE.Vector3(0, -2, 5),
    new THREE.Vector3(-1, 0, 10), // ← conecta suavemente con la sección de opciones
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Escala responsiva basada en el tamaño de ventana. */
export const getResponsiveScale = () => {
  const base = 3;
  const factor = Math.min(window.innerWidth, window.innerHeight) / 800;
  return base * factor;
};

/** Devuelve las posiciones correspondientes al dispositivo actual. */
export const getPositions = (isMobile) => (isMobile ? MOBILE : DESKTOP);

/** Easing cúbico de salida. */
export const easeOutCubic = (t) => 1 - (1 - t) ** 3;
