// src/components/ServiceCards/index.jsx
import { AnimatePresence, motion } from "framer-motion";
import "./ServiceCards.css";
import { useContext, useEffect, useState } from "react";
import { ServicesContext } from "./hooks/ServicesContext.js";
import { ServiceSection } from "./ServiceSection.tsx";

const ServiceCards = () => {

  const {
    expandedCard,
    showContainer,
    setLeftColumnZIndex,
    setShowLeftColumnBackground
  } = useContext(ServicesContext);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (expandedCard) {
      setTimeout(() => {
        setShowLeftColumnBackground(true);
        setLeftColumnZIndex(1);
      }, 800);
    } else if (showContainer) {
      const timer = setTimeout(() => {
        setShowLeftColumnBackground(false);
        setLeftColumnZIndex(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, expandedCard, showContainer]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="overlay"
        >
    <ServiceSection />
    </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceCards;
