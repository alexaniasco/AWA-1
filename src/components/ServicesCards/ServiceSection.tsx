import React, { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  UserCog,
  LayoutGrid,
  GitMerge,
  Headphones,
  ArrowRight,
  User,
  Building2,
  Diamond,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon } from "../Hexagon";
import { ServiceItem } from "../../../types";
import { ArrowUp } from "lucide-react";

// Data Definition - Puedes personalizar estos servicios
const SERVICES: ServiceItem[] = [
  {
    id: "tercerizacion",
    title: "Tercerizacion",
    description:
      "Refuerzo estratégico para escalar sin fricción de forma inteligente.",
    icon: ExternalLink,
  },
  {
    id: "consultoria",
    title: "Consultoría",
    description: "Expertos a tu disposición para optimizar procesos.",
    icon: UserCog,
  },
  {
    id: "desarrollo",
    title: "Desarrollo",
    description: "Soluciones de software a medida.",
    icon: LayoutGrid,
  },
  {
    id: "integracion",
    title: "Integración",
    description: "Conectamos tus sistemas eficientemente.",
    icon: GitMerge,
  },
];

export const ServiceSection = () => {
  const [activeServiceId, setActiveServiceId] = useState<string>(
    SERVICES[0].id
  );
  const [currentSection, setCurrentSection] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);

  const activeService =
    SERVICES.find((s) => s.id === activeServiceId) || SERVICES[0];
  const otherServices = SERVICES.filter((s) => s.id !== activeServiceId);

  // Manejo del scroll interno
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      // Siempre prevenir que el scroll llegue al handler principal
      event.stopPropagation();
      
      if (isScrollingRef.current) {
        event.preventDefault();
        return;
      }

      const scrollTop = container.scrollTop;
      const viewportHeight = window.innerHeight;
      const scrollThreshold = 50; // Umbral para detectar cambio de sección
      
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      // Determinar la sección actual basada en el scroll
      const atTop = scrollTop <= scrollThreshold;
      const atBottom = scrollTop >= viewportHeight - scrollThreshold;

      // Solo interceptar cuando estamos en los bordes y queremos cambiar de sección
      if (isScrollingDown && atTop) {
        // Ir a la segunda sección desde el inicio
        isScrollingRef.current = true;
        setCurrentSection(1);
        container.scrollTo({
          top: viewportHeight,
          behavior: "smooth",
        });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 2000);
        event.preventDefault();
      } else if (isScrollingUp && atBottom) {
        // Volver a la primera sección desde el final
        isScrollingRef.current = true;
        setCurrentSection(0);
        container.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 2000);
        event.preventDefault();
      } else {
        // Permitir scroll nativo del contenedor pero prevenir propagación
        // Simular el scroll manualmente para mantener el control
        const delta = event.deltaY;
        container.scrollTop += delta;
        event.preventDefault();
      }
    };

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const viewportHeight = window.innerHeight;
      
      // Determinar en qué sección estamos basado en el scroll
      if (scrollTop < viewportHeight / 2) {
        setCurrentSection(0);
      } else {
        setCurrentSection(1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [currentSection]);

  return (
    // Main Background: Smooth gradient from image - #0D0432 to #260B98
    <div 
      ref={scrollContainerRef}
      className="h-screen overflow-y-auto overflow-x-hidden w-full bg-[radial-gradient(circle_at_center,_#260B98_100%,_#0D0432_100%)] text-white font-sans selection:bg-pink-500 selection:text-white snap-y snap-mandatory"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Background Decor Elements */}
      <div className="absolute top-0 right-0 w-1/3 pointer-events-none overflow-hidden z-0" style={{ height: '200vh' }}>
        <Diamond
          size={50}
          className="absolute top-[8%] right-[30%] text-pink-500/30 blur-[1px] rotate-12"
        />
        <UserCog
          size={64}
          className="absolute top-[20%] right-[10%] text-purple-500/30 blur-[1px] -rotate-12"
        />
        <LayoutGrid
          size={50}
          className="absolute top-[40%] right-[22%] text-indigo-500/20 blur-[2px] rotate-45"
        />
        <GitMerge
          size={55}
          className="absolute top-[55%] right-[5%] text-blue-500/20 blur-[2px]"
        />
        <ExternalLink
          size={60}
          className="absolute top-[32%] right-[-2%] text-purple-500/20 blur-[2px] rotate-12"
        />
      </div>

      {/* Primera Sección */}
      <div className="min-h-screen snap-start flex items-center">
        <div className="container mx-auto px-6 md:px-12 h-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0">
        {/* === LEFT COLUMN === */}
        <div className="w-full lg:w-[35%] flex flex-col z-10 lg:pr-8 gap-8">
          {/* Brand Title */}
          <div className="w-full flex">
            <img
              src="/lgo.png"
              alt="logo"
              className="w-full object-contain max-w-full"
              style={{ imageRendering: "auto" }}
            />
          </div>

          {/* Description Text */}
          <div className="space-y-5  text-gray-200 text-[17px] leading-relaxed font-normal  ">
            <p>
              <strong className="font-bold text-white">
                Conectamos talento, tecnología y oportunidad
              </strong>{" "}
              para cubrir las necesidades de la industria IT. Somos el{" "}
              <strong className="font-bold text-white">refuerzo</strong> de las
              empresas y startups, como tambien el{" "}
              <strong className="font-bold text-white">respaldo</strong> de los
              profecionales.
            </p>
          </div>

          {/* CTA Button */}
          <div className="w-full relative group cursor-pointer mt-2">
            <div className="absolute inset-0 bg-white/40 rounded-xl  opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative border border-white/80 rounded-xl px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-[16px] font-medium text-gray-100">
                  Hablemos por whatsApp o
                </span>
                <span className="text-[16px] font-medium text-gray-100">
                  coordinemos un Meet.
                </span>
              </div>
              <Headphones className="text-white w-8 h-8 opacity-90 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* === DIVIDER LINE === - Fixed position between columns */}
        <img
          src="/divider.png"
          alt="divider"
          className="hidden lg:block fixed w-[30px] h-screen z-30 object-contain pointer-events-none"
          style={{
            left: 'calc((100vw - 1280px) / 2 + 33% + 2rem)', // Posicionado entre las columnas (35% + padding)
            top: 0,
          }}
        ></img>
     

        {/* === RIGHT COLUMN === */}
        <div className="w-full lg:w-[55%] flex flex-col items-start relative z-10 pt-8 lg:pt-0 pl-20 ">
          {/* Header & Filters */}
          <div className="w-full mb-12">
            <h3 className="text-[2.7rem] font-light italic text-white mb-3 tracking-wide drop-shadow-lg">
              Nuestros servicios segun
            </h3>

            <div className="flex flex-wrap gap-3">
              {/* Filter Pills */}
              <button className="flex items-center gap-2 px-5 py-1 rounded-lg border border-white/60 text-[16px] font-normal tracking-wider hover:bg-white/40 uppercase transition-all bg-white/20">
                <User size={16} strokeWidth={1.5} /> PROFECIONALES
              </button>

              <button className="flex items-center gap-2 px-5 py-1 rounded-lg border border-white/60 text-[16px] font-normal tracking-wider hover:bg-white/40 uppercase transition-all bg-white/20">
                <Building2 size={16} strokeWidth={1.5} /> EMPRESAS
              </button>

              <button className="flex items-center gap-2 px-5 py-1 rounded-lg bg-white/20 border border-white text-[16px] font-normal tracking-wider hover:bg-white/40 uppercase transition-all shadow-lg backdrop-blur-sm">
                <Diamond size={16} strokeWidth={1.5} /> EXCLUSIVOS
              </button>
            </div>
          </div>

          {/* HEXAGON INTERACTION AREA */}
          <div className="w-full relative flex flex-col items-start">
            {/* Top Section: Big Hexagon + Text */}
            <div className="flex flex-row gap-10 mb-6 w-full items-start">
              <div className="relative shrink-0 flex flex-col gap-6 items-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeService.id}
                    layoutId={`container-${activeService.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Hexagon
                      size="lg"
                      isActive={true}
                      layoutId={`hex-${activeService.id}`}
                    >
                      <activeService.icon
                        strokeWidth={1.2}
                        size={110}
                        className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </Hexagon>
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-3 items-end">
                  {otherServices.map((service, index) => (
                    <div
                      key={service.id}
                      onClick={() => setActiveServiceId(service.id)}
                      className="cursor-pointer"
                      style={{ marginBottom: index === 1 ? "10px" : "0" }}
                    >
                      <Hexagon size="sm" layoutId={`hex-${service.id}`}>
                        <service.icon
                          strokeWidth={1.5}
                          size={36}
                          className="text-white opacity-90"
                        />
                      </Hexagon>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                key={`text-${activeService.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col text-left mt-8"
              >
                <h4 className="text-[2.75rem] font-bold mb-4 text-white leading-tight drop-shadow-lg">
                  {activeService.title}
                </h4>
                <p className="text-[1.15rem] font-light italic text-gray-200 leading-relaxed max-w-[340px]">
                  {activeService.description}
                </p>
              </motion.div>
            </div>

            {/* Bottom Section: Small Hexagons + Link */}
            <div className="flex flex-row items-center w-full gap-10">
              <div className="flex-grow flex justify-end pr-2">
                <button className="flex items-center gap-2 text-lg font-light italic text-gray-100 hover:text-white transition-colors group">
                  Ver beneficios
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Segunda Sección */}
      <div className="min-h-screen snap-start flex items-center">
        <div className="container h-full flex items-center justify-center  p-0 md:p-8">
        <div className="relative w-full  h-[600px] flex flex-col md:flex-row  overflow-hidden rounded-lg">
          {/* Left Panel: Typography */}
          <div className="relative z-20 w-full md:w-[45%]  flex flex-col justify-center px-8 md:px-16 py-12 ">
            {/* Top Gradient Overlay for subtle lighting */}

            <div className="relative z-10 flex flex-col h-full justify-center space-y-8">
              {/* Quote Block */}
              <div className="relative">
                {/* Opening Quote Mark */}
                <span className="absolute -top-4 -left-6 text-5xl md:text-6xl font-black text-metallic opacity-80 leading-none">
                  ”
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide leading-[1.1] text-metallic">
                  Las excusas
                  <br />
                  de hoy son el
                  <br />
                  futuro de
                  <br />
                  mañana.{" "}
                  <span className="inline-block align-top text-4xl">”</span>
                </h1>
              </div>

              {/* Secondary Text */}
              <p className="text-lg md:text-xl text-gray-300 font-light italic tracking-wider mt-4">
                No llegues tarde.
              </p>

              {/* Attribution */}
              <div className="mt-auto pt-8">
                <p className="text-gray-400 text-sm md:text-base font-light tracking-wide">
                  — Apolo Web Agency
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Rocket Illustration */}
          <div className="relative w-full md:w-[55%]  flex items-center justify-center overflow-hidden">
            {/* Dot Grid Background Pattern */}
       

            {/* The Rocket Graphic - Animated from left to right behind divider */}
            <motion.div
              className="relative w-[120%] h-auto scale-100 md:scale-100"
              style={{ zIndex: 5 }}
              initial={{ x: "-150%", opacity: 0 }}
              animate={{
                x: currentSection === 1 ? "0%" : "-150%",
                opacity: currentSection === 1 ? 1 : 0,
              }}
              transition={{
                duration: 2.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <img src="/rocket.svg" alt="rocket" className="w-full h-full object-contain" />
              {/* <RocketIcon /> */}
            </motion.div>

            {/* Bottom Right Arrow Button */}
            <div className="absolute bottom-8 right-8">
              <button className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95 cursor-pointer group">
                <ArrowUp className="text-black w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
