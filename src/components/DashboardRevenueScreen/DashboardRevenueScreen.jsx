import React, { useState } from "react";
import {
  Headphones,
  User,
  Users,
  TrendingUp,
  Globe,
  Building2,
  Diamond,
  ArrowRight,
  Briefcase,
  Lightbulb,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import "./DashboardRevenueScreen.css";

const PROFESIONALES_SERVICES = [
  {
    id: "score",
    title: "Mantener tu score al día",
    description:
      "Gestiona y actualiza tu perfil profesional para destacar en el mercado IT.",
    icon: User,
    gradient: "gradient-magenta",
  },
  {
    id: "delegar",
    title: "Delegar tareas y tercerizar",
    description:
      "Encuentra profesionales para delegar proyectos y escalar tu capacidad.",
    icon: Users,
    gradient: "gradient-purple",
  },
  {
    id: "ingresos",
    title: "Escala tus ingresos",
    description:
      "Accede a oportunidades de alto valor que impulsen tu crecimiento.",
    icon: TrendingUp,
    gradient: "gradient-blue",
  },
  {
    id: "nacional",
    title: "Sé nacional e internacional",
    description:
      "Conecta con clientes y proyectos a nivel nacional e internacional.",
    icon: Globe,
    gradient: "gradient-green",
  },
];

const EMPRESAS_SERVICES = [
  {
    id: "terc",
    title: "Tercerización Inteligente",
    description:
      "Refuerzo estratégico para escalar sin fricción de forma inteligente.",
    icon: Building2,
    gradient: "gradient-blue",
  },
  {
    id: "consultoria",
    title: "Consultoría Especializada",
    description:
      "Expertos a tu disposición para optimizar procesos y equipos.",
    icon: Lightbulb,
    gradient: "gradient-purple",
  },
  {
    id: "reclutamiento",
    title: "Reclutamiento IT",
    description:
      "Encuentra el talento ideal para tu equipo con nuestro proceso optimizado.",
    icon: Briefcase,
    gradient: "gradient-magenta",
  },
  {
    id: "auditoria",
    title: "Auditoría Técnica",
    description:
      "Evaluación profunda de tu stack tecnológico y recomendaciones.",
    icon: ShieldCheck,
    gradient: "gradient-green",
  },
];

const EXCLUSIVOS_SERVICES = [
  {
    id: "vip",
    title: "Acceso VIP",
    description:
      "Prioridad en proyectos premium y acceso anticipado a oportunidades.",
    icon: Diamond,
    gradient: "gradient-red",
  },
  {
    id: "mentoria",
    title: "Mentoría 1 a 1",
    description:
      "Sesiones personalizadas con expertos de la industria tecnológica.",
    icon: Users,
    gradient: "gradient-purple",
  },
  {
    id: "networking",
    title: "Networking Premium",
    description:
      "Eventos exclusivos y conexiones con líderes del sector IT.",
    icon: Globe,
    gradient: "gradient-teal",
  },
  {
    id: "acelerar",
    title: "Programa Acelerador",
    description:
      "Impulsa tu carrera o startup con recursos y guía especializada.",
    icon: Rocket,
    gradient: "gradient-blue",
  },
];

const TABS = [
  { id: "profesionales", label: "Profesionales" },
  { id: "empresas", label: "Empresas" },
  { id: "exclusivos", label: "Exclusivos" },
];

const DashboardRevenueScreen = () => {
  const [activeTab, setActiveTab] = useState("profesionales");

  const services =
    activeTab === "profesionales"
      ? PROFESIONALES_SERVICES
      : activeTab === "empresas"
      ? EMPRESAS_SERVICES
      : EXCLUSIVOS_SERVICES;

  const activeTabIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <section className="dash-revenue">
      {/* Background Effects */}
      <div className="dash-revenue__bg-effects">
        <div className="dash-revenue__orb dash-revenue__orb--1" />
        <div className="dash-revenue__orb dash-revenue__orb--2" />
        <div className="dash-revenue__orb dash-revenue__orb--3" />
        <div className="dash-revenue__noise" />
      </div>

      <div className="dash-revenue__container">
        <div className="dash-revenue__inner">
          {/* LEFT PANEL */}
          <div className="dash-revenue__left">
            <div className="dash-revenue__left-content">
              <div className="dash-revenue__title-group">
                <h1 className="dash-revenue__title">
                  <span className="dash-revenue__title-line">APOLO</span>
                  <span className="dash-revenue__title-accent">Web Agency</span>
                </h1>

                <p className="dash-revenue__desc">
                  Conectamos talento, tecnología y oportunidad para cubrir las
                  necesidades de la industria IT. Somos el refuerzo de las empresas y
                  startups, como también el respaldo de los profesionales.
                </p>

                <button type="button" className="dash-revenue__cta">
                  <div className="dash-revenue__cta-content">
                    <Headphones
                      className="dash-revenue__cta-icon"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div className="dash-revenue__cta-text">
                      <span className="dash-revenue__cta-main">Hablemos ahora</span>
                      <span className="dash-revenue__cta-sub">WhatsApp o Meet</span>
                    </div>
                  </div>
                  <ArrowRight
                    className="dash-revenue__cta-arrow"
                    strokeWidth={2}
                  />
                </button>
              </div>

              <div className="dash-revenue__stats">
                <div className="dash-revenue__stat">
                  <span className="dash-revenue__stat-value">150+</span>
                  <span className="dash-revenue__stat-label">Proyectos</span>
                </div>
                <div className="dash-revenue__stat-divider" />
                <div className="dash-revenue__stat">
                  <span className="dash-revenue__stat-value">98%</span>
                  <span className="dash-revenue__stat-label">Satisfacción</span>
                </div>
                <div className="dash-revenue__stat-divider" />
                <div className="dash-revenue__stat">
                  <span className="dash-revenue__stat-value">24/7</span>
                  <span className="dash-revenue__stat-label">Soporte</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="dash-revenue__right">
            <div className="dash-revenue__right-content">
              <div className="dash-revenue__header">
                <h2 className="dash-revenue__section-title">
                  Nuestros servicios <span>para</span>
                </h2>

                <div className="dash-revenue__tabs" role="tablist">
                  <div className="dash-revenue__tabs-track">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`dash-revenue__tab ${
                          activeTab === tab.id ? "dash-revenue__tab--active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="dash-revenue__tab-text">{tab.label}</span>
                      </button>
                    ))}
                    <div
                      className="dash-revenue__tab-indicator"
                      style={{
                        transform: `translateX(${activeTabIndex * 100}%)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="dash-revenue__grid">
                {services.map((s, index) => (
                  <article
                    key={s.id}
                    className={`dash-revenue__card ${s.gradient}`}
                    style={{ "--card-index": index }}
                  >
                    <div className="dash-revenue__card-glow" />
                    <div className="dash-revenue__card-content">
                      <div className="dash-revenue__card-header">
                        <div className="dash-revenue__card-icon">
                          <s.icon strokeWidth={1.5} />
                        </div>
                        <h3 className="dash-revenue__card-title">{s.title}</h3>
                      </div>
                      <p className="dash-revenue__card-desc">{s.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardRevenueScreen;