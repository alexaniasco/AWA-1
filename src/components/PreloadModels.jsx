/**
 * Componente de precarga de modelos GLB.
 * Se monta dentro del Canvas de Three.js para asegurar que los modelos estén listos
 * antes de que se necesiten, evitando lag cuando aparecen por primera vez.
 * 
 * Este componente debe montarse dentro del contexto de React Three Fiber (dentro de <Canvas>).
 * Las precargas se ejecutan automáticamente cuando este módulo se importa.
 */
import { useGLTF } from "@react-three/drei";

// Precargar modelos de glasses usados en GlassGroup/GlassModel3D
useGLTF.preload("/glas1final.glb");
useGLTF.preload("/glases222final.glb");
useGLTF.preload("/glases333final.glb");

// Precargar modelo usado en CombinedGlasses
useGLTF.preload("/GLASES222.glb");

/**
 * Componente invisible que se monta dentro del Canvas para iniciar la precarga.
 * Las precargas ya se ejecutaron en el nivel superior del módulo cuando se importó.
 * Esto asegura que los recursos estén listos antes de que los componentes los necesiten.
 */
export const PreloadModels = () => {
  // Las precargas ya se ejecutaron en el nivel superior del módulo
  // Este componente solo asegura que el módulo se importe y las precargas se activen
  return null;
};

export default PreloadModels;
