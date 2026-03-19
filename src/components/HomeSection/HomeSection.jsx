import { motion, AnimatePresence } from "motion/react";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import "./HomeSection.css";

/* ── Counter hook ──────────────────────────────────────────────────── */
function useCounter(target, duration = 1400, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

/* ── Cycling word with crossfade ────────────────────────────────────── */
const CYCLING_WORDS = ["empresas", "profesionales", "proyectos", "marcas"];
function useCycleWord(interval = 2200, active = false) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % CYCLING_WORDS.length);
        setVisible(true);
      }, 350);
    }, interval);
    return () => clearInterval(id);
  }, [active, interval]);
  return { word: CYCLING_WORDS[index], visible };
}

/* ── Letter stagger for title ───────────────────────────────────────── */
function SplitTitle({ text, className, delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: char === " " ? "inline" : "inline-block" }}
          initial={{ opacity: 0, y: 36, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.038,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Stat card ──────────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, delay, active, icon }) {
  const count = useCounter(value, 1400, active);
  return (
    <motion.div
      className="hs-stat"
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <span className="hs-stat-icon">{icon}</span>
      <span className="hs-stat-value">
        {count}{suffix}
      </span>
      <span className="hs-stat-label">{label}</span>
    </motion.div>
  );
}

/* ── Main component ────────────────────────────────────────────────── */
const HomeSection = () => {
  const { setContactModal, scrollProgress, coinHasLanded } = useContext(AppContext);
  const [showContent, setShowContent] = useState(false);
  const [phase, setPhase] = useState(0); // 0=badge, 1=title, 2=sub, 3=rest
  const { word: cycleWord, visible: cycleVisible } = useCycleWord(2200, showContent);

  const handleContactClick = () => setContactModal(true);

  /* Staggered phase reveal after coin lands */
  useEffect(() => {
    if (!coinHasLanded) return;
    const t0 = setTimeout(() => setShowContent(true), 1200);
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 2600);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [coinHasLanded]);

  /* Scroll exit */
  const normalizedProgress = Math.min(Math.max(scrollProgress / 0.15, 0), 1);
  const translateY = normalizedProgress * -150;
  const fadeOutStart = 0.6;
  let scrollOpacity = 1;
  if (normalizedProgress >= fadeOutStart) {
    const fp = (normalizedProgress - fadeOutStart) / (1 - fadeOutStart);
    scrollOpacity = 1 - fp;
  }

  return (
    <motion.div
      className="home-section-wrapper"
      style={{ transform: `translateY(${translateY}vh)`, opacity: scrollOpacity }}
    >
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="home-section-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
            transition={{ duration: 0.5 }}
          >
            {/* ── Decorative orbs ─────────────────────────────────── */}
            <div className="hs-orb hs-orb--1" />
            <div className="hs-orb hs-orb--2" />
            <div className="hs-orb hs-orb--3" />

            {/* ── Badge ───────────────────────────────────────────── */}
            <motion.div
              className="hs-badge"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="hs-badge-dot" />
              <span className="hs-badge-ring" />
              Agencia Digital · 2025
            </motion.div>

            {/* ── Title: letter stagger ───────────────────────────── */}
            <h1 className="hs-title" style={{ perspective: "600px" }}>
              {phase >= 1 && (
                <>
                  <SplitTitle
                    text="Bienvenido a"
                    className="hs-title-welcome"
                    delay={0}
                  />
                  {/* <br /> */}
                  <SplitTitle
                    text="Apolo Web"
                    className="hs-title-main"
                    delay={0.1}
                  />
                  {" "}
                  <SplitTitle
                    text="Agency"
                    className="hs-title-accent"
                    delay={0.55}
                  />
                </>
              )}
            </h1>

            {/* ── Accent lines ─────────────────────────────────────── */}
            {phase >= 2 && (
              <div className="hs-divider-wrap">
                <motion.div
                  className="hs-divider-line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  className="hs-divider-dot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                />
              </div>
            )}

            {/* ── Cycling subtitle ─────────────────────────────────── */}
            {phase >= 2 && (
              <motion.div
                className="hs-subtitle-wrap"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="hs-subtitle-static">
                  Potenciamos
                </span>
                <span className="hs-subtitle-cycle-wrap">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cycleWord}
                      className="hs-subtitle-cycle"
                      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {cycleWord}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="hs-subtitle-static">
                  {" "}con tecnología de vanguardia.
                </span>
              </motion.div>
            )}

            {/* ── Stats ────────────────────────────────────────────── */}
        

            {/* ── CTA ──────────────────────────────────────────────── */}
            {phase >= 3 && (
              <motion.div
                className="hs-cta-wrap"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.button
                  className="hs-cta-primary"
                  onClick={handleContactClick}
                  whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="hs-cta-glow" />
                  Empezar Ahora →
                </motion.button>
                <motion.button
                  className="hs-cta-ghost"
                  onClick={handleContactClick}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  Ver servicios
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomeSection;
