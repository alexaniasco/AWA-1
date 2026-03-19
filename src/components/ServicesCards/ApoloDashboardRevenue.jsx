import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import ExternalLink from "lucide-react/dist/esm/icons/external-link";
import UserCog from "lucide-react/dist/esm/icons/user-cog";
import LayoutGrid from "lucide-react/dist/esm/icons/layout-grid";
import GitMerge from "lucide-react/dist/esm/icons/git-merge";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import "./ServiceCards.css";

const TABS = [
  { id: "profesionales", label: "PROFESIONALES" },
  { id: "empresas", label: "EMPRESAS" },
  { id: "exclusivos", label: "EXCLUSIVOS" },
];

const SERVICES_BY_TAB = {
  profesionales: [
    {
      id: "mantener-actual",
      title: "Mantener tu stack al día",
      description:
        "Diseñamos y actualizamos tu entorno profesional para que siempre esté al nivel del mercado IT.",
      badge: "Onboarding continuo",
      icon: ExternalLink,
      accentColor: "#7c6ef5",
    },
    {
      id: "delegar-tareas",
      title: "Delegar tareas y tercerizar",
      description:
        "Enfócate en la estrategia mientras nuestro equipo se encarga de la operación y la ejecución.",
      badge: "Operaciones",
      icon: UserCog,
      accentColor: "#c471ed",
    },
    {
      id: "escala-ingresos",
      title: "Escala tus ingresos",
      description:
        "Accede a proyectos de alto valor y estructuras pensadas para impulsar tu facturación.",
      badge: "Crecimiento",
      icon: LayoutGrid,
      accentColor: "#7c6ef5",
    },
    {
      id: "alcance-global",
      title: "Sé nacional e internacional",
      description:
        "Conectamos tu talento con compañías y startups de diferentes mercados y geografías.",
      badge: "Expansión",
      icon: GitMerge,
      accentColor: "#c471ed",
    },
  ],
  empresas: [
    {
      id: "talento-on-demand",
      title: "Talento on‑demand",
      description:
        "Equipos listos para integrarse a tus squads sin fricción, con perfiles curados por seniority.",
      badge: "Staffing",
      icon: UserCog,
      accentColor: "#7c6ef5",
    },
    {
      id: "proyectos-end-to-end",
      title: "Proyectos end‑to‑end",
      description:
        "Nos ocupamos del ciclo completo: discovery, diseño, desarrollo, QA y despliegue.",
      badge: "Delivery",
      icon: LayoutGrid,
      accentColor: "#c471ed",
    },
    {
      id: "integraciones",
      title: "Integraciones y automatización",
      description:
        "Conectamos tus sistemas y automatizamos flujos para reducir errores y tiempos muertos.",
      badge: "Automatización",
      icon: GitMerge,
      accentColor: "#7c6ef5",
    },
    {
      id: "acompanamiento",
      title: "Acompañamiento estratégico",
      description:
        "Te ayudamos a priorizar roadmap, definir KPIs y tomar decisiones basadas en datos.",
      badge: "Estrategia",
      icon: ExternalLink,
      accentColor: "#c471ed",
    },
  ],
  exclusivos: [
    {
      id: "c-level",
      title: "Advisory C‑Level",
      description:
        "Acompañamiento personalizado para founders y directores que necesitan una mirada técnica senior.",
      badge: "Mentoring",
      icon: ExternalLink,
      accentColor: "#f64f59",
    },
    {
      id: "squads-dedicados",
      title: "Squads dedicados",
      description:
        "Células completas que trabajan únicamente en tus iniciativas clave, con foco en resultado.",
      badge: "Premium",
      icon: UserCog,
      accentColor: "#c471ed",
    },
    {
      id: "laboratorio",
      title: "Laboratorio de innovación",
      description:
        "Experimentamos con nuevas tecnologías para validar ideas rápido y con bajo riesgo.",
      badge: "Innovación",
      icon: LayoutGrid,
      accentColor: "#7c6ef5",
    },
    {
      id: "partnership",
      title: "Partnership a largo plazo",
      description:
        "Construimos relaciones de largo plazo donde compartimos riesgos, aprendizajes y crecimiento.",
      badge: "Alianzas",
      icon: GitMerge,
      accentColor: "#f64f59",
    },
  ],
};

/* ── Stagger variants ────────────────────────────────────────────────── */
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25 },
  },
};

const ApoloDashboardRevenue = () => {
  const [activeTab, setActiveTab] = useState("profesionales");
  const { setContactModal } = useContext(AppContext);
  const services = SERVICES_BY_TAB[activeTab] || SERVICES_BY_TAB.profesionales;

  return (
    <div
      className="min-h-screen lg:h-screen w-full text-white px-8 sm:px-4 lg:px-20"
      style={{
        background:
          "linear-gradient(135deg, #070420 0%, #0d0538 40%, #130b6e 80%, #1a0966 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Decorative background orbs ─────────────────────────────── */}
      <div className="svc-orb svc-orb--1" />
      <div className="svc-orb svc-orb--2" />
      <div className="svc-orb svc-orb--3" />

      <div
        className="mx-auto w-full min-h-screen lg:h-full flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-20"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* ── LEFT: hero text ─────────────────────────────────────────── */}
        <div
          style={{ maxWidth: 400 }}
          className="columnaservices flex-1 lg:h-full flex flex-col justify-center gap-10 md:pb-0 sm:pb-0 pt-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <img style={{ width: "100%" }} src="/LOGO.svg" alt="Apolo Logo" />
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="svc-badge"
          >
            <span className="svc-badge-dot" />
            Soluciones IT · Desde 2022
          </motion.div> */}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-3 flex md:justify-center lg:justify-start"
          >
            {/* Accent line */}
            <div>
              <p
                style={{ fontFamily: "Nunito Sans" }}
                className="md:w-[80%] md:text-left lg:w-full text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed"
              >
                Conectamos talento, tecnología y oportunidad para cubrir las
                necesidades de la industria IT. Somos el refuerzo de las
                empresas y startups, como también el respaldo de los
                profesionales.
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="btnservices"
          >
            <button
              onClick={() => setContactModal(true)}
              className="svc-cta-btn inline-flex items-center gap-6"
            >
              <span className="whitespace-normal text-left">
                Hablemos por WhatsApp o coordinemos un Meet
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
              <span className="svc-cta-shine" />
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT: tabs + cards ─────────────────────────────────────── */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex-1 lg:h-full flex flex-col justify-center py-12"
        >
          {/* Tab header */}
          <header
            className="space-y-3 flex flex-col"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <p
              style={{ fontFamily: "Nunito Sans" }}
              className="text-xs text-center tracking-widest uppercase text-slate-400"
            >
              Nuestros servicios según
            </p>

            <div
              style={{ width: "fit-content" }}
              className="svc-tabs inline-flex items-center gap-1 justify-center rounded-full p-1.5"
            >
              {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`svc-tab-btn ${isActive ? "svc-tab-btn--active" : ""}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tab-pill"
                        className="svc-tab-pill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </header>

          {/* Service cards grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 items-stretch mt-8"
            >
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.article
                    key={service.id}
                    variants={cardVariants}
                    whileHover={{ y: -5, transition: { duration: 0.22 } }}
                    className="svc-card flex flex-col justify-between h-full lg:max-h-[210px]"
                    style={{ "--accent": service.accentColor }}
                  >
                    {/* Top accent bar */}
                    <div className="svc-card-accent-bar" />

                    <div className="flex items-center justify-between gap-3 mb-4">
                      {/* Icon container with gradient glow */}
                      <div
                        className="svc-card-icon-wrap"
                        style={{
                          background: `${service.accentColor}22`,
                          boxShadow: `0 0 16px ${service.accentColor}33`,
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: service.accentColor }}
                        />
                      </div>

                      {/* Badge pill */}
                      <span
                        className="svc-card-badge"
                        style={{
                          color: service.accentColor,
                          borderColor: `${service.accentColor}40`,
                          background: `${service.accentColor}12`,
                        }}
                      >
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="svc-card-title">{service.title}</h3>
                    <p className="svc-card-desc">{service.description}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ApoloDashboardRevenue;
