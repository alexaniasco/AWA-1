import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { motion } from "motion/react";
import ContactSection from "../ContactSection/ContactSection";

const ContactForm = () => {
  const { setContactModal, contactModal } = useContext(AppContext);

  const handleClose = () => {
    setContactModal(false);
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: contactModal ? 2 : 0,
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      style={{
        display: contactModal ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(240, 240, 240, 0.2)",
        backdropFilter: "blur(20px)",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: contactModal ? 1 : 0.8,
          opacity: contactModal ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 1,
        }}
        style={{
          position: "relative",
          maxWidth: "1440px",
          width: "100%",
          height: "100%",
          maxHeight: "900px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ContactSection />

        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "transparent",
            border: "none",
            color: "#1d1d1d",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 1000001,
          }}
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
