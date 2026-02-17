import { Suspense, lazy, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { SCROLL_RANGES } from "../../controllers/scrollConfig";

import HomeSection from "../HomeSection/HomeSection";
import SecondSection from "../SecondSection/SecondSection";

// ─── Lazy imports con prefetch ──────────────────────────────────────────────
// Estos componentes se cargan en background después del mount, no cuando se necesitan.
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

/**
 * Indicador mínimo de carga para Suspense.
 * Evita el freeze silencioso que ocurre con fallback={null}.
 */
const SuspenseFallback = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 50,
    }}
  />
);

const SectionsHTML = () => {
  const { scrollProgress, handleOptionClick, contactModal } =
    useContext(AppContext);

  // ─── Prefetch: cargar chunks lazy en background después del mount ────────
  const [prefetched, setPrefetched] = useState(false);
  useEffect(() => {
    // Esperar a que el hilo principal esté libre antes de precargar chunks
    const id = requestIdleCallback
      ? requestIdleCallback(() => {
          import("../OptionsOverlay/OptionsOverlay");
          import("../ServicesCards/ServiceCards");
          import("../ContactForm");
          setPrefetched(true);
        })
      : setTimeout(() => {
          import("../OptionsOverlay/OptionsOverlay");
          import("../ServicesCards/ServiceCards");
          import("../ContactForm");
          setPrefetched(true);
        }, 2000);

    return () => {
      if (requestIdleCallback) cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  const isInSection = (section) => {
    const range = SCROLL_RANGES.SECTIONS[section];
    if (!range) return false;
    return scrollProgress >= range[0] && scrollProgress < range[1];
  };

  const showHomeSection = scrollProgress >= 0 && scrollProgress < 0.2;
  const showSecondSection = scrollProgress >= 0.05 && scrollProgress < 0.65;

  return (
    <>
      {showHomeSection && <HomeSection />}
      {showSecondSection && <SecondSection />}

      <Suspense fallback={<SuspenseFallback />}>
        {isInSection("OPTIONS") && (
          <OptionsOverlay
            onOptionClick={(position, label) =>
              handleOptionClick(position, label)
            }
          />
        )}
      </Suspense>

      <Suspense fallback={<SuspenseFallback />}>
        {isInSection("CARDS") && <ServiceCards />}
      </Suspense>

      <Suspense fallback={<SuspenseFallback />}>
        {contactModal && <ContactForm />}
      </Suspense>
    </>
  );
};

export default SectionsHTML;
