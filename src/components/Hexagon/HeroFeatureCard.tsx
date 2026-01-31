import { useEffect, useRef } from "react";
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

  /* ================== TILT + FLOAT (NO SE TOCA) ================== */
  useEffect(() => {
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
        (target.current.rotateX - current.current.rotateX) * LERP * strength.current;
      current.current.rotateY +=
        (target.current.rotateY - current.current.rotateY) * LERP * strength.current;

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
  }, [isTransitioning]);

  return (
    <div className="hero-feature-card">
      <motion.div
      style={{marginBottom: "-20px"}}
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ICONO PRINCIPAL */}
        <div ref={tiltRef} className="hero-feature-card__icon-wrapper">
          <img src={image} alt="" className="hero-feature-card__icon" />
        </div>
      </motion.div>

      {/* TEXTO */}
      <div className="hero-feature-card__content">
        <h2 className="hero-feature-card__title">{title}</h2>
        <p className="hero-feature-card__description">{description}</p>
        <div className="hero-feature-card__divider" />
        <motion.button
          className="hero-feature-card__cta"
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 0.25, delay: 0.6 }}
        >
          Ver beneficios
        </motion.button>
      </div>
    </div>
  );
}
