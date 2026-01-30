import { memo, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./GlassGroup.css";
import { AppContext } from "../../../context/AppContext";
import GlassModel3D from "./GlassModel3D";
import PropTypes from "prop-types";

// Valores fijos (antes venían de Leva). Mantenerlos acá evita que `leva` se bundlee en producción.
const GLASS_DEBUG = {
  Profesional: { pos: [-1.7, -0.02, -0.1], rotY: -0.66, scale: 2.86 },
  Empresa: { pos: [0.65, -0.6, -0.01], rotY: -2.6, scale: 2.1 },
  Exclusivo: { pos: [1.24, 0.69, 0.0], rotY: -2.5, scale: 3.0 },
};

const GlassGroup = memo(({ activeInfo, sectionHover }) => {
  const { scrollProgress, isLeavingOptions } = useContext(AppContext);

  return (
    <div>
      {/* PROFESIONAL */}
      <AnimatePresence>
        {!activeInfo && scrollProgress < 0.47 && !isLeavingOptions && (
          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 21 }}>
            <GlassModel3D
              url="/glas1final.glb"
              isHovered={sectionHover === "PROFESIONAL"}
              debugPosition={GLASS_DEBUG.Profesional.pos}
              debugRotation={[0, GLASS_DEBUG.Profesional.rotY, 0]}
              debugScale={GLASS_DEBUG.Profesional.scale}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMPRESA */}
      <AnimatePresence>
        {!activeInfo && scrollProgress < 0.49 && !isLeavingOptions && (
          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 21 }}>
            <GlassModel3D
              url="/glases222final.glb"
              isHovered={sectionHover === "EMPRESA"}
              debugPosition={GLASS_DEBUG.Empresa.pos}
              debugRotation={[0, GLASS_DEBUG.Empresa.rotY, 0]}
              debugScale={GLASS_DEBUG.Empresa.scale}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXCLUSIVO */}
      <AnimatePresence>
        {!activeInfo && scrollProgress < 0.52 && !isLeavingOptions && (
          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 21 }}>
            <GlassModel3D
              url="/glases333final.glb"
              isHovered={sectionHover === "EXCLUSIVO"}
              debugPosition={GLASS_DEBUG.Exclusivo.pos}
              debugRotation={[0, GLASS_DEBUG.Exclusivo.rotY, 0]}
              debugScale={GLASS_DEBUG.Exclusivo.scale}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

GlassGroup.displayName = "GlassGroup";

GlassGroup.propTypes = {
  activeInfo: PropTypes.string,
  sectionHover: PropTypes.string,
};

export default GlassGroup;
