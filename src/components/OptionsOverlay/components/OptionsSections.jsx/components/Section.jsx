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
    allFeatures.find((f) => f.id === "A7") || allFeatures[0]
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
  );

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      className={`motion-section ${position}`}
    >
      <div className="section-bg">
        <img src={data.background} alt="" />
      </div>

      <div className="section-content">
        <img
          onClick={handleBack}
          className="back-arrow"
          src="/BackArrowWhite.svg"
          alt="Volver"
        />
        <div className="section-inner">
          <header className="section-header">
            <img
              style={{
                position: "absolute",
                top: 60,
                left: -30,
                width: "150px",
                height: "150px",
              }}
              src="/pointer.svg"
              alt="Logo"
              className="pointer"
            />
            <h1 style={{ fontFamily: "Bai Jamjuree" }}>
              {data.ui?.title || ""}
            </h1>
            <p>{data.ui?.subtitle || ""}</p>
          </header>

          <div className="section-layout">
            <FeaturesList
              features={allFeatures}
              onSelect={handleButtonClick}
              activeId={activeFeature.id}
            />

            <div className="hero-container">
              <AnimatePresence mode="wait">
                <HeroFeatureCard
                  key={activeFeature.id}
                  title={activeFeature.hero.title}
                  description={activeFeature.hero.description}
                  image={activeFeature.hero.image}
                  isTransitioning={isTransitioning}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
