import { Suspense, lazy, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { SCROLL_RANGES } from "../../controllers/scrollConfig";

import HomeSection from "../HomeSection/HomeSection";
import SecondSection from "../SecondSection/SecondSection";

const OptionsOverlay = lazy(() =>
  import("../OptionsOverlay/OptionsOverlay").then((m) => ({
    default: m.OptionsOverlay,
  }))
);
const ServiceCards = lazy(() =>
  import("../ServicesCards/ServiceCards").then((m) => ({
    default: m.default,
  }))
);
const ContactForm = lazy(() =>
  import("../ContactForm").then((m) => ({
    default: m.default,
  }))
);

const SectionsHTML = () => {
  const {
    scrollProgress,
    handleOptionClick,
    contactModal,
  } = useContext(AppContext);
  
  const isInSection = (section) => {
    const range = SCROLL_RANGES.SECTIONS[section];
    if (!range) return false;
    return scrollProgress >= range[0] && scrollProgress < range[1];
  };
  
  // Mostrar HomeSection cuando la moneda está en la primera posición (después del loader)
  const showHomeSection = scrollProgress >= 0 && scrollProgress < 0.2;
  
  // Mostrar SecondSection cuando la moneda está en la segunda posición (lado izquierdo)
  // Mostrarla desde antes y después para los efectos de transición (incluye retorno desde sección 3)
  const showSecondSection = scrollProgress >= 0.05 && scrollProgress < 0.65;
  
  return (
    <>
      {showHomeSection && <HomeSection />}
      {showSecondSection && <SecondSection />}
      
 
      <Suspense fallback={null}>
        {isInSection("OPTIONS") && (
          <OptionsOverlay
            onOptionClick={(position, label) =>
              handleOptionClick(position, label)
            }
          />
        )}
      </Suspense>

 

      <Suspense fallback={null}>
        {isInSection("CARDS") && <ServiceCards />}
      </Suspense>

      {/* El modal es pesado (incluye 3D). Lo cargamos/mostramos solo cuando se necesita. */}
      <Suspense fallback={null}>
        {contactModal && <ContactForm />}
      </Suspense>

    </>
  );
};

export default SectionsHTML;
