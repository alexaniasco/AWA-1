import { useGLTF, Html } from "@react-three/drei";
import React, {
  useContext,
  useState,
  useEffect,
  MutableRefObject,
} from "react";
import { Group, Object3D } from "three";
import { AppContext } from "../../context/AppContext";

interface MaletinModelProps {
  url?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export default function MaletinModel({
  url = "/maleta.glb",
  position = [2, 0, 10],
  rotation = [Math.PI / 100, 200, 0],
  scale = 1,
}: MaletinModelProps): JSX.Element {
  const { maletinRef } = useContext(AppContext) as {
    maletinRef: MutableRefObject<Object3D | null>;
  };

  const { scene } = useGLTF(url) as { scene: Group };
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <primitive
      ref={maletinRef}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
