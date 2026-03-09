import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturesList from "../../../../Hexagon/FeaturesList";
import HeroFeatureCard from "../../../../Hexagon/HeroFeatureCard";
import { SectionData } from "../data/data";
import "./Section.css";

export default function Section({ handleBack, position = "right", section }) {
  const data = SectionData[section];
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

  // Calcular índice activo
  const activeIndex = allFeatures.findIndex((f) => f.id === activeFeature.id);

  // Detectar cambios de tamaño de pantalla
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
    const clickedFeature = allFeatures[index];
    if (!clickedFeature) return;

    setIsTransitioning(true);
    setActiveFeature(clickedFeature);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleButtonClick = (clickedId) => {
    if (isTransitioning) return;
    const clickedFeature = allFeatures.find((f) => f.id === clickedId);
    if (!clickedFeature || clickedFeature.id === activeFeature.id) return;

    setIsTransitioning(true);
    setActiveFeature(clickedFeature);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <motion.div
      initial={isMobile ? {} : { opacity: 0 }}
      animate={isMobile ? {} : { opacity: 1 }}
      transition={isMobile ? { duration: 0 } : { duration: 0.3 }}
      className={`motion-section ${!isMobile ? position : ""}`}
    >
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
        <div className="back-button-container" onClick={handleBack}>
          <svg
            className="back-arrow-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="section-inner">
          <div className="section-layout">
            <FeaturesList
              title={data.ui?.title || ""}
              subtitle={data.ui?.subtitle || ""}
              features={allFeatures}
              onSelect={handleButtonClick}
              activeId={activeFeature.id}
            />

            <div
              className="hero-container"
              style={{
                paddingTop: isTablet ? "8rem" : undefined,
              }}
            >
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
        </div>
      </div>
    </motion.div>
  );
}
