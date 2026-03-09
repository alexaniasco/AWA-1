import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./ContactSection.css";

const ContactSection = () => {
  const { scrollProgress } = useContext(AppContext);

  // Check if we're in the last section (cards section starts at 0.65)
  const isInLastSection = scrollProgress >= 0.65;

  const textStyle = {
    color: isInLastSection ? "#FFFFFF" : "#000000b4",
    transition: "color 0.5s ease",
  };

  const subtitleStyle = {
    color: isInLastSection ? "#FFFFFF" : "#979797",
    transition: "color 0.5s ease",
  };

  const footerStyle = {
    color: isInLastSection ? "#FFFFFF" : "#1f1f1fde",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginTop: "60px !important",
    textAlign: "center",
    margin: 0,
    transition: "color 0.5s ease",
  };

  return (
    <div className="contact-section">
      {/* Background particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
      <div className="particle particle-7"></div>
      <div className="particle particle-8"></div>
      <div className="particle particle-9"></div>
      <div className="particle particle-10"></div>

      {/* Main content */}
      <div className="content">
        <div
          style={{
            fontFamily: "Bai Jamjuree !important",
            display: "flex",
            gap: 20,
            flexDirection: "column",
          }}
        >
          <h1 style={textStyle} className="main-title">
            Las excusas de hoy son el futuro de mañana
          </h1>
          <p style={subtitleStyle} className="subtitle">
            Pisa fuerte en él como profesional, negocio o empresa
          </p>
        </div>
        <div className="cards-container">
          {/* WhatsApp Card */}
          <a
            href="https://wa.me/5491127702512?text=Hola!%20Estoy%20interesado%20en%20los%20servicios%20de%20Apolo%20Web%20Agency"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            <div className="card whatsapp-card">
              <div className="icon-container">
                <img src="/wppvectorr.svg" alt="WhatsApp" className="icon" />
                <h3 className="card-title">WhatsApp</h3>
              </div>
              <p className="card-description">
                Ideal para consultas rápidas, mantener un dialogo fluido o
                resolver temas puntuales
              </p>
            </div>
          </a>

          {/* Email Card */}
          <a
            href="mailto:apolowebagency@gmail.com?subject=Consulta%20desde%20web%20Apolo%20Agency&body=Hola!%20Me%20gustaría%20consultar%20sobre..."
            className="card-link"
          >
            <div className="card email-card">
              <div className="icon-container">
                <img src="/correovector.svg" alt="Correo" className="icon" />
                <h3 className="card-title">Correo</h3>
              </div>
              <p className="card-description">
                Perfecto si querés compartir información detallada o enviar
                documentación importante
              </p>
            </div>
          </a>

          {/* Google Meet Card */}
          <a
            href="https://calendly.com/apolo-agency/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            <div className="card meet-card">
              <div className="icon-container">
                <img
                  src="/meetvectorr.svg"
                  alt="Google Meet"
                  className="icon"
                />
                <h3 className="card-title">Google Meet</h3>
              </div>
              <p className="card-description">
                Reservá un espacio en video llamada para avanzar en tu proceso
                rápidamente
              </p>
            </div>
          </a>
        </div>

        <footer style={footerStyle} className="footer">
          Apolo Web Agency
        </footer>
      </div>
    </div>
  );
};

export default ContactSection;
