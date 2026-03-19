import { motion, AnimatePresence } from "motion/react";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import "./SecondSection.css";

/* ── Animated counter hook ─────────────────────────────────────────── */
function useCounter(target, duration = 1400, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

/* ── Stat pill ──────────────────────────────────────────────────────── */
function StatPill({ label, value, suffix = "", delay = 0, active }) {
  const count = useCounter(value, 1400, active);
  return (
    <motion.div
      className="second-stat-pill"
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="second-stat-value">
        {count}
        {suffix}
      </span>
      <span className="second-stat-label">{label}</span>
    </motion.div>
  );
}

const KEYWORDS = ["IA", "Automatización", "Escalabilidad", "Innovación"];

const SecondSection = () => {
  const { scrollProgress } = useContext(AppContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const inSection = scrollProgress >= 0.05 && scrollProgress < 0.65;
    if (inSection && !showContent) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else if (!inSection && showContent) {
      setShowContent(false);
    }
  }, [scrollProgress, showContent]);

  const exitProgress = Math.min(Math.max((scrollProgress - 0.3) / 0.2, 0), 1);
  const translateY = exitProgress * -150;
  const fadeOutStart = 0.6;
  let scrollOpacity = 1;
  if (exitProgress >= fadeOutStart) {
    const fp = (exitProgress - fadeOutStart) / (1 - fadeOutStart);
    scrollOpacity = 1 - fp;
  }

  /* stagger variants */
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className="second-section-wrapper"
      style={{ transform: `translateY(${translateY}vh)`, opacity: scrollOpacity }}
    >
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="second-section-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -24, transition: { duration: 0.4 } }}
          >
            {/* ── Badge ──────────────────────────────────────────── */}
            <motion.div className="second-badge" variants={itemVariants}>
              <span className="second-badge-dot" />
              Inteligencia Artificial · 2025
            </motion.div>

            {/* ── Título con gradiente ────────────────────────────── */}
            <motion.h2 className="second-title" variants={itemVariants}>
              Tecnología
              <br />
              <span className="second-title-gradient">Inteligente</span>
            </motion.h2>

            {/* ── Accent line ─────────────────────────────────────── */}
            <motion.div
              className="second-accent-line"
              variants={{
                hidden: { scaleX: 0, originX: 0 },
                visible: {
                  scaleX: 1,
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            />

            {/* ── Quote ───────────────────────────────────────────── */}
            <motion.blockquote className="second-quote" variants={itemVariants}>
              Creamos herramientas capaces de optimizar y reinventar
              el trabajo tal como lo conocemos.
            </motion.blockquote>

            <motion.p className="second-author" variants={itemVariants}>
              — Apolo Web Agency
            </motion.p>

            {/* ── Keyword tags ─────────────────────────────────────── */}
            <motion.div className="second-tags" variants={itemVariants}>
              {KEYWORDS.map((kw, i) => (
                <span key={kw} className="second-tag" style={{ animationDelay: `${i * 0.18}s` }}>
                  {kw}
                </span>
              ))}
            </motion.div>

            {/* ── Metrics ──────────────────────────────────────────── */}
            <motion.div className="second-stats" variants={itemVariants}>
              <StatPill label="Proyectos" value={120} suffix="+" delay={0.05} active={showContent} />
              <StatPill label="Clientes" value={48} suffix="+" delay={0.18} active={showContent} />
              <StatPill label="Uptime" value={99} suffix="%" delay={0.31} active={showContent} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SecondSection;
