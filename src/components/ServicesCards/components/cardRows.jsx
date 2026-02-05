// src/components/ServiceCards/CardRows.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cards } from "./Card";

const CardRows = ({ DataServices, selectedCard, handleCardClick, getCardVariants }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="content-container"
    >
      {["EMPRESAS", "EXCLUSIVOS", "PROFESIONALES"].map((label, rowIndex) => (
        <motion.div
          key={label}
          initial={{ x: -1500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 + rowIndex * 0.3, ease: "easeOut" }}
          className="row"
        >
          <p className="row-label">{label}</p>
          <div className="card-row">
            <AnimatePresence>
              {DataServices[label].map((card, index) => (
                <motion.div
                  key={`${label.toLowerCase()}-${index}`}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={getCardVariants(label, index)}
                  onClick={() => !selectedCard && handleCardClick(label, index, card)}
                  className="card-wrapper"
                >
                  <Cards
                    position={index}
                    title={card.title}
                    description={card.description}
                    image={card.image}
                    background={card.background}
                    isExpanded={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CardRows;
