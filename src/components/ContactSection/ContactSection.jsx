import { useContext } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import "./ContactSection.css";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const CARDS = [
  {
    href: "https://wa.me/5491127702512?text=Hola!%20Estoy%20interesado%20en%20los%20servicios%20de%20Apolo%20Web%20Agency",
    target: "_blank",
    className: "whatsapp-card",
    icon: "/wppvectorr.svg",
    alt: "WhatsApp",
    title: "WhatsApp",
    description:
      "Ideal para consultas rápidas, mantener un diálogo fluido o resolver temas puntuales.",
    delay: 0.05,
  },
  {
    href: "mailto:apolowebagency@gmail.com?subject=Consulta%20desde%20web%20Apolo%20Agency&body=Hola!%20Me%20gustaría%20consultar%20sobre...",
    target: undefined,
    className: "email-card",
    icon: "/correovector.svg",
    alt: "Correo",
    title: "Correo",
    description:
      "Perfecto si querés compartir información detallada o enviar documentación importante.",
    delay: 0.18,
  },
  {
    href: "https://calendly.com/apolo-agency/30min",
    target: "_blank",
    className: "meet-card",
    icon: "/meetvectorr.svg",
    alt: "Google Meet",
    title: "Google Meet",
    description:
      "Reservá un espacio en videollamada para avanzar en tu proceso rápidamente.",
    delay: 0.31,
  },
];

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ContactSection = () => {
  const { scrollProgress } = useContext(AppContext);
  const isInLastSection = scrollProgress >= 0.65;

  const badgeColor = isInLastSection ? "rgba(255,255,255,0.7)" : undefined;
  const titleColor = isInLastSection ? "#FFFFFF" : undefined;
  const subtitleColor = isInLastSection ? "rgba(255,255,255,0.75)" : undefined;
  const footerColor = isInLastSection ? "rgba(255,255,255,0.55)" : undefined;

  return (
    <div className="contact-section">
      {/* ── Ambient glows ─────────────────────────────── */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />
      <div className="ambient-glow ambient-glow-3" />

      {/* ── Subtle dot grid overlay ────────────────────── */}
      <div className="grid-overlay" />

      {/* ── Floating orbs ─────────────────────────────── */}
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className={`floating-orb orb-${i + 1}`} />
      ))}

      {/* ── Main content ──────────────────────────────── */}
      <motion.div
        className="contact-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="contact-header" variants={itemVariants}>
          {/* Badge */}
          <div className="badge-container">
            <div className="premium-badge" style={{ color: badgeColor }}>
              <span className="badge-dot" />
              Conectemos · Apolo Web Agency
            </div>
          </div>

          {/* Title */}
          <h1 className="contact-main-title" style={{ color: titleColor }}>
            <span className="title-line">Las excusas de hoy son</span>
            <span className="title-line title-highlight">
              el futuro de mañana
            </span>
          </h1>

          {/* Subtitle */}
          <p className="contact-subtitle" style={{ color: subtitleColor }}>
            Pisa fuerte en él como profesional, negocio o empresa
          </p>

          {/* Divider */}
          <div
            className="title-divider"
            style={{
              background: isInLastSection
                ? "linear-gradient(90deg, rgba(255,255,255,0.4), transparent)"
                : "linear-gradient(90deg, #128c7e, #1e3a8a, transparent)",
            }}
          />
        </motion.div>

        {/* Cards */}
        <div className="contact-cards-container">
          {CARDS.map((card) => (
            <motion.a
              key={card.title}
              href={card.href}
              target={card.target}
              rel={card.target ? "noopener noreferrer" : undefined}
              className="contact-card-link card-visible"
              variants={cardVariants}
              whileHover={{ y: -12, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              whileTap={{ scale: 0.98, y: -6, transition: { duration: 0.12 } }}
            >
              <div className={`contact-card ${card.className}`}>
                {/* Inner glow */}
                <div className="card-glow" />
                {/* Shimmer on hover */}
                <div className="card-shimmer" />
                {/* Noise texture */}
                <div className="card-noise" />

                {/* Arrow */}
                <div className="card-arrow">
                  <ArrowIcon />
                </div>

                {/* Content */}
                <div className="card-inner">
                  <div className="contact-icon-container">
                    <div className="icon-ring">
                      <img
                        src={card.icon}
                        alt={card.alt}
                        className="contact-icon"
                      />
                    </div>
                    <div className="card-title-wrapper">
                      <h3 className="contact-card-title">{card.title}</h3>
                      <div className="title-underline" />
                    </div>
                  </div>
                  <p className="contact-card-description">{card.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.footer
          className="contact-footer"
          variants={itemVariants}
          style={{ color: footerColor }}
        >
          <div className="footer-line" />
          <span className="footer-text">Apolo Web Agency</span>
          <div className="footer-line" />
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default ContactSection;
