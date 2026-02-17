/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

// ⚡ Preloads centralizados en PreloadModels.jsx — NO duplicar aquí.

// ─── Constantes ──────────────────────────────────────────────────────────────
const MOBILE_BREAKPOINT = 768;
const STAGGER_DELAY_S = 0.5;
const STAGGER_FADE_S = 0.35;
const MOBILE_SCALE = 70;
const MOBILE_Z_OFFSET = 0;

// ─── Gradientes para los 3 vidrios ──────────────────────────────────────────
const GRADIENTS = [
  // Rosado
  {
    colors: [
      { stop: 0, color: "#FF9ECF" },
      { stop: 0.3, color: "#F06BA8" },
      { stop: 0.6, color: "#E03D87" },
      { stop: 0.85, color: "#C41E6A" },
      { stop: 1, color: "#8B1548" },
    ],
    angle: 135,
  },
  // Verde
  {
    colors: [
      { stop: 0, color: "#9FD4B5" },
      { stop: 0.3, color: "#7FBF9A" },
      { stop: 0.6, color: "#4F9A74" },
      { stop: 0.85, color: "#2E6F55" },
      { stop: 1, color: "#1A4535" },
    ],
    angle: 135,
  },
  // Azul
  {
    colors: [
      { stop: 0, color: "#6B8AFF" },
      { stop: 0.3, color: "#4A6CFF" },
      { stop: 0.6, color: "#1F3FCC" },
      { stop: 0.85, color: "#0F2A99" },
      { stop: 1, color: "#050E4D" },
    ],
    angle: 135,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Crea una textura de gradiente lineal en un canvas. */
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

/** Orden numérico por sufijo de nombre: Curve → 0, Curve.003 → 3, etc. */
function getNameOrder(name) {
  if (!name) return Infinity;
  const m = String(name).match(/\.(\d+)$/);
  return m ? Number(m[1]) : 0;
}

/** Hook ligero para detectar pantalla pequeña (se actualiza con resize). */
function useIsSmallScreen(breakpoint = MOBILE_BREAKPOINT) {
  const [small, setSmall] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const check = () => setSmall(window.innerWidth < breakpoint);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return small;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export const CombinedGlasses = ({
  position = [0, 0, -10],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
  opacity = 1,
}) => {
  const isMobile = useIsSmallScreen();

  // Cargar ambos modelos siempre (hooks deben ser incondicionales)
  const { scene: sceneDesktop } = useGLTF("/GLASES222.glb");
  const { scene: sceneMobile } = useGLTF("/glassmobile.glb");

  // En móvil: preferir modelo cel, fallback a desktop si no cargó
  const sourceScene = isMobile ? sceneMobile || sceneDesktop : sceneDesktop;
  const usingMobileModel = isMobile && !!sceneMobile;

  // Cargar roughness texture (se usa solo en desktop, pero el hook debe llamarse siempre)
  const roughnessTexture = useTexture("/DefaultMaterial_Roughness.jpg");

  const groupRef = useRef();
  const meshEntriesRef = useRef([]);
  const opacityRef = useRef(1);
  const seqTimeRef = useRef(0);
  const targetPosRef = useRef(new THREE.Vector3(...position));

  // Escala y posición ajustadas para móvil
  const effectiveScale = isMobile ? scale * MOBILE_SCALE : scale;
  const effectivePosition = isMobile
    ? [position[0], position[1], position[2] + MOBILE_Z_OFFSET]
    : position;

  // Rotación: en móvil sin rotación extra para que quede de frente a pantalla
  const [rx = 0, ry = 0, rz = 0] = rotation;
  const effectiveRotation = [rx, ry, rz];

  // ─── Clonar escena ───────────────────────────────────────────────────────
  const clonedScene = useMemo(() => {
    if (!sourceScene) return null;
    return sourceScene.clone(true);
  }, [sourceScene]);

  // ─── Configurar materiales y gradientes ──────────────────────────────────
  useEffect(() => {
    if (!clonedScene) return;

    // Configurar roughness texture si existe (solo desktop)
    if (roughnessTexture && !isMobile) {
      roughnessTexture.flipY = false;
      roughnessTexture.wrapS = THREE.RepeatWrapping;
      roughnessTexture.wrapT = THREE.RepeatWrapping;
      if ("colorSpace" in roughnessTexture) {
        roughnessTexture.colorSpace = THREE.NoColorSpace;
      }
    }

    // Recolectar meshes
    const meshEntries = [];
    clonedScene.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.visible = true;

      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const newMats = mats.map((mat) => {
        if (mat.userData.baseOpacity === undefined) {
          mat.userData.baseOpacity = mat.opacity ?? 1;
        }
        const name = (mat.name ?? "").toLowerCase();
        // En móvil: TODOS los materiales reciben tratamiento de vidrio
        // En desktop: solo los que tengan "glass"/"frosted"/"vidrio" en el nombre
        const treatAsGlass =
          isMobile ||
          name.includes("glass") ||
          name.includes("frosted") ||
          name.includes("vidrio");

        if (treatAsGlass) {
          // En móvil: MeshStandardMaterial (compatible con todos los GPUs)
          // En desktop: MeshPhysicalMaterial con transmission (efecto vidrio real)
          const glassMat = isMobile
            ? new THREE.MeshStandardMaterial({
                name: mat.name,
                color: new THREE.Color(1, 1, 1),
                emissive: new THREE.Color(0, 0, 0),
                emissiveIntensity: 0.35,
                metalness: 0.05,
                roughness: 0.2,
                transparent: true,
                opacity: mat.userData.baseOpacity ?? 0.92,
                side: THREE.DoubleSide,
                depthWrite: false,
              })
            : new THREE.MeshPhysicalMaterial({
                name: mat.name,
                color: new THREE.Color(1, 1, 1),
                emissive: new THREE.Color(0, 0, 0),
                emissiveIntensity: 0.2,
                metalness: 0.05,
                roughness: 0.1,
                transmission: 0.85,
                ior: 1.5,
                thickness: 0.4,
                transparent: true,
                opacity: mat.userData.baseOpacity ?? 0.88,
                side: THREE.DoubleSide,
                clearcoat: 0.8,
                clearcoatRoughness: 0.08,
                depthWrite: false,
                ...(roughnessTexture ? { roughnessMap: roughnessTexture } : {}),
              });

          glassMat.needsUpdate = true;
          return glassMat;
        }

        // Material no-vidrio: configurar transparencia y visibilidad
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

    // Ordenar por nombre (Curve, Curve.003, Curve.012…)
    meshEntries.sort((a, b) => {
      const ao = getNameOrder(a.mesh?.name);
      const bo = getNameOrder(b.mesh?.name);
      if (ao !== bo) return ao - bo;
      return String(a.mesh?.name ?? "").localeCompare(
        String(b.mesh?.name ?? ""),
      );
    });

    // Textura de gradiente más pequeña en móvil para ahorrar memoria
    const texSize = isMobile ? 256 : 512;

    // Asignar gradientes por índice (cíclico si hay más de 3 meshes)
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
  }, [clonedScene, isMobile, roughnessTexture]);

  // ─── Frame loop: posición, opacidad, stagger ─────────────────────────────
  useFrame((_state, delta) => {
    if (!groupRef.current || !clonedScene) return;

    // Posición suave
    targetPosRef.current.set(...effectivePosition);
    groupRef.current.position.lerp(targetPosRef.current, 0.08);

    // Opacidad global
    opacityRef.current += (opacity - opacityRef.current) * 0.1;

    // Stagger reveal/hide
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
};
