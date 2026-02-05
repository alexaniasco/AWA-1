import { AnimatePresence, motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { options } from "./data/data";


const Options = ({ onOptionClick, setPressedIndex, pressedIndex,sectionHover, setSectionHover }) => {
  const { scrollProgress } = useContext(AppContext)
  return (
    <>
      {options.map((option, index) => {
        return (
          <AnimatePresence mode="popLayout" key={index}>
            {
              scrollProgress > 0.4 && scrollProgress < 0.47 && (
                <motion.div
                  onClick={() => onOptionClick(option.position2, option.label)}
                  key={index}
                  onMouseDown={() => {
                    setPressedIndex(index);
                  }} // Detecta cuando se presiona
                  onMouseEnter={() => {
                    console.log("option",option.label)
                    setSectionHover(option.label)
                  }} // Detecta cuando se suelta
                  onMouseUp={() => setSectionHover(null)}
                  onMouseLeave={() => setSectionHover("")} // Si el usuario sale del botón, lo restaura
                  initial={{ ...option.initial }}
                  exit={{
                    ...option.exit,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: index * 0.1,
                    },


                  }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    },
                  }}
                  style={{
                    fontFamily: "Bebas Neue",
                    position: "absolute",
                    left: option.left,
                    top: option.right,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    cursor: "pointer",
                    opacity: pressedIndex === index ? 0.5 : 0.8, // Reduce la opacidad si está presionado
                  }}
                >
                  <img style={{ width: "30vw" }} src={option.img}></img>

                </motion.div>
              )

            }

          </AnimatePresence>
        )

      })}
    </>
  );
};

export default Options;
