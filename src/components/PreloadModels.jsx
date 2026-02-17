/**
 * Punto centralizado de precarga de TODOS los modelos GLB de la aplicación.
 * Se ejecuta al importar este módulo (antes de que React monte nada).
 *
 * ⚡ NO agregar useGLTF.preload() en otros archivos — solo aquí.
 */
import { useGLTF } from "@react-three/drei";

// ─── Lista completa de modelos ───────────────────────────────────────────────
const ALL_MODELS = [
  // Moneda principal (usada en CoinModel)
  "/coinpintada.glb",
  // Glasses combinados (desktop y mobile)
  "/GLASES222.glb",
  "/newglasscel.glb",
  // Glasses individuales (usados en GlassGroup / GlassModel3D)
  "/glas1final.glb",
  "/glases222final.glb",
  "/glases333final.glb",
];

// Ejecutar precargas inmediatamente al importar el módulo
ALL_MODELS.forEach((url) => useGLTF.preload(url));

/** Lista de URLs precargadas (útil para debug) */
export const PRELOADED_MODELS = ALL_MODELS;

/**
 * Componente vacío que se monta dentro del Canvas.
 * Su única función es asegurar que este módulo se importe (y por tanto
 * que las precargas a nivel de módulo se ejecuten).
 */
export const PreloadModels = () => null;

export default PreloadModels;
