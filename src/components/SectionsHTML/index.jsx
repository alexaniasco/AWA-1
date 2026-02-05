import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useScrollManager } from "../../controllers/useScrollManager";

import { OptionsOverlay } from "../OptionsOverlay/OptionsOverlay";
import ContactForm from "../ContactForm";
import HomeSection from "../HomeSection/HomeSection";
import SecondSection from "../SecondSection/SecondSection";
import DashboardRevenueScreen from "../DashboardRevenueScreen/DashboardRevenueScreen";

const SectionsHTML = () => {
  const {
    scrollProgress,
 
    setScrollProgress,
    contactModal,
    handleOptionClick,
  } = useContext(AppContext);
  useEffect(() => {
    console.log(contactModal, "cambio");
  }, [contactModal]);

  const { isInSection } = useScrollManager(setScrollProgress);
  
  // Mostrar HomeSection cuando la moneda está en la primera posición (después del loader)
  const showHomeSection = scrollProgress >= 0 && scrollProgress < 0.2;
  
  // Mostrar SecondSection cuando la moneda está en la segunda posición (lado izquierdo)
  // Mostrarla desde antes y después para los efectos de transición (incluye retorno desde sección 3)
  const showSecondSection = scrollProgress >= 0.05 && scrollProgress < 0.65;
  
  // Mostrar DashboardRevenueScreen en lugar de las dos pantallas azules viejas
  const showDashboardRevenue = isInSection("CARDS")(scrollProgress);
  
  return (
    <>
      {showHomeSection && <HomeSection />}
      {showSecondSection && <SecondSection />}
      
 
      {isInSection("OPTIONS")(scrollProgress) && (
        <OptionsOverlay
          onOptionClick={(position, label) =>
            handleOptionClick(position, label)
          }
        />
      )}

 

      {showDashboardRevenue && <DashboardRevenueScreen />}
      <ContactForm></ContactForm>

    </>
  );
};

export default SectionsHTML;
