/**
 * Configuración de materiales para la moneda.
 * Recorre la escena GLTF y aplica MeshPhysicalMaterial con efecto vidrio sutil.
 */
import * as THREE from "three";
import { COIN_LIGHT_LAYER } from "./config";

/**
 * Recorre la escena de la moneda y reemplaza los materiales estándar
 * por MeshPhysicalMaterial con propiedades de vidrio sutil.
 *
 * @param {THREE.Object3D} scene - Escena del GLTF de la moneda.
 */
export function setupCoinMaterials(scene) {
  scene.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    // Habilitar layer de iluminación dedicado
    child.layers.enable(COIN_LIGHT_LAYER);

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((mat, idx) => {
      if (!mat.isMeshStandardMaterial && !mat.isMeshPhysicalMaterial) return;

      const glassMat = new THREE.MeshPhysicalMaterial({
        // Mantener texturas originales
        map: mat.map,
        normalMap: mat.normalMap,
        roughnessMap: mat.roughnessMap,
        metalnessMap: mat.metalnessMap,
        aoMap: mat.aoMap,
        emissiveMap: mat.emissiveMap,

        // Color original
        color: mat.color || new THREE.Color(0xffffff),

        // Efecto vidrio sutil
        opacity: 0.6,
        roughness: 0.9,
        metalness: mat.metalness || 0.0,
        thickness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        side: THREE.DoubleSide,
      });

      // Reemplazar material
      if (Array.isArray(child.material)) {
        child.material[idx] = glassMat;
      } else {
        child.material = glassMat;
      }
    });
  });
}
