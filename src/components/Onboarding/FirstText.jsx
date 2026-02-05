import { AnimatePresence, motion } from "motion/react";
import PropTypes from "prop-types";
import "./FirstText.css";

const FirstText = ({ scrollProgress, sectionRange }) => {
  const [rangeStart, rangeEnd] = sectionRange;
  const relativeProgress =
    (scrollProgress - rangeStart) / (rangeEnd - rangeStart);

  const showFirst = relativeProgress >= 0.28 && relativeProgress < 0.33;
  const showSecond = relativeProgress >= 0.5 && relativeProgress < 0.64;
  const showThird = relativeProgress >= 0.75 && relativeProgress < 0.98;

  return (
    <>
      <AnimatePresence mode="wait">
        {showFirst && (
          <motion.div
            key="first-text"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.5 } }}
            className="text-block top-right"
          >
            <h4 className="title medium-text">
              {`“ Combinar `}
              <strong>Inteligencia Artificial con Automatización </strong>
           <br></br>
              {`no se trata de futuro, sino de ser parte de él”`}
            </h4>
            <h6 className="subTitle">Closer</h6>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showSecond && (
          <motion.div
            key="second-text"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.5 } }}
            className="text-block bottom-left"
          >
            <h5 className="title medium-text">
            {`“ Creamos `}
              <strong>herramientas capaces de optimizar y reinventar</strong>
              {` el trabajo a como lo conocemos. “`}
            
            </h5>
            <h6 className="subTitle2">Team Lead Developer</h6>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showThird && (
          <motion.div
            key="third-text"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.5 } }}
            className="text-block bottom-right align-end"
          >
            <h5 className="title medium-text">
              <strong>“ Diseñamos y desarollamos tecnologia inteligente. </strong>
              {` Somos el soporte de grandes empresas y el mejor  
 amigo de los independientes ”`}
            </h5>
            <h6 className="subTitle">CEO</h6>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

FirstText.propTypes = {
  scrollProgress: PropTypes.number.isRequired,
  sectionRange: PropTypes.array.isRequired,
};

export default FirstText;
