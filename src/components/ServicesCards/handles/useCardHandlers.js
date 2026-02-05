// src/components/ServiceCards/useCardHandlers.js
import { useState } from "react";

const useCardHandlers = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleCardClick = (section, index, card) => {
    setSelectedCard({ section, index, card });
    setCurrentIndex(index);
  };

  const getExplosionDirection = (section, index, isSelected = false) => {
    const directions = [
      { x: -1800, y: -1800, scale: 8 },
      { x: -1200, y: -1400, scale: 1.2 },
      { x: -200, y: -900, scale: 2 },
      { x: 1000, y: -700, scale: 5 },
      { x: -1700, y: -500, scale: 8 },
      { x: -1700, y: -1000, scale: 1.5 },
      { x: -100, y: -1600, scale: 8 },
      { x: 800, y: -800, scale: 5 },
      { x: -1600, y: 100, scale: 1.5 },
      { x: 1600, y: 0, scale: 1.5 },
      { x: -1800, y: 200, scale: 5 },
      { x: 1200, y: 100, scale: 8 },
    ];

    const sectionIndex = {
      EMPRESAS: 0,
      EXCLUSIVOS: 4,
      PROFESIONALES: 8,
    }[section];

    const uniqueIndex = sectionIndex + index;
    const direction = directions[uniqueIndex];
    const speed = isSelected ? 1.2 : 2;

    return {
      x: isSelected ? 0 : direction.x,
      y: isSelected ? 0 : direction.y,
      opacity: 1,
      scale: isSelected ? 1 : direction.scale,
      zIndex: 999999999,
      transition: {
        duration: speed,
        ease: [0.4, 0, 0.2, 1],
        delay: isSelected ? 0.5 : 0,
      },
    };
  };

  const getCardVariants = (section, index) => {
    if (!selectedCard) {
      return {
        initial: { scale: 0, opacity: 0 },
        animate: {
          scale: 1,
          opacity: 1,
          transition: {
            duration: 2,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      };
    }

    const isSelected =
      selectedCard.section === section && selectedCard.index === index;

    return {
      animate: getExplosionDirection(section, index, isSelected),
    };
  };

  return {
    handleCardClick,
    getCardVariants,
    selectedCard,
    currentIndex,
    previousIndex,
    direction,
    setDirection,
    setCurrentIndex,
    setPreviousIndex,
    DataServices,
  };
};

export default useCardHandlers;
