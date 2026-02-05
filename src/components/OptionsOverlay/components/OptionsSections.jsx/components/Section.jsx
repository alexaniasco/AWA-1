import { useState } from "react";
import { motion } from "motion/react";
import FeaturesList from "../../../../Hexagon/FeaturesList";
import HeroFeatureCard from "../../../../Hexagon/HeroFeatureCard";
import { SectionData } from "../data/data";
import "./Section.css";

export default function Section({ handleBack, position = "right", section }) {
  const data = SectionData[section];
  const allFeatures = data.features || [];

  const initialActive =
    allFeatures.find(f => f.id === "A7") ||
    allFeatures[allFeatures.length - 1];

  const initialList = allFeatures.filter(f => f.id !== initialActive.id);

  const [activeFeature, setActiveFeature] = useState(initialActive);
  const [listFeatures, setListFeatures] = useState(initialList);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleButtonClick = (clickedId) => {
    if (isTransitioning) return;

    const clickedIndex = listFeatures.findIndex(f => f.id === clickedId);
    if (clickedIndex === -1) return;

    setIsTransitioning(true);

    const clickedFeature = listFeatures[clickedIndex];

    // ⏬ salida visual
    setTimeout(() => {
      const newList = [...listFeatures];
      newList[clickedIndex] = activeFeature;

      setActiveFeature(clickedFeature);
      setListFeatures(newList);
    }, 300);

    // ⏫ reactivamos tilt + idle
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`motion-section ${position}`}
    >
      <div className="section-content">
        <div className="section-inner">
          <img
            onClick={handleBack}
            className="back-arrow"
            src="/BackArrowWhite.svg"
            alt="Volver"
          />

          <header className="section-header"> 
            <img style={{position: "absolute", top: 60, left: -30, width: "150px", height: "150px"}} src="/pointer.svg" alt="Logo" className="pointer" />
            <h1 style={{fontFamily:"Bai Jamjuree"}}>{data.ui?.title || ""}</h1>
            <p>{data.ui?.subtitle || ""}</p>
          </header>

          <div className="section-layout">
            <FeaturesList
              features={listFeatures}
              onSelect={handleButtonClick}
              activeId={activeFeature.id}
            />

            {activeFeature?.hero && (
              <HeroFeatureCard
                key={activeFeature.id} // OBLIGATORIO
                title={activeFeature.hero.title}
                description={activeFeature.hero.description}
                image={activeFeature.hero.image}
                isTransitioning={isTransitioning}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
