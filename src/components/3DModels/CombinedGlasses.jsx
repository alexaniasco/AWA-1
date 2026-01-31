/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

useGLTF.preload("/GLASES222.glb");

const STAGGER_DELAY_S = 0.5;
const STAGGER_FADE_S = 0.35;

// Colores distintos para cada mesh (vidrio con tinte vibrante)
const MESH_COLORS = [
  new THREE.Color(1.0, 0.6, 0.8), // Rosa vibrante (Curve.012)
  new THREE.Color(0.6, 0.8, 1.0), // Azul vibrante (Curve)
  new THREE.Color(0.7, 1.0, 0.75), // Verde vibrante (Curve.003)
];

function getNameOrder(name) {
  // Orden natural tipo: Curve (0), Curve.003 (3), Curve.012 (12)
  if (!name) return Number.POSITIVE_INFINITY;
  const match = String(name).match(/\.(\d+)$/);
  if (!match) return 0;
  return Number(match[1]);
}

export const CombinedGlasses = ({
  position = [0, 0, -10],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
  opacity = 1,
}) => {
  const { scene } = useGLTF("/GLASES222.glb");
  const roughnessTexture = useTexture("/DefaultMaterial_Roughness.jpg");
  const groupRef = useRef();
  const meshEntriesRef = useRef([]);
  const opacityRef = useRef(1);
  const seqTimeRef = useRef(0);
  const targetPositionRef = useRef(new THREE.Vector3(...position));

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone(true);
  }, [scene]);

  useEffect(() => {
    if (!clonedScene || !roughnessTexture) return;

    // Configuramos la textura de roughness
    roughnessTexture.flipY = false;
    roughnessTexture.wrapS = THREE.RepeatWrapping;
    roughnessTexture.wrapT = THREE.RepeatWrapping;
    // Roughness map NO es color: debe ser lineal / no-color.
    // (En three r152+ se usa `colorSpace`.)
    if ("colorSpace" in roughnessTexture) {
      roughnessTexture.colorSpace = THREE.NoColorSpace;
    }

    // Activamos y configuramos los materiales del GLB para que se vean correctamente
    const meshEntries = [];
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Aseguramos que el mesh sea visible
        child.visible = true;
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];

        const nextMats = mats.map((mat) => {
          // Guardamos la opacidad base para animaciones suaves
          if (mat.userData.baseOpacity === undefined) {
            mat.userData.baseOpacity = mat.opacity ?? 1;
          }
          const name = (mat.name ?? "").toLowerCase();
          const isGlass =
            name.includes("glass") ||
            name.includes("frosted") ||
            name.includes("vidrio");

          // Si viene de BlenderKit, muchas veces NO se exporta el shader complejo a glTF.
          // Lo reemplazamos por un MeshPhysicalMaterial (PBR) con transmisión, que sí se ve en three.js.
          // El color se asignará después de ordenar los meshes
          if (isGlass) {
            const glassMat = new THREE.MeshPhysicalMaterial({
              name: mat.name,
              color: new THREE.Color(1, 1, 1), // Color temporal, se actualizará después
              emissive: new THREE.Color(0, 0, 0), // Se actualizará después para brillo
              emissiveIntensity: 0.15, // Brillo sutil desde dentro
              metalness: 0,
              roughness: 0.05, // Muy liso para reflejos claros
              transmission: 0.92, // Alta transmisión - vidrio limpio
              ior: 1.5, // Índice de refracción del vidrio
              thickness: 0.3,
              transparent: true,
              opacity: mat.userData.baseOpacity ?? 1,
              side: THREE.DoubleSide,
              envMapIntensity: 2.2, // Más reflejos del entorno
              clearcoat: 0.6, // Capa brillante más intensa
              clearcoatRoughness: 0.05, // Clearcoat más pulido
              reflectivity: 0.6, // Reflectividad mayor
              specularIntensity: 1.2, // Más brillo especular
              specularColor: new THREE.Color(1, 1, 1),
            });

            glassMat.roughnessMap = roughnessTexture;
            glassMat.depthWrite = false; // reduce artefactos de sorting en transparencia
            glassMat.needsUpdate = true;
            return glassMat;
          }

          // Material no-vidrio: lo dejamos como está por ahora
          mat.visible = true;
          // Configuramos propiedades importantes para que el material se vea
          if (mat.opacity < 1 || mat.transparent) {
            mat.transparent = true;
          }
          // Aseguramos que se vea desde ambos lados
          if (mat.side === undefined) {
            mat.side = THREE.DoubleSide;
          }

          // Forzamos la actualización del material
          mat.needsUpdate = true;

          // Desactivamos wireframe si está activo
          mat.wireframe = false;
          return mat;
        });

        child.material = Array.isArray(child.material) ? nextMats : nextMats[0];

        // Guardamos por-mesh para animar aparición escalonada
        meshEntries.push({
          mesh: child,
          materials: nextMats,
        });
      }
    });

    // Ordenar los 3 objetos: Curve, Curve.003, Curve.012 (o el orden natural si cambian nombres)
    meshEntries.sort((a, b) => {
      const an = a.mesh?.name ?? "";
      const bn = b.mesh?.name ?? "";
      const ao = getNameOrder(an);
      const bo = getNameOrder(bn);
      if (ao !== bo) return ao - bo;
      return String(an).localeCompare(String(bn));
    });

    // Ahora asignamos los colores según el orden final
    meshEntries.forEach((entry, index) => {
      const meshColor = MESH_COLORS[index % MESH_COLORS.length].clone();
      // Color emissive más sutil (30% del color base)
      const emissiveColor = meshColor.clone().multiplyScalar(0.3);
      entry.materials.forEach((mat) => {
        // Aplicar color a materiales de vidrio
        if (mat.isMeshPhysicalMaterial) {
          mat.color.copy(meshColor);
          mat.emissive.copy(emissiveColor);
          mat.needsUpdate = true;
        }
        // Aplicar color a materiales no-vidrio si tienen la propiedad color
        else if (mat.color) {
          mat.color.copy(meshColor);
          mat.needsUpdate = true;
        }
      });
    });

    meshEntriesRef.current = meshEntries;
  }, [clonedScene, roughnessTexture]);

  useFrame((_state, delta) => {
    if (!groupRef.current || !clonedScene) return;

    // Interpolar suavemente la posición del grupo
    targetPositionRef.current.set(...position);
    groupRef.current.position.lerp(targetPositionRef.current, 0.08);

    // Opacidad global (se puede usar para bajar intensidad sin afectar el stagger)
    opacityRef.current += (opacity - opacityRef.current) * 0.1;

    const entries = meshEntriesRef.current ?? [];
    const totalDuration =
      Math.max(0, entries.length - 1) * STAGGER_DELAY_S + STAGGER_FADE_S;

    // Progreso de la secuencia en segundos (sube/baja sin reset; reversible)
    const targetSeqTime = visible ? totalDuration : 0;
    const maxStep = Math.max(0, delta); // velocidad 1:1 (1s por 1s)
    const diff = targetSeqTime - seqTimeRef.current;
    if (Math.abs(diff) <= maxStep) {
      seqTimeRef.current = targetSeqTime;
    } else {
      seqTimeRef.current += Math.sign(diff) * maxStep;
    }

    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      if (!entry?.mesh) continue;

      // Stagger basado en el tiempo de secuencia:
      // - Entrada: seqTime sube => aparecen 0, 0.5, 1.0...
      // - Salida: seqTime baja => desaparecen en orden inverso, suave y sin resets
      const localT = seqTimeRef.current - i * STAGGER_DELAY_S;
      const reveal = THREE.MathUtils.clamp(localT / STAGGER_FADE_S, 0, 1);

      // Opacidad final por mesh = opacidad global (suavizada) * reveal
      const meshOpacity = opacityRef.current * reveal;

      // Ocultar completamente si aún no toca o ya terminó la salida
      entry.mesh.visible = meshOpacity > 0.001;

      const mats = entry.materials ?? [];
      for (const mat of mats) {
        const baseOpacity = mat?.userData?.baseOpacity ?? 1;
        const newOpacity = baseOpacity * meshOpacity;
        mat.opacity = newOpacity;
        if (newOpacity < 1) mat.transparent = true;
        mat.needsUpdate = true;
      }
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

CombinedGlasses.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  visible: PropTypes.bool,
  opacity: PropTypes.number,
};
