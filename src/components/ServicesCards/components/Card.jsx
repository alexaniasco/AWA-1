import { motion } from "framer-motion";
import "./Card.css";

export const Cards = ({ title, description, image, position, background, isExpanded }) => {
  // const [imageLoaded, setImageLoaded] = useState(false);

  // useEffect(() => {
  //   const img = new Image();
  //   img.src = "/chica1.png";
  //   img.onload = () => setImageLoaded(true);
  // }, []);

  return (
    <motion.div
    className={`cardShadow cardContainer ${isExpanded ? "expanded" : "collapsed"}`}
    whileHover={!isExpanded ? { scale: 1.05 } : {}}
  >
    <motion.img
      className="cardBackground"
      src={background || "/linear1.svg"}
      alt={title}
    />
  
    {!isExpanded && (
      <motion.div className="cardOverlay">
        <motion.img
          src={image || ""}
          alt="image"
          className="cardOverlayImage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    )}
  
    <motion.div
      className={`cardContent ${isExpanded ? "expanded" : "collapsed"}`}
      initial={false}
      animate={{
        height: isExpanded ? "-webkit-fill-available" : "auto",
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      <div className="cardTextWrapper">
        <motion.h3 className={`cardTitle ${isExpanded ? "expanded" : "collapsed"}`} >
          {title}
        </motion.h3>
  
        {isExpanded && (
          <motion.div
            className="cardExpandedInfo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
              <p className="expandedDescription">
              Información detallada sobre esta opción. Aquí puedes incluir una descripción más extensa sobre los servicios o características específicas.
            </p>
            <div>
              <motion.img
                src={image || ""}
                alt="image"
                className="expandedImage"
                style={{width: "45%",position:"absolute",right:-20,bottom:-60}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  </motion.div>
  
  );
};
