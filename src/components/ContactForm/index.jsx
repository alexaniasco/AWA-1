import { useContext, useEffect, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import ContactSection from "../ContactSection/ContactSection";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const STYLE_ID = "contact-modal-keyframes";

const ContactForm = () => {
  const { setContactModal, contactModal, scrollProgress } =
    useContext(AppContext);
  const isDark = scrollProgress >= 0.9;

  const handleClose = useCallback(() => {
    setContactModal(false);
  }, [setContactModal]);

  useEffect(() => {
    if (!contactModal) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [contactModal, handleClose]);

  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes cmBorderSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes cmOrb1 {
        0%,100% { transform: translate(0,0) scale(1); }
        25%     { transform: translate(100px,-80px) scale(1.15); }
        50%     { transform: translate(-60px,60px) scale(0.9); }
        75%     { transform: translate(40px,40px) scale(1.05); }
      }
      @keyframes cmOrb2 {
        0%,100% { transform: translate(0,0) scale(1); }
        25%     { transform: translate(-80px,100px) scale(0.85); }
        50%     { transform: translate(70px,-40px) scale(1.1); }
        75%     { transform: translate(-30px,-60px) scale(0.95); }
      }
      @keyframes cmShimmer {
        0%   { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes cmNoise {
        0%   { transform: translate(0,0); }
        20%  { transform: translate(-5%,-5%); }
        40%  { transform: translate(5%,5%); }
        60%  { transform: translate(-3%,3%); }
        80%  { transform: translate(3%,-3%); }
        100% { transform: translate(0,0); }
      }
      @keyframes cmPulseGlow {
        0%,100% { opacity: 0.4; }
        50%     { opacity: 0.7; }
      }

      /* ── Force all text inside modal to be light on dark ── */
      .cm-card-surface,
      .cm-card-surface * {
        color: rgba(255,255,255,0.92) !important;
      }
      .cm-card-surface h1,
      .cm-card-surface h2,
      .cm-card-surface h3,
      .cm-card-surface h4,
      .cm-card-surface h5,
      .cm-card-surface h6 {
        color: #fff !important;
      }
      .cm-card-surface p,
      .cm-card-surface span,
      .cm-card-surface label {
        color: rgba(255,255,255,0.72) !important;
      }
      .cm-card-surface a {
        color: rgba(129,140,248,1) !important;
      }
      .cm-card-surface input,
      .cm-card-surface textarea,
      .cm-card-surface select {
        background: rgba(255,255,255,0.06) !important;
        border-color: rgba(255,255,255,0.10) !important;
        color: #fff !important;
      }
      .cm-card-surface input::placeholder,
      .cm-card-surface textarea::placeholder {
        color: rgba(255,255,255,0.30) !important;
      }
      .cm-card-surface input:focus,
      .cm-card-surface textarea:focus,
      .cm-card-surface select:focus {
        border-color: rgba(99,102,241,0.5) !important;
        box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
        outline: none !important;
      }
      .cm-card-surface button[type="submit"],
      .cm-card-surface .submit-btn {
        background: linear-gradient(135deg, rgba(99,102,241,1), rgba(168,85,247,1)) !important;
        color: #fff !important;
        border: none !important;
      }
      .cm-card-surface button[type="submit"]:hover,
      .cm-card-surface .submit-btn:hover {
        filter: brightness(1.1) !important;
      }

      /* Scrollbar styling inside modal */
      .cm-content-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .cm-content-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .cm-content-scroll::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.08);
        border-radius: 3px;
      }
      .cm-content-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.15);
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(STYLE_ID)?.remove();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {contactModal && (
        <motion.div
          key="cm-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.12 } }}
          transition={{ duration: 0.5 }}
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            perspective: "1400px",
          }}
        >
          {/* ═══════════ BACKDROP ═══════════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            {/* Base overlay — adapts to page background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                position: "absolute",
                inset: 0,
                background: isDark
                  ? "rgba(0, 0, 0, 0.88)"
                  : "rgba(0, 0, 0, 0.72)",
                backdropFilter: "blur(40px) saturate(1.3)",
                WebkitBackdropFilter: "blur(40px) saturate(1.3)",
              }}
            />

            {/* Orb 1 — indigo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.4, delay: 0.15, ease: EASE_OUT_EXPO }}
              style={{
                position: "absolute",
                top: "5%",
                left: "10%",
                width: "clamp(300px, 40vw, 600px)",
                aspectRatio: "1",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 70%)",
                filter: "blur(80px)",
                animation: "cmOrb1 22s ease-in-out infinite",
              }}
            />

            {/* Orb 2 — pink */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE_OUT_EXPO }}
              style={{
                position: "absolute",
                bottom: "5%",
                right: "8%",
                width: "clamp(250px, 35vw, 500px)",
                aspectRatio: "1",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)",
                filter: "blur(80px)",
                animation: "cmOrb2 18s ease-in-out infinite",
              }}
            />

            {/* Noise film grain */}
            <div
              style={{
                position: "absolute",
                inset: "-50%",
                width: "200%",
                height: "200%",
                opacity: 0.04,
                animation: "cmNoise 6s steps(8) infinite",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
              }}
            />
          </div>

          {/* ═══════════ MODAL CARD ═══════════ */}
          <motion.div
            key="cm-card"
            initial={{
              scale: 0.82,
              opacity: 0,
              y: 100,
              rotateX: 12,
              filter: "blur(24px)",
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 60,
              rotateX: 4,
              filter: "blur(16px)",
              transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
            }}
            transition={{
              duration: 0.8,
              ease: EASE_OUT_EXPO,
              delay: 0.08,
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "1440px",
              width: "calc(100% - 40px)",
              height: "calc(100% - 40px)",
              maxHeight: "900px",
              cursor: "default",
              transformStyle: "preserve-3d",
            }}
          >
            {/* ── Rotating gradient border ── */}
            <div
              style={{
                position: "absolute",
                inset: "-1px",
                borderRadius: "25px",
                overflow: "hidden",
                zIndex: 0,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                style={{
                  position: "absolute",
                  inset: "-50%",
                  animation: "cmBorderSpin 10s linear infinite",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(99,102,241,0.6) 15%, transparent 30%, rgba(236,72,153,0.4) 45%, transparent 60%, rgba(99,102,241,0.6) 75%, transparent 90%)",
                }}
              />
            </div>

            {/* ── Card surface — ALWAYS DARK for guaranteed contrast ── */}
            <div
              className="cm-card-surface"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "24px",
                overflow: "hidden",
                background: "linear-gradient(180deg, #0f0f13 0%, #0a0a0e 100%)",
                boxShadow: `
                  inset 0 1px 0 0 rgba(255,255,255,0.04),
                  0 24px 48px -12px rgba(0,0,0,0.45),
                  0 48px 96px -24px rgba(0,0,0,0.3)
                `,
                zIndex: 1,
              }}
            >
              {/* Top shimmer line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1, ease: EASE_OUT_EXPO }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  transformOrigin: "center",
                  background:
                    "linear-gradient(90deg, transparent 10%, rgba(99,102,241,0.5) 35%, rgba(236,72,153,0.35) 65%, transparent 90%)",
                  backgroundSize: "200% 100%",
                  animation: "cmShimmer 4s linear infinite",
                  zIndex: 15,
                }}
              />

              {/* Inner ambient glow top */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1.5 }}
                style={{
                  position: "absolute",
                  top: "-80px",
                  left: "15%",
                  right: "15%",
                  height: "320px",
                  background:
                    "radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                  zIndex: 5,
                  animation: "cmPulseGlow 6s ease-in-out infinite",
                }}
              />

              {/* Inner ambient glow bottom-right */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.9, duration: 2 }}
                style={{
                  position: "absolute",
                  bottom: "-100px",
                  right: "-50px",
                  width: "400px",
                  height: "400px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              />

              {/* ── CLOSE AREA ── */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT_EXPO }}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  zIndex: 25,
                }}
              >
                {/* ESC pill */}
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.5,
                    ease: EASE_OUT_EXPO,
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    fontSize: "10px",
                    fontFamily:
                      "'SF Mono','Fira Code','Cascadia Code',monospace",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.22) !important",
                    userSelect: "none",
                  }}
                >
                  ESC
                </motion.div>

                {/* Close button */}
                <motion.button
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    delay: 0.45,
                    duration: 0.7,
                    ease: EASE_OUT_EXPO,
                  }}
                  whileHover={{
                    scale: 1.12,
                    boxShadow:
                      "0 0 24px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.12)",
                  }}
                  whileTap={{ scale: 0.88 }}
                  onClick={handleClose}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    transition:
                      "background 0.3s, border-color 0.3s, color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget;
                    b.style.background = "rgba(99,102,241,0.15)";
                    b.style.borderColor = "rgba(99,102,241,0.4)";
                    b.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget;
                    b.style.background = "rgba(255,255,255,0.05)";
                    b.style.borderColor = "rgba(255,255,255,0.08)";
                    b.style.color = "rgba(255,255,255,0.45)";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="1" y1="1" x2="13" y2="13" />
                    <line x1="13" y1="1" x2="1" y2="13" />
                  </svg>
                </motion.button>
              </motion.div>

              {/* ── CONTENT ── */}
              <motion.div
                className="cm-content-scroll"
                initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  y: 20,
                  filter: "blur(4px)",
                  transition: { duration: 0.2 },
                }}
                transition={{
                  delay: 0.28,
                  duration: 0.7,
                  ease: EASE_OUT_EXPO,
                }}
                style={{ width: "100%", height: "100%", overflow: "auto" }}
              >
                <ContactSection />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;
