import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import "./HeroFeatureCard.css";

interface HeroFeatureCardProps {
  title: string;
  description: string;
  image: string;
  isTransitioning?: boolean;
}

export default function HeroFeatureCard({
  title,
  description,
  image,
  isTransitioning = false,
}: HeroFeatureCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const current = useRef({ rotateX: 0, rotateY: 0 });
  const target = useRef({ rotateX: 0, rotateY: 0 });
  const strength = useRef(1);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
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

  /* ================== TILT + FLOAT (solo en desktop) ================== */
  useEffect(() => {
    // En mobile: NO animaciones, todo estático
    if (isMobile) {
      if (tiltRef.current) {
        tiltRef.current.style.transform = "none";
        tiltRef.current.style.willChange = "auto";
      }
      // Resetear valores de animación
      current.current = { rotateX: 0, rotateY: 0 };
      target.current = { rotateX: 0, rotateY: 0 };
      strength.current = 0;
      return;
    }

    const MAX_ROTATION = 26;
    const LERP = 0.08;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      target.current.rotateY = (x / window.innerWidth) * MAX_ROTATION;
      target.current.rotateX = (y / window.innerHeight) * -MAX_ROTATION;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const start = performance.now();

    const animate = (time: number) => {
      const targetStrength = isTransitioning ? 0 : 1;
      strength.current += (targetStrength - strength.current) * 0.08;

      const floatY = Math.sin((time - start) * 0.001) * 10;

      current.current.rotateX +=
        (target.current.rotateX - current.current.rotateX) *
        LERP *
        strength.current;
      current.current.rotateY +=
        (target.current.rotateY - current.current.rotateY) *
        LERP *
        strength.current;

      if (tiltRef.current) {
        tiltRef.current.style.transform = `translateY(${floatY}px) rotateX(${current.current.rotateX}deg) rotateY(${current.current.rotateY}deg) translateZ(24px)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [isTransitioning, isMobile]);

  return (
    <motion.div
      key={title}
      className="hero-feature-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="hero-feature-card__icon-wrapper">
        <div ref={isMobile ? null : tiltRef}>
          <img src={image} alt="" className="hero-feature-card__icon" />
        </div>
      </div>

      {/* TEXTO */}
      <div className="hero-feature-card__content">
        <h2 className="hero-feature-card__title">{title}</h2>
        <p className="hero-feature-card__description">{description}</p>
        <div className="hero-feature-card__divider" />
        <button className="hero-feature-card__cta">Ver beneficios</button>
      </div>
    </motion.div>
  );
}
