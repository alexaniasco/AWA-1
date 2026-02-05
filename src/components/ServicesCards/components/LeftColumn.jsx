// src/components/ServiceCards/LeftColumn.jsx
import React from "react";
import { motion } from "framer-motion";

const LeftColumn = ({ zIndex, showBackground }) => {
  return (
    <motion.div className="left-column" style={{ zIndex }}>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showBackground ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="left-column-bg"
      />
      <div>
        <h1 className="title-main">APOLO</h1>
        <h1 className="title-sub">Web Agency</h1>
      </div>
      <div>
        <p className="description">
        <strong>Conectamos talento, tecnología y oportunidad</strong> para cubrir las necesidades del mundo IT.<br></br>
        Somos el<strong> refuerzo</strong> de las empresas y startups, como tambien el <strong>respaldo </strong>de los profesionales.
        </p>
      </div>
      <div className="cta-buttons">
        <button className="btn-contact">CONTACTANOS</button>
        <button className="btn-dev">¡Necesito un desarrollo!</button>
      </div>
    </motion.div>
  );
};

export default LeftColumn;
