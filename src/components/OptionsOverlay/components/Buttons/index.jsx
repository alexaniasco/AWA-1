import { useContext } from "react";
import { AppContext } from "../../../../context/AppContext";

const detectGradient = (gradient) => {
  if (gradient === "EMPRESA") {
    return "linear-gradient(4deg, rgba(22,94,126,0.5) 0%, rgba(27,132,73,0.5) 87%)";
  }
  if (gradient === "PROFESIONAL") {
    return "linear-gradient(4deg, rgba(252,36,36,0.6266392299107143) 40%,  rgba(9,9,240,0.8871434315913865) 100%)";
  }
  if (gradient === "EXCLUSIVO") {
    return "linear-gradient(4deg, rgba(9,9,240,0.5986280254289216) 50%, rgba(25,160,25,0.5) 100%)";
  }
};

export const Buttons = ({ gradient , onClick ,onDesclick }) => {
  const { contactModal, setContactModal } = useContext(AppContext);

  const gradientSelect = detectGradient(gradient);
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        marginBottom: 10,
        flexDirection: "column",
      }}
    >
      <button
        onClick={() => setContactModal(true)}
        style={{
          background: gradientSelect,
          boxShadow:
            "-4px -4px 4px 0px rgba(0,0,0,0.25) inset",
          fontSize: 20,
          borderRadius: 8,
          padding: "20px 0px",
          fontFamily: "Nunito Sans",
          fontWeight: "bold",
          letterSpacing: "2px",
          color: "white",
        }}
      >
        CONTACTANOS
      </button>
      <button 
      onMouseEnter={onClick || null}
      onMouseLeave={onDesclick || null}
        // onClick={onClick || null}
        className="hover-button"
        style={{
          backgroundColor: "transparent",
          fontSize: 20,
          borderRadius: 8,
          padding: "20px 0px",
          fontFamily: "Nunito Sans",
          fontWeight: "bold",
          letterSpacing: "2px",
          color: "white",
        }}
      >
        ¿Por qué nos eligen?
      </button>
    </div>
  );
};
