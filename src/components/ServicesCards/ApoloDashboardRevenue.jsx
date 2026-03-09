import { useState } from "react";
import { motion } from "framer-motion";
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
    },
    {
      id: "delegar-tareas",
      title: "Delegar tareas y tercerizar",
      description:
        "Enfócate en la estrategia mientras nuestro equipo se encarga de la operación y la ejecución.",
      badge: "Operaciones",
      icon: UserCog,
    },
    {
      id: "escala-ingresos",
      title: "Escala tus ingresos",
      description:
        "Accede a proyectos de alto valor y estructuras pensadas para impulsar tu facturación.",
      badge: "Crecimiento",
      icon: LayoutGrid,
    },
    {
      id: "alcance-global",
      title: "Sé nacional e internacional",
      description:
        "Conectamos tu talento con compañías y startups de diferentes mercados y geografías.",
      badge: "Expansión",
      icon: GitMerge,
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
    },
    {
      id: "proyectos-end-to-end",
      title: "Proyectos end‑to‑end",
      description:
        "Nos ocupamos del ciclo completo: discovery, diseño, desarrollo, QA y despliegue.",
      badge: "Delivery",
      icon: LayoutGrid,
    },
    {
      id: "integraciones",
      title: "Integraciones y automatización",
      description:
        "Conectamos tus sistemas y automatizamos flujos para reducir errores y tiempos muertos.",
      badge: "Automatización",
      icon: GitMerge,
    },
    {
      id: "acompanamiento",
      title: "Acompañamiento estratégico",
      description:
        "Te ayudamos a priorizar roadmap, definir KPIs y tomar decisiones basadas en datos.",
      badge: "Estrategia",
      icon: ExternalLink,
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
    },
    {
      id: "squads-dedicados",
      title: "Squads dedicados",
      description:
        "Células completas que trabajan únicamente en tus iniciativas clave, con foco en resultado.",
      badge: "Premium",
      icon: UserCog,
    },
    {
      id: "laboratorio",
      title: "Laboratorio de innovación",
      description:
        "Experimentamos con nuevas tecnologías para validar ideas rápido y con bajo riesgo.",
      badge: "Innovación",
      icon: LayoutGrid,
    },
    {
      id: "partnership",
      title: "Partnership a largo plazo",
      description:
        "Construimos relaciones de largo plazo donde compartimos riesgos, aprendizajes y crecimiento.",
      badge: "Alianzas",
      icon: GitMerge,
    },
  ],
};

const ApoloDashboardRevenue = () => {
  const [activeTab, setActiveTab] = useState("profesionales");
  const { setContactModal } = useContext(AppContext);
  const services = SERVICES_BY_TAB[activeTab] || SERVICES_BY_TAB.profesionales;

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#091583]/20 text-white px-8 sm:px-4 lg:px-20  ">
      <div className=" mx-auto w-full min-h-screen lg:h-full flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-20">
        {/* Left section: hero text */}
        <div
          style={{ maxWidth: 400 }}
          className=" columnaservices flex-1 lg:h-full flex flex-col justify-center gap-12  md:pb-0 sm:pb-0 pt-12"
        >
          <div className=" space-y-6">
            <div className="space-y-3">
              <img style={{ width: "100%" }} src="/LOGO.svg"></img>
            </div>
          </div>
          <div className="space-y-3 flex md:justify-center lg:justify-start">
            <p
              style={{ fontFamily: "Nunito Sans" }}
              className="space-y-3 md:w-[80%] md:text-center lg:w-full text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed md:text-left"
            >
              Conectamos talento, tecnología y oportunidad para cubrir las
              necesidades de la industria IT. Somos el refuerzo de las empresas
              y startups, como también el respaldo de los profesionales.
            </p>
          </div>
          <div className="btnservices">
            <button
              onClick={() => setContactModal(true)}
              style={{
                border: "1px solid white !important",
                outline: "1px solid white !important",
                boxShadow: "0 0 0 1px white",
              }}
              className="inline-flex items-center gap-6 rounded-1xl bg-[#5749F4] px-6 py-3 text-sm sm:text-base font-medium shadow-md hover:bg-[#6b5dfb] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5749F4] focus-visible:ring-offset-[#131124]"
            >
              <span className="whitespace-normal text-left">
                Hablemos por WhatsApp o coordinemos un Meet
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* Right section: tabs + cards */}
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="flex-1 lg:h-full flex flex-col justify-center py-12"
        >
          <header
            className="space-y-3 flex flex-col"
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p
              style={{ fontFamily: "Nunito Sans" }}
              className="text-sm text-center sm:text-base text-slate-200"
            >
              Nuestros servicios según
            </p>

            <div
              style={{ width: "fit-content" }}
              className="inline-flex items-center gap-1 justify-center rounded-full bg-white/5 border border-slate-700/70 text-xs sm:text-sm p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm"
            >
              {TABS.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full uppercase tracking-[0.16em] transition-colors border text-[10px] sm:text-xs md:text-sm ${
                      isActive
                        ? "bg-white/10 text-white border-slate-500/60"
                        : "text-slate-300 border-slate-700/60 bg-transparent hover:bg-white/5 hover:text-slate-200 hover:border-slate-600/70"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </header>

          <div className="flex-0.5 grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 items-stretch mt-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-700/70 bg-white/5 px-5 py-5 sm:px-6 sm:py-6 backdrop-blur-sm shadow-[0_18px_45px_rgba(0,0,0,0.4)] h-full lg:max-h-[200px]"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="rounded-full bg-[#5749F4]/20 p-3">
                      <Icon className="w-5 h-5 text-indigo-200" />
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-slate-300">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApoloDashboardRevenue;
