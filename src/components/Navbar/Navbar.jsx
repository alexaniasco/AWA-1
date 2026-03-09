import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";

export default function Navbar() {
  const { scrollProgress } = useContext(AppContext);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const [activeSection, setActiveSection] = useState("INICIO");
  const navbarRef = useRef(null);
  const iconRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!iconRef.current) return;

      const iconRect = iconRef.current.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (iconRect.left + iconRect.width / 2), 2) +
          Math.pow(e.clientY - (iconRect.top + iconRect.height / 2), 2),
      );

      if (distance < 100) {
        setIsNavbarActive(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    const handleMouseLeaveNavbar = () => {
      timeoutRef.current = setTimeout(() => {
        setIsNavbarActive(false);
      }, 2000);
    };

    const handleMouseEnterNavbar = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sections = [
        { name: "INICIO", position: 0 },
        { name: "CLIENTES", position: document.body.scrollHeight * 0.45 },
        { name: "SERVICIOS", position: document.body.scrollHeight * 0.9 },
      ];

      const currentSection = sections.reduce((prev, curr) => {
        return Math.abs(curr.position - scrollPosition) <
          Math.abs(prev.position - scrollPosition)
          ? curr
          : prev;
      });

      setActiveSection(currentSection.name);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    const navbar = navbarRef.current;
    if (navbar) {
      navbar.addEventListener("mouseleave", handleMouseLeaveNavbar);
      navbar.addEventListener("mouseenter", handleMouseEnterNavbar);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (navbar) {
        navbar.removeEventListener("mouseleave", handleMouseLeaveNavbar);
        navbar.removeEventListener("mouseenter", handleMouseEnterNavbar);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const smoothScrollTo = (position) => {
    setIsTransitioning(true);
    const start = window.scrollY;
    const startTime = performance.now();
    const duration = 2000;

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = (progress) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + (position - start) * ease(progress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsTransitioning(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const getLinkStyle = (section) => {
    // Calculate transition progress (starts at 0.8, fully white at 0.9)
    const transitionStart = 0.8;
    const transitionEnd = 0.9;
    const transitionProgress = Math.max(
      0,
      Math.min(
        1,
        (scrollProgress - transitionStart) / (transitionEnd - transitionStart),
      ),
    );

    // Interpolate color from dark to white
    const darkColorValue = 60;
    const whiteColorValue = 255;
    const currentColorValue = Math.round(
      darkColorValue + (whiteColorValue - darkColorValue) * transitionProgress,
    );
    const currentColor = `rgb(${currentColorValue}, ${currentColorValue}, ${currentColorValue})`;

    return {
      fontWeight: activeSection === section ? "bold" : "normal",
      textShadow:
        activeSection === section
          ? `0 0 5px rgba(${currentColorValue}, ${currentColorValue}, ${currentColorValue}, 0.5)`
          : "none",
      fontFamily: "Bai Jamjuree",
      color: currentColor,
      letterSpacing: "2px",
      transition: "color 0.3s ease, text-shadow 0.3s ease",
      cursor: "pointer",
    };
  };

  return (
    <div
      ref={navbarRef}
      style={{
        position: "fixed",
        display: "flex",
        backdropFilter: isNavbarActive ? "blur(10px)" : "none",
        backgroundColor: "transparent",
        top: 0,
        left: 0,
        width: "100%",
        height: "40px",
        padding: "10px 0px",
        zIndex: isNavbarActive ? 999999999 : 1,
        justifyContent: isNavbarActive ? "space-around" : "flex-end",
        alignItems: "center",
        transition: "all 0.3s ease",
      }}
    >
      {isNavbarActive && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={getLinkStyle("INICIO")}
            onClick={() => smoothScrollTo(document.body.scrollHeight * 0.0)}
          >
            INICIO
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={getLinkStyle("CLIENTES")}
            onClick={() => smoothScrollTo(document.body.scrollHeight * 0.42)}
          >
            CLIENTES
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            style={getLinkStyle("SERVICIOS")}
            onClick={() => smoothScrollTo(document.body.scrollHeight * 0.91)}
          >
            SERVICIOS
          </motion.p>
        </>
      )}

      <img
        ref={iconRef}
        onClick={() => setIsNavbarActive(!isNavbarActive)}
        style={{
          position: "fixed",
          right: "1.5rem",
          top: "12px",
          objectFit: "contain",
          height: "24px",
          padding: "4px",
          cursor: "pointer",
          zIndex: 1000000001,
          filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
        }}
        src="/navbaricon.webp"
      />
    </div>
  );
}
