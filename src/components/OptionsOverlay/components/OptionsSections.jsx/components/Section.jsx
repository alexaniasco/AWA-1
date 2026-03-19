import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturesList from "../../../../Hexagon/FeaturesList";
import HeroFeatureCard from "../../../../Hexagon/HeroFeatureCard";
import { SectionData } from "../data/data";
import { AppContext } from "../../../../../context/AppContext";
import { useContext } from "react";
import "./Section.css";

/* ── Per-section color tokens ─────────────────────────────────────── */
const SECTION_THEME = {
  EMPRESA: {
    rgb: "30, 130, 180",
    color: "#1e82b4",
    label: "Empresas IT",
    eyebrow: "Soluciones corporativas",
    ctaColor: "#4B7E8E",
  },
  PROFESIONAL: {
    rgb: "18, 140, 126",
    color: "#128c7e",
    label: "Profesionales IT",
    eyebrow: "Impulsa tu carrera",
    ctaColor: "#8E4CA8",
  },
  EXCLUSIVO: {
    rgb: "107, 33, 168",
    color: "#6b21a8",
    label: "Servicios exclusivos",
    eyebrow: "Tecnología a tu medida",
    ctaColor: "#4156B5",
  },
};

/* ── Stats per section ────────────────────────────────────────────── */
const SECTION_STATS = {
  EMPRESA: [
    { value: 40, suffix: "%", label: "Reducción de tiempos" },
    { value: 98, suffix: "%", label: "Uptime garantizado" },
    { value: 3, suffix: "x", label: "Retorno promedio" },
  ],
  PROFESIONAL: [
    { value: 120, suffix: "+", label: "Proyectos activos" },
    { value: 48, suffix: "+", label: "Profesionales" },
    { value: 15, suffix: "+", label: "Países" },
  ],
  EXCLUSIVO: [
    { value: 100, suffix: "%", label: "Proyectos a medida" },
    { value: 24, suffix: "/7", label: "Soporte dedicado" },
    { value: 5, suffix: "★", label: "Satisfacción" },
  ],
};

/* ── Animated counter hook ────────────────────────────────────────── */
function useCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatPill({ value, suffix, label }) {
  const count = useCounter(value);
  return (
    <div className="sp-stat">
      <span className="sp-stat-value">
        {count}
        {suffix}
      </span>
      <span className="sp-stat-label">{label}</span>
    </div>
  );
}

/* ── Back SVG ─────────────────────────────────────────────────────── */
const BackArrow = ({ color }) => (
  <svg
    className="sp-back-icon"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke={color}
  >
    <path d="M19 12H5M5 12L12 19M5 12L12 5" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════════
   MOBILE CAROUSEL — standalone premium component
   Key design:
   • Full-height slide per feature
   • Swipe left/right gesture (Framer drag)
   • Feature icon centered, big
   • Title + description below
   • CTA button
   • Dot nav at bottom with accent color
   ════════════════════════════════════════════════════════════════════ */
function MobileCarousel({ features, theme, onBack, stats }) {
  const { scrollToSection } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 left, 1 right
  const [, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const feature = features[currentIndex];
  const total = features.length;

  const goTo = (idx) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };
  const prev = () => goTo(Math.max(0, currentIndex - 1));
  const next = () => goTo(Math.min(total - 1, currentIndex + 1));

  /* Swipe via pointer events (works on iOS safari) */
  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    setIsDragging(false);
  };
  const handlePointerMove = (e) => {
    if (Math.abs(e.clientX - dragStartX.current) > 8) setIsDragging(true);
  };
  const handlePointerUp = (e) => {
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 42) {
      dx < 0 ? next() : prev();
    }
    setIsDragging(false);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "60%" : "-60%",
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-60%" : "60%",
      opacity: 0,
      scale: 0.94,
      transition: { duration: 0.3, ease: "easeIn" },
    }),
  };

  return (
    <div
      className="mob-carousel"
      style={{ "--sp-rgb": theme.rgb, "--sp-color": theme.color }}
    >
      {/* ── Decorative bg ─────────────────────────────────── */}
      <div className="mob-bg">
        <div className="mob-orb mob-orb--1" />
        <div className="mob-orb mob-orb--2" />
        <div className="mob-dots" />
      </div>

      {/* ── Top bar: back + badge + counter ───────────────── */}
      <div className="mob-header">
        <button className="mob-back" onClick={onBack} aria-label="Volver">
          <BackArrow color={theme.color} />
          <span className="mob-back-text">Volver</span>
        </button>

        <div className="mob-badge">
          <span className="mob-badge-dot" />
          <span className="mob-badge-label">{theme.label}</span>
        </div>

        <span className="mob-counter">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* ── Slide area ────────────────────────────────────── */}
      <div
        className="mob-slide-area"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={feature.id}
            className="mob-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Icon */}
            <div className="mob-icon-wrap">
              <div className="mob-icon-glow" />
              <img
                src={feature.hero.image}
                alt={feature.hero.title}
                className="mob-icon-img"
                draggable={false}
              />
            </div>

            {/* Text */}
            <div className="mob-text-block">
              <h2 className="mob-title">{feature.hero.title}</h2>
              <p className="mob-desc">{feature.hero.description}</p>

              <button
                className="mob-cta"
                onClick={() => scrollToSection(0.99)}
                style={{ background: theme.ctaColor }}
              >
                Ver servicios
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dot navigation ────────────────────────────────── */}
      <div className="mob-dots-nav">
        {features.map((f, i) => (
          <button
            key={f.id}
            className={`mob-dot ${i === currentIndex ? "mob-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a ${f.text}`}
          />
        ))}
      </div>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <div className="mob-stats">
        {stats.map((s) => (
          <StatPill
            key={s.label}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
          />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN SECTION COMPONENT
   ════════════════════════════════════════════════════════════════════ */
export default function Section({ handleBack, position = "right", section }) {
  const data = SectionData[section];
  const theme = SECTION_THEME[section] || SECTION_THEME.EMPRESA;
  const stats = SECTION_STATS[section] || [];
  const allFeatures = data.features || [];

  const [activeFeature, setActiveFeature] = useState(
    allFeatures.find((f) => f.id === "A7") || allFeatures[0],
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768,
  );
  const [isTablet, setIsTablet] = useState(
    typeof window !== "undefined" &&
      window.innerWidth > 768 &&
      window.innerWidth <= 900,
  );

  const activeIndex = allFeatures.findIndex((f) => f.id === activeFeature.id);
  const progressPct =
    allFeatures.length > 1
      ? ((activeIndex + 1) / allFeatures.length) * 100
      : 100;

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 900);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleDotClick = (index) => {
    if (isTransitioning || index === activeIndex) return;
    const clicked = allFeatures[index];
    if (!clicked) return;
    setIsTransitioning(true);
    setActiveFeature(clicked);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleButtonClick = (clickedId) => {
    if (isTransitioning) return;
    const clicked = allFeatures.find((f) => f.id === clickedId);
    if (!clicked || clicked.id === activeFeature.id) return;
    setIsTransitioning(true);
    setActiveFeature(clicked);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  /* ── MOBILE: render carousel ──────────────────────────────────── */
  if (isMobile) {
    return (
      <MobileCarousel
        features={allFeatures}
        theme={theme}
        onBack={handleBack}
        stats={stats}
      />
    );
  }

  /* ── DESKTOP / TABLET: original sp-* layout ───────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`motion-section sp-section ${position}`}
      style={{
        "--sp-rgb": theme.rgb,
        "--sp-color": theme.color,
      }}
    >
      {/* Decorative bg */}
      <div className="sp-bg">
        <div className="sp-orb sp-orb--1" />
        <div className="sp-orb sp-orb--2" />
        <div className="sp-dots" />
        <div className="sp-accent-line" />
        <div className="sp-glow" />
      </div>

      <div
        className="section-content"
        style={{
          justifyContent: isTablet
            ? section === "EXCLUSIVO"
              ? "flex-end"
              : "flex-start"
            : undefined,
        }}
      >
        <div className="section-inner">
          <div className="sp-content">
            {/* Header row */}
            <div className="sp-header">
              <button
                className="sp-back"
                onClick={handleBack}
                aria-label="Volver"
              >
                <BackArrow color={theme.color} />
                <span className="sp-back-text">Volver</span>
              </button>

              <div className="sp-badge">
                <span className="sp-badge-dot" />
                <span className="sp-badge-label">{theme.label}</span>
              </div>

              <div className="sp-progress">
                <div className="sp-progress-track">
                  <motion.div
                    className="sp-progress-fill"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
                <span className="sp-progress-count">
                  {activeIndex + 1}/{allFeatures.length}
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="sp-heading">
              <span className="sp-eyebrow">{theme.eyebrow}</span>
              <h2 className="sp-title">{data.ui?.title}</h2>
            </div>

            {/* Main area */}
            <div className="sp-main">
              <div className="sp-sidebar">
                <FeaturesList
                  title=""
                  subtitle=""
                  features={allFeatures}
                  onSelect={handleButtonClick}
                  activeId={activeFeature.id}
                />
              </div>

              <div className="sp-hero-area hero-container">
                <div className="sp-hero-glow" />
                <AnimatePresence mode="wait">
                  <HeroFeatureCard
                    cards={allFeatures}
                    section={section}
                    key={activeFeature.id}
                    title={activeFeature.hero.title}
                    description={activeFeature.hero.description}
                    image={activeFeature.hero.image}
                    isTransitioning={isTransitioning}
                    activeIndex={activeIndex}
                    onDotClick={handleDotClick}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Stats */}
            <div className="sp-stats">
              {stats.map((s) => (
                <StatPill
                  key={s.label}
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
