// src/components/ServiceCards/renderCarousel.js
import { motion, AnimatePresence } from "framer-motion";
import { Cards } from "./Card";
import "../ServiceCards.css"
import { useEffect, useState } from "react";
import { useContext } from "react";
import { ServicesContext } from "../hooks/ServicesContext";

export const RenderCarousel = ({expandedCard}) => {
  const {
    setPreviousIndex,
    DataServices,
    direction,
    setDirection,handleCategoryChange,selectedCard
  } = useContext(ServicesContext)


  const { section, index: initialIndex } = expandedCard;
const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const cards = DataServices[section].map((card, index) => ({
    id: index,
    content: (
      <Cards
        key={`carousel-${section}-${index}`}
        position={index}
        title={card.title}
        description={card.description}
        image={card.image}
        background={card.background}
        isExpanded={true}
      />
    ),
  }));

useEffect(()=> {
console.log(currentIndex,"ESTO LLEGA")
},[])

  const handleCardChange = (newIndex) => {
    if (newIndex === currentIndex) return;
  
    let newDirection;
  
    if (newIndex > currentIndex) {
      newDirection = currentIndex === 3 ? -1 : 1; 
    } else {
      newDirection = currentIndex === 0 ? 1 : -1;
    }
  
    setDirection(newDirection);
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
  };

  const nextCard = () => {
    if (currentIndex < 3) {
      handleCardChange(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      handleCardChange(currentIndex - 1);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="carousel-container"
    >
      {/* Navegación de categorías */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="category-nav"
      >
        {["EMPRESAS", "EXCLUSIVOS", "PROFESIONALES"].map((category) => (
          <motion.div
            key={`category-${category}`}
            onClick={() => handleCategoryChange(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`category-button ${section === category ? 'active' : ''}`}
          >
            {category}
          </motion.div>
        ))}
      </motion.div>

      <div className="carousel-wrapper">
        {currentIndex > 0 && (
          <motion.button onClick={prevCard} className="carousel-button prev">
            &lt;
          </motion.button>
        )}

        <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
            key={`${section}-${currentIndex}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 500 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{}}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              velocity: direction * 2
            }}
            className="carousel-card"
          >
            {cards[currentIndex].content}
          </motion.div>
        </AnimatePresence>

        {currentIndex < cards.length - 1 && (
          <motion.button onClick={nextCard} className="carousel-button next">
            &gt;
          </motion.button>
        )}

        <div className="carousel-indicators">
          {cards.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: currentIndex === index ? 1.2 : 1,
                backgroundColor:
                  currentIndex === index
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.3)",
              }}
              className="indicator-dot"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
