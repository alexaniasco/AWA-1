import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useContext } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Float, Center, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { AppContext } from "../../context/AppContext";
import "./HeroFeatureCard.css";
import "./HeroFeatureCard-dots.css";

// --- Componente 3D para el efecto Hover / Tilt ---
function TiltGroup({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    // Convertir la posición normalizada del puntero (-1 a 1) en decaimiento suave
    target.current.x = THREE.MathUtils.lerp(
      target.current.x,
      state.pointer.x * 0.4,
      delta * 5,
    ); // max angle ~22deg
    target.current.y = THREE.MathUtils.lerp(
      target.current.y,
      state.pointer.y * -0.4,
      delta * 5,
    );

    if (group.current) {
      group.current.rotation.y = target.current.x;
      group.current.rotation.x = target.current.y;
    }
  });

  return <group ref={group}>{children}</group>;
}

// Geometría de Hexágono
const HexagonGeometry = new THREE.CylinderGeometry(1.6, 1.6, 0.15, 6);
HexagonGeometry.rotateX(Math.PI / 2); // Orientarlo hacia la cámara

// --------------------------------------------------

interface HeroFeatureCardProps {
  title: string;
  description: string;
  image: string;
  section: string;
  isTransitioning?: boolean;
  cards: {
    id: string;
    hero: { title: string; description: string; image: string };
  }[];
  activeIndex: number;
  onDotClick: (index: number) => void;
}

export default function HeroFeatureCard({
  title,
  description,
  image,
  section,
  isTransitioning = false,
  cards,
  activeIndex,
  onDotClick,
}: HeroFeatureCardProps) {
  const { scrollToSection } = useContext(AppContext);
  const tiltRef = useRef<HTMLDivElement>(null);
  const current = useRef({ rotateX: 0, rotateY: 0 });
  const target = useRef({ rotateX: 0, rotateY: 0 });
  const strength = useRef(1);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768,
  );

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // La lógica 3D irá dentro del Canvas

  return (
    <motion.div
      key={title}
      className="hero-feature-card"
      data-section={section}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="hero-feature-card__icon-container">
        <div
          className="hero-feature-card__icon-wrapper"
          style={{ height: "200px", perspective: "none" }}
        >
          {isMobile ? (
            <div className="hexagon-stack">
              <img
                src="/luzelipse.svg"
                alt=""
                className="hero-feature-card__glow"
              />
              <img src={image} alt="" className="hero-feature-card__icon" />
            </div>
          ) : (
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={2} />
              <directionalLight
                position={[-5, -5, -5]}
                intensity={0.5}
                color="#cb4f8d"
              />

              <Float
                speed={2}
                rotationIntensity={0}
                floatIntensity={1}
                floatingRange={[-0.1, 0.1]}
              >
                <TiltGroup>
                  {/* Vidrio Hexagonal Principal */}
                  <mesh geometry={HexagonGeometry}>
                    <meshPhysicalMaterial
                      color="#ffffff"
                      emissive="#000000"
                      emissiveIntensity={0.2}
                      metalness={0.15}
                      roughness={0.15}
                      transmission={0.85}
                      ior={1.5}
                      thickness={0.4}
                      transparent
                      opacity={0.88}
                      clearcoat={0.9}
                      clearcoatRoughness={0.05}
                    />
                  </mesh>

                  {/* Icono del hexágono centrado */}
                  <Html
                    transform
                    distanceFactor={5}
                    zIndexRange={[100, 0]}
                    pointerEvents="none"
                    position={[0, 0, 0.1]}
                  >
                    <div
                      style={{
                        pointerEvents: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: "400px",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </Html>
                </TiltGroup>
              </Float>
            </Canvas>
          )}
        </div>
      </div>

      {/* TEXTO */}
      <div className="hero-feature-card__content">
        {/* PUNTOS DE ÍNDICE */}
        {isMobile && (
          <div className="hero-feature-card__dots">
            {cards.map((card, index) => (
              <button
                key={card.id}
                className={`hero-feature-card__dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => onDotClick(index)}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        <h2 className="hero-feature-card__title">{title}</h2>
        <p className="hero-feature-card__description">{description}</p>
        <div className="hero-feature-card__divider-line" />
        <button
          className="hero-feature-card__cta"
          onClick={() => scrollToSection(0.99)}
          style={{
            backgroundColor:
              section === "EXCLUSIVO"
                ? "#4156B5"
                : section === "PROFESIONAL"
                  ? "#8E4CA8"
                  : section === "EMPRESA"
                    ? "#4B7E8E"
                    : "transparent",
          }}
        >
          Ver servicios
        </button>
      </div>
    </motion.div>
  );
}
