/**
 * Módulo centralizado para precargar todos los modelos GLB de la aplicación.
 * Esto asegura que los modelos estén listos antes de que se necesiten,
 * evitando lag cuando aparecen por primera vez.
 */

import { useGLTF } from "@react-three/drei";

/**
 * Precarga todos los modelos de glasses que se usan en la aplicación.
 * Esta función debe ser llamada al inicio de la app, antes de que se rendericen los componentes.
 */
export const preloadGlassesModels = () => {
  // Modelos usados en GlassGroup/GlassModel3D
  useGLTF.preload("/glas1final.glb");
  useGLTF.preload("/glases222final.glb");
  useGLTF.preload("/glases333final.glb");
  
  // Modelo usado en CombinedGlasses
  useGLTF.preload("/GLASES222.glb");
  
  console.log("✅ Modelos de glasses precargados");
};

/**
 * Precarga todos los modelos principales de la aplicación.
 * Incluye glasses, coin, y otros modelos críticos.
 */
export const preloadAllModels = () => {
  // Glasses
  preloadGlassesModels();
  
  // Coin (si se necesita precargar)
  // useGLTF.preload("/coinhd.glb");
  
  console.log("✅ Todos los modelos precargados");
};
