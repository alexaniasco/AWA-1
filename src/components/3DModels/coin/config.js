/**
 * Configuración centralizada de la moneda.
 * Editar posiciones, velocidades y breakpoints aquí — no en CoinModel.jsx.
 */
import * as THREE from "three";

// ─── Layer de iluminación dedicado para la moneda ────────────────────────────
export const COIN_LIGHT_LAYER = 1;

// ─── Breakpoints ─────────────────────────────────────────────────────────────
export const MOBILE_BREAKPOINT = 600;
export const TABLET_BREAKPOINT = 1024;

// ─── Velocidades de interpolación (lerp factor por frame) ────────────────────
export const SPEED = {
  FALL: 0.012, // caída inicial
  ENTRY: 0.02, // primer desplazamiento lateral
  MOVE: 0.02, // recorrido general
  FINAL: 0.05, // sección final / opciones
  SCALE: 0.05, // transición de escala
  LOOK_AT: 0.08, // slerp hacia cámara
};

// ─── Umbrales de scroll ──────────────────────────────────────────────────────
export const SCROLL = {
  ENTRY_LIMIT: 0.07, // hasta aquí se usa ENTRY_SPEED
  FINAL_SECTION: 0.39  , // >= aquí: sección de opciones / final
  LOOK_AT_START: 0.82, // >= aquí: moneda mira a cámara
  ZOOM_START: 0.92, // >= aquí: zoom out final
  RESET_THRESHOLD: 0.02, // < aquí: se considera "inicio"
  WAS_ADVANCED: 0.1, // > aquí: se considera que el usuario avanzó
};

// ─── Posiciones: Desktop ─────────────────────────────────────────────────────
export const DESKTOP = {
  start: new THREE.Vector3(2.5, 15, -3),
  center: new THREE.Vector3(0, 0, -6),
  entry: new THREE.Vector3(2.6, 0, -1),
  options: new THREE.Vector3(0, 0, 11),
  path: [
    new THREE.Vector3(2.6, 0, -8),
    new THREE.Vector3(-2, 0, 1),
    new THREE.Vector3(-3.5, 0, 1),
    new THREE.Vector3(0, 0, 20),
  ],
};

// ─── Posiciones: Tablet (Híbrido) ───────────────────────────────────────────
export const TABLET = {
  start: new THREE.Vector3(0, 15, -4),
  center: new THREE.Vector3(0, 0, -5),
  entry: new THREE.Vector3(0, 0.5, -1.5),
  options: new THREE.Vector3(-2.5, 0, 10),
  path: [
    new THREE.Vector3(2, 0, -5),
    new THREE.Vector3(0, 2, -1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 0, 12), // Cambiado de 0 a -1.4 para alinear a la izquierda
  ],
};

// ─── Posiciones: Móvil (centrado horizontal) ─────────────────────────────────
export const MOBILE = {
  start: new THREE.Vector3(0, 15, -5),
  center: new THREE.Vector3(0, 5, -3),
  entry: new THREE.Vector3(0, 2, -2),
  options: new THREE.Vector3(-3.2, 0, 16),
  path: [
    new THREE.Vector3(1.5, 1, -2),
    new THREE.Vector3(0,2, -2),
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(-1, 0, 10),
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ─── Escala basada en porcentaje de pantalla ──────────────────────────────────
// La moneda debe ocupar entre MIN_PCT y MAX_PCT del ancho visible de la pantalla.
// Se calcula usando el frustum de la cámara para obtener el ancho visible en world
// units a la distancia Z donde se encuentra la moneda, y se escala proporcionalmente.
//
// Calibración empírica: a scale=1.0, la moneda tiene ~1.0 world units de diámetro
// visual (medido: scale 1.6 → 40% de pantalla en 1514px → scale 1.0 ≈ 25%).
const COIN_WORLD_DIAMETER = 1.0; // diámetro visual de la moneda a scale=1
const MIN_PCT = 0.20; // mínimo 20% del ancho visible
const MAX_PCT = 0.30; // máximo 30% del ancho visible
const TARGET_PCT = 0.25; // objetivo ideal 25%

// FOV dinámica (misma lógica que ResponsiveCamera en MainApp.jsx)
function _getFov(aspect) {
  if (aspect < 0.75) return 65;
  if (aspect < 1) return 60;
  if (aspect < 1.4) return 55;
  return 50;
}

// Z de la cámara en la sección hero (misma lógica que SectionCameraController)
function _getHeroCameraZ(aspect) {
  const baseZ = 5;
  const baseFov = 50;
  const currentFov = _getFov(aspect);
  const fovCorrection = Math.tan((baseFov * Math.PI) / 360) / Math.tan((currentFov * Math.PI) / 360);
  
  if (aspect < 1) {
    return (baseZ / aspect) * fovCorrection;
  }
  return baseZ * fovCorrection;
}

/**
 * Escala responsiva basada en el porcentaje de pantalla.
 * La moneda siempre ocupará entre 20% y 30% del ancho visible.
 */
export const getResponsiveScale = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;

  const fov = _getFov(aspect);
  const cameraZ = _getHeroCameraZ(aspect);

  // Ancho visible del frustum a la posición Z=0 (donde está la moneda)
  const fovRad = (fov * Math.PI) / 180;
  const visibleWidth = 2 * cameraZ * Math.tan(fovRad / 2);

  // Escala necesaria para que la moneda ocupe TARGET_PCT del ancho visible
  const targetWorldSize = visibleWidth * TARGET_PCT;
  const targetScale = targetWorldSize / COIN_WORLD_DIAMETER;

  // Clamp al rango [20%, 30%]
  const minScale = (visibleWidth * MIN_PCT) / COIN_WORLD_DIAMETER;
  const maxScale = (visibleWidth * MAX_PCT) / COIN_WORLD_DIAMETER;

  return Math.max(minScale, Math.min(maxScale, targetScale));
};

/** Devuelve las posiciones correspondientes al dispositivo actual. */
export const getPositions = (width) => {
  if (width <= MOBILE_BREAKPOINT) return MOBILE;
  if (width <= TABLET_BREAKPOINT) return TABLET;
  return DESKTOP;
};

/** Easing cúbico de salida. */
export const easeOutCubic = (t) => 1 - (1 - t) ** 3;
