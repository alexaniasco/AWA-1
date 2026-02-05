import React, { useContext, useState } from "react";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { AppContext } from "../../context/AppContext";
import { motion } from "motion/react";
import Model3D from "../3DModels/CoheteModel";

const InputPer = ({ label, value, setValue }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "48%",
        padding: "14px 0px",
      }}
    >
      <label
        style={{
          fontSize: 22,
          fontWeight: "initial",
          color: "rgba(255, 255, 255, 1)",
          fontFamily: "Bai Jamjuree",
        }}
        htmlFor="input"
      >
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          height: 30,
          outline: "none",
          border: "none",
          fontSize: 18,

          backgroundColor: "transparent",
          borderTop: 0,
          borderLeft: 0,
          borderRight: 0,
          borderBottom: "1px solid white",
        }}
        type="text"
      />
    </div>
  );
};

const ContactForm = () => {
  const { setContactModal,contactModal } = useContext(AppContext);

  const [empresa, setEmpresa] = useState("");
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [nota, setNota] = useState("");
  const templateParams = {
    nombre,
    celular,
    nota,
    empresa,
    email,
  };

  const handleSend = async () => {
    try {
      await emailjs
        .send("service_jomiigu", "template_xqywpk8", templateParams, {
          publicKey: "DyVuk6RLny9SZJDPT",
        })
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
          },
          (err) => {
            console.log("FAILED...", err);
          }
        );
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log("EMAILJS FAILED...", err);
        return;
      }

      console.log("ERROR", err);
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,

        transition: { duration: 1.3 },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 1.3 },
      }}
      style={{
        display: contactModal ?  "flex" : "none",
        backgroundColor: "black",
        position: "fixed",
        zIndex: 80,
        width: "-webkit-fill-available",
        height: "-webkit-fill-available",
        padding: "4% 4%",
      }}
    >
      {/* <div style={{ position: "absolute", top: -250, right: -150 }}>
        <img style={{ width: "40vw" }} src="/logoApolo2.png"></img>
      </div> */}
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "70%",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <button
          style={{ width: "fit-content", backgroundColor: "transparent" }}
          onClick={async () => await setContactModal(false)}
        >
          <p>volver</p>
        </button>

        <img style={{ width: "20vw" }} src="/contactoTitle.png"></img>

        <div
          style={{
            display: "flex",
            width: "60vw",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <InputPer
            value={empresa}
            setValue={setEmpresa}
            label={"Empresa"}
          ></InputPer>
          <InputPer
            value={nombre}
            setValue={setNombre}
            label={"Nombre"}
          ></InputPer>
          <InputPer
            label={"Correo"}
            value={email}
            setValue={setEmail}
          ></InputPer>
          <InputPer
            value={celular}
            setValue={setCelular}
            label={"Celular *"}
          ></InputPer>
        </div>
        <div
          style={{
            display: "flex",
            width: "60vw",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Deja una nota"
                style={{
                  height: "80px",
                  fontSize: 18,
                  width: "44%",
                  border: "1px solid white",
                  outline: "none",
                  padding: "2%",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                }}
                type="text"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "48%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    placeItems: "center",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid white",
                    height: "100%",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={handleSend}
                >
                  <p style={{ fontWeight: "bold", fontSize: 20 }}>
                    Enviar correo
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    placeItems: "center",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    height: "-webkit-fill-available",
                    borderRadius: "8px",
                  }}
                >
                  <a href="https://w.app/og9c2j" target="_BLANK">prefiero hablar por WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 15,
          width: "-webkit-fill-available"
        }}
      >
        <Model3D /> {/* Integrar el modelo 3D aquí */}
      </div>
    </motion.div>
  );
};

export default ContactForm;
