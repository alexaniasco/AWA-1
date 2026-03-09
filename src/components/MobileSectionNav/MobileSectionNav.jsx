import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./MobileSectionNav.css";

const SECTIONS_LENGTH = 4;

export const MobileSectionNav = () => {
  const { mobileSectionIndex, scrollApiRef } = useContext(AppContext);

  const canGoPrev = mobileSectionIndex > 0;
  const canGoNext = mobileSectionIndex < SECTIONS_LENGTH - 1;

  const handlePrev = () => {
    if (canGoPrev && scrollApiRef?.current?.goToPrev) {
      scrollApiRef.current.goToPrev();
    }
  };

  const handleNext = () => {
    if (canGoNext && scrollApiRef?.current?.goToNext) {
      scrollApiRef.current.goToNext();
    }
  };

  return (
    <nav className="mobile-section-nav" aria-label="Navegación por secciones">
      <button
        type="button"
        className="mobile-section-nav__btn mobile-section-nav__btn--prev"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Sección anterior"
      >
        <span className="mobile-section-nav__label">Anterior</span>
        <svg className="mobile-section-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        className="mobile-section-nav__btn mobile-section-nav__btn--next"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Siguiente sección"
      >
        <span className="mobile-section-nav__label">Siguiente</span>
        <svg className="mobile-section-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
};

export default MobileSectionNav;
