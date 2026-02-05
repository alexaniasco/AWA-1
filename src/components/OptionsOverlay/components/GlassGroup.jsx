import { memo, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./GlassGroup.css";
import { AppContext } from "../../../context/AppContext";

const GlassGroup = memo(({ activeInfo, sectionHover }) => {
  const { scrollProgress, isLeavingOptions } = useContext(AppContext)

  return (
    <div>
      <div className="glass-layer red-glass">
        <AnimatePresence mode="wait">
          {!activeInfo && scrollProgress < 0.47 && !isLeavingOptions && (
            <motion.div
              initial={{ opacity: 0, x: -200, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, x: -200, transition: { duration: 1 } }}
              animate={{ opacity: 1, x: 0, transition: { duration: 1.5 }, scale: sectionHover === "PROFESIONAL" ? 1.1 : 1 }}
            >
              <img className="glass-img" src="/RojoGlass.svg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="glass-layer green-glass">
        <AnimatePresence mode="wait">
          {!activeInfo && scrollProgress < 0.49 && !isLeavingOptions && (
            <motion.div
              className="glass-align-right"
              initial={{ opacity: 0, y: -200, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, y: -200, transition: { duration: 1 } }}
              animate={{ opacity: 1, y: 0, transition: { duration: 2 }, scale: sectionHover === "EMPRESA" ? 1.1 : 1 }}
            >
              <img className="glass-img" src="/GreenGlass.svg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="glass-layer blue-glass">
        <AnimatePresence mode="wait">
          {!activeInfo && scrollProgress < 0.52 && !isLeavingOptions && (
            <motion.div
              initial={{ opacity: 0, y: 200, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, y: 200, transition: { duration: 1 } }}
              animate={{ opacity: 1, y: 0, transition: { duration: 2.5 }, scale: sectionHover === "EXCLUSIVO" ? 1.1 : 1 }}
            >
              <img className="glass-img" src="/BlueGlass.svg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

GlassGroup.displayName = "GlassGroup";

export default GlassGroup;
