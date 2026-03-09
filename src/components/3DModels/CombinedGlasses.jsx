/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

const STAGGER_DELAY_S = 0.5;
const STAGGER_FADE_S = 0.35;
// Escala base más razonable para mobile
const MOBILE_BASE_SCALE = 400;
const TABLET_BASE_SCALE = 250;
const MOBILE_Z_OFFSET = 1;
const MOBILE_Y_OFFSET = 0;

const GRADIENTS = [
  {
    // Desktop version
    colors: [
      { stop: 0, color: "#cb4f8d" },
      { stop: 0.3, color: "#b2517e" },
      { stop: 0.6, color: "#a92c65" },
      { stop: 0.85, color: "#da5e96" },
      { stop: 1, color: "#db367e" },
    ],
    angle: 135,
  },

  {
    // Desktop version
    colors: [
      { stop: 0, color: "#6B8AFF" },
      { stop: 0.3, color: "#4A6CFF" },
      { stop: 0.6, color: "#4c63cb" },
      { stop: 0.85, color: "#4865d7" },
      { stop: 1, color: "#5565e1" },
    ],
    angle: 135,
  },
  {
    // Desktop version
    colors: [
      { stop: 0, color: "#486454" },
      { stop: 0.3, color: "#3fad6b" },
      { stop: 0.6, color: "#4F9A74" },
      { stop: 0.85, color: "#33b380" },
      { stop: 1, color: "#308d6b" },
    ],
    angle: 135,
  },

  // Tablet variations
  {
    colors: [
      { stop: 0, color: "#6B8E6B" },
      { stop: 0.3, color: "#4A7B4A" },
      { stop: 0.6, color: "#8FBC8F" },
      { stop: 0.85, color: "#5A8A5A" },
      { stop: 1, color: "#3A5F3A" },
    ],
    angle: 135,
  },
  {
    colors: [
      { stop: 0, color: "#9B4B7B" },
      { stop: 0.3, color: "#C47BA5" },
      { stop: 0.6, color: "#B85A8F" },
      { stop: 0.85, color: "#D46B9D" },
      { stop: 1, color: "#8B3A6B" },
    ],
    angle: 135,
  },
  {
    colors: [
      { stop: 0, color: "#7B9BFF" },
      { stop: 0.3, color: "#5A7BFF" },
      { stop: 0.6, color: "#4A6CFF" },
      { stop: 0.85, color: "#3A5ACC" },
      { stop: 1, color: "#1A3A7B" },
    ],
    angle: 135,
  },
  // Mobile variations

  {
    colors: [
      { stop: 0, color: "#8FAFFF" },
      { stop: 0.3, color: "#6F9FFF" },
      { stop: 0.6, color: "#7FBFFF" },
      { stop: 0.85, color: "#5F8FFF" },
      { stop: 1, color: "#3F6F9F" },
    ],
    angle: 135,
  },
  {
    colors: [
      { stop: 0, color: "#8FBF8F" },
      { stop: 0.3, color: "#6FAF6F" },
      { stop: 0.6, color: "#AFDFAF" },
      { stop: 0.85, color: "#7F9F7F" },
      { stop: 1, color: "#5F7F5F" },
    ],
    angle: 135,
  },
  {
    colors: [
      { stop: 0, color: "#B58FA5" },
      { stop: 0.3, color: "#D4AFC5" },
      { stop: 0.6, color: "#C49FB5" },
      { stop: 0.85, color: "#E4BFD5" },
      { stop: 1, color: "#956F85" },
    ],
    angle: 135,
  },
];

function createGradientTexture({ colors, angle }, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const len = Math.sqrt(2) * size;
  const cx = size / 2;
  const cy = size / 2;

  const grad = ctx.createLinearGradient(
    cx - (len / 2) * cos,
    cy - (len / 2) * sin,
    cx + (len / 2) * cos,
    cy + (len / 2) * sin,
  );
  colors.forEach(({ stop, color }) => grad.addColorStop(stop, color));

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function getNameOrder(name) {
  if (!name) return Infinity;
  const m = String(name).match(/\.(\d+)$/);
  return m ? Number(m[1]) : 0;
}

const CombinedGlasses = ({
  position = [0, 0, -10],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
  opacity = 1,
  deviceConfig = {},
}) => {
  const { isMobile, isTablet } = deviceConfig;

  // Usar deviceConfig consistentemente - el resize ya se maneja en MainApp
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;

  // Cargar modelos
  const { scene: sceneDesktop } = useGLTF("/GLASES222.glb");
  const { scene: sceneMobile } = useGLTF("/glassmobile.glb");

  const sourceScene =
    isMobile || isTablet ? sceneMobile || sceneDesktop : sceneDesktop;

  const roughnessTexture = useTexture("/DefaultMaterial_Roughness.jpg");

  const groupRef = useRef();
  const meshEntriesRef = useRef([]);
  const opacityRef = useRef(1);
  const seqTimeRef = useRef(0);
  const targetPosRef = useRef(new THREE.Vector3(...position));

  // ── Escala responsiva corregida ──
  // Si el modelo mobile ya está a escala correcta, no reducirlo tanto
  const effectiveScale = useMemo(() => {
    if (isMobile) {
      // Escalar proporcionalmente al viewport pero con un mínimo visible
      const factor = Math.max(viewportWidth / 1400, 0.5);
      return scale * MOBILE_BASE_SCALE * factor;
    }
    if (isTablet) {
      const factor = Math.max(viewportWidth / 1800, 0.5);
      return scale * TABLET_BASE_SCALE * factor;
    }
    return scale;
  }, [isMobile, isTablet, scale, viewportWidth]);

  // ── Posición efectiva ──
  const effectivePosition = useMemo(() => {
    if (isMobile || isTablet) {
      return [0, position[1] + MOBILE_Y_OFFSET, position[2] + MOBILE_Z_OFFSET];
    }
    return position;
  }, [isMobile, isTablet, position]);

  const [rx = 0, ry = 0, rz = 0] = rotation;
  const effectiveRotation = [rx, ry, rz];

  // ── Clonar escena — agregar sourceScene.uuid para forzar recálculo ──
  const clonedScene = useMemo(() => {
    if (!sourceScene) return null;
    const clone = sourceScene.clone(true);

    // Forzar visibilidad de todos los hijos
    clone.traverse((child) => {
      child.visible = true;
      if (child.isMesh) {
        child.frustumCulled = false; // ← Evitar que Three.js oculte por frustum
      }
    });

    return clone;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceScene, sourceScene?.uuid]);

  // ── Configurar materiales y gradientes ──
  useEffect(() => {
    if (!clonedScene) return;

    // if (roughnessTexture && !isMobile && !isTablet) {
    //   roughnessTexture.flipY = false;
    //   roughnessTexture.wrapS = THREE.RepeatWrapping;
    //   roughnessTexture.wrapT = THREE.RepeatWrapping;
    //   if ("colorSpace" in roughnessTexture) {
    //     roughnessTexture.colorSpace = THREE.NoColorSpace;
    //   }
    // }

    const meshEntries = [];
    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.visible = true;
      child.frustumCulled = false; // ← Importante para mobile

      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const newMats = mats.map((mat) => {
        if (mat.userData.baseOpacity === undefined) {
          mat.userData.baseOpacity = mat.opacity ?? 1;
        }
        const name = (mat.name ?? "").toLowerCase();

        const treatAsGlass =
          isMobile ||
          isTablet ||
          name.includes("glass") ||
          name.includes("frosted") ||
          name.includes("vidrio");

        if (treatAsGlass) {
          const isSimpleMaterial = isMobile || isTablet;

          const glassMat = isSimpleMaterial
            ? new THREE.MeshStandardMaterial({
                name: mat.name,
                color: new THREE.Color(1, 1, 1),
                emissive: new THREE.Color(0, 0, 0),
                emissiveIntensity: 0.35,
                metalness: 0.15,
                roughness: 0.2,
                envMapIntensity: 2.2,
                transparent: true,
                opacity: mat.userData.baseOpacity ?? 0.92,
                side: THREE.DoubleSide,
                depthWrite: true, // ← Cambiado a true para evitar problemas de orden
              })
            : new THREE.MeshPhysicalMaterial({
                name: mat.name,
                color: new THREE.Color(1, 1, 1),
                emissive: new THREE.Color(0, 0, 0),
                emissiveIntensity: 0.2,
                metalness: 0.15,
                roughness: 0.15,
                envMapIntensity: 2.2,
                transmission: 0.85,
                ior: 1.5,
                thickness: 0.4,
                transparent: true,
                opacity: mat.userData.baseOpacity ?? 0.88,
                side: THREE.DoubleSide,
                clearcoat: 0.9,
                clearcoatRoughness: 0.05,
                depthWrite: false,
                ...(roughnessTexture ? { roughnessMap: roughnessTexture } : {}),
              });

          glassMat.needsUpdate = true;
          return glassMat;
        }

        mat.visible = true;
        if (mat.opacity < 1 || mat.transparent) mat.transparent = true;
        if (mat.side === undefined) mat.side = THREE.DoubleSide;
        mat.wireframe = false;
        mat.needsUpdate = true;
        return mat;
      });

      child.material = Array.isArray(child.material) ? newMats : newMats[0];
      meshEntries.push({ mesh: child, materials: newMats });
    });

    meshEntries.sort((a, b) => {
      const ao = getNameOrder(a.mesh?.name);
      const bo = getNameOrder(b.mesh?.name);
      if (ao !== bo) return ao - bo;
      return String(a.mesh?.name ?? "").localeCompare(
        String(b.mesh?.name ?? ""),
      );
    });

    const texSize = isMobile ? 128 : 512;

    meshEntries.forEach((entry, idx) => {
      const cfg = GRADIENTS[idx % GRADIENTS.length];
      const gradTex = createGradientTexture(cfg, texSize);
      const baseColor = new THREE.Color(cfg.colors[0].color);
      const emissive = baseColor.clone().multiplyScalar(0.4);

      entry.materials.forEach((mat) => {
        if (mat.isMeshPhysicalMaterial || mat.isMeshStandardMaterial) {
          mat.map = gradTex;
          mat.color.set(0xffffff);
          if (mat.emissive) mat.emissive.copy(emissive);
          mat.needsUpdate = true;
        } else if (mat.map !== undefined) {
          mat.map = gradTex;
          mat.color?.set(0xffffff);
          mat.needsUpdate = true;
        } else if (mat.color) {
          mat.color.copy(baseColor);
          mat.needsUpdate = true;
        }
      });
    });

    meshEntriesRef.current = meshEntries;
  }, [clonedScene, isMobile, isTablet, roughnessTexture]);

  // ── Frame loop ──
  useFrame((_state, delta) => {
    if (!groupRef.current || !clonedScene) return;

    targetPosRef.current.set(...effectivePosition);
    groupRef.current.position.lerp(targetPosRef.current, 0.08);

    opacityRef.current += (opacity - opacityRef.current) * 0.1;

    const entries = meshEntriesRef.current;
    const totalDur =
      Math.max(0, entries.length - 1) * STAGGER_DELAY_S + STAGGER_FADE_S;
    const targetTime = visible ? totalDur : 0;
    const maxStep = Math.max(0, delta);
    const diff = targetTime - seqTimeRef.current;

    seqTimeRef.current =
      Math.abs(diff) <= maxStep
        ? targetTime
        : seqTimeRef.current + Math.sign(diff) * maxStep;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry?.mesh) continue;

      const localT = seqTimeRef.current - i * STAGGER_DELAY_S;
      const reveal = THREE.MathUtils.clamp(localT / STAGGER_FADE_S, 0, 1);
      const meshOpacity = opacityRef.current * reveal;

      entry.mesh.visible = meshOpacity > 0.001;

      for (const mat of entry.materials) {
        const base = mat?.userData?.baseOpacity ?? 1;
        mat.opacity = base * meshOpacity;
        if (mat.opacity < 1) mat.transparent = true;
        mat.needsUpdate = true;
      }
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef} rotation={effectiveRotation} scale={effectiveScale}>
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
  deviceConfig: PropTypes.object,
};

export default CombinedGlasses;
