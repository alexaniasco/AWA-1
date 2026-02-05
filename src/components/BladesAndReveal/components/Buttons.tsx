import React, { useContext } from "react";
import "../BladesAndReveal.css"
import { AppContext } from "../../../context/AppContext";

export const ButtonAction = ({ handle, secondHanle }) => {
  const { setContactModal} = useContext(AppContext);
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
      onClick={()=>setContactModal(true)}
        style={{
          background:
            "linear-gradient(4deg, rgba(122,56,150,0.7) 38%, rgba(9,9,240,0.7)",
          boxShadow: "-4px -4px 4px 0px rgba(0,0,0,0.25) inset",
          fontSize: 20,
          borderRadius: 8,
          padding: "20px 0px",
          fontFamily: "Nunito Sans",
          fontWeight: "bold",
          letterSpacing: "2px",
          color: "white",
        }}
      >
        ¡Necesito un diseño!
      </button>
      <button
      onMouseEnter={handle ? () => handle() : () => null}
      onMouseLeave={handle ? () => handle() : () => null}
        className="fill"
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
        ¿Que diseñamos?
      </button>
    </div>
  );
};
