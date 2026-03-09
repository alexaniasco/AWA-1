import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";

const SECTIONS = [0, 0.25, 0.47, 0.99];
const MOBILE_BREAKPOINT = 600;
const TOUCH_THRESHOLD = 50;
const THROTTLE_DELAY = 16; // ~60fps

const easeInOutQuad = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Throttle function para optimizar performance
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func.apply(this, args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime),
      );
    }
  };
};

export const ScrollHandler = () => {
  const { setScrollProgress, setIsLeavingOptions } = useContext(AppContext);

  const currentSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const touchStartY = useRef(0);
  const touchAccumulatedY = useRef(0);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Funciones optimizadas con useCallback
  const getProgress = useCallback(() => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    return totalHeight > 0 ? window.scrollY / totalHeight : 0;
  }, []);

  const syncSectionFromScroll = useCallback(() => {
    const progress = getProgress();
    const closest = SECTIONS.reduce((prev, curr) =>
      Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev,
    );
    currentSectionRef.current = SECTIONS.indexOf(closest);
  }, [getProgress]);

  const handleScroll = useCallback(() => {
    if (isAnimatingRef.current) return;
    const progress = getProgress();
    setScrollProgress(progress);
    const closest = SECTIONS.reduce((prev, curr) =>
      Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev,
    );
    currentSectionRef.current = SECTIONS.indexOf(closest);
  }, [getProgress, setScrollProgress]);

  // Throttle wrapper para handleScroll
  const throttledHandleScroll = useCallback(
    throttle(handleScroll, THROTTLE_DELAY),
    [handleScroll],
  );

  useEffect(() => {
    const initialProgress = getProgress();
    syncSectionFromScroll();
    setScrollProgress(initialProgress);

    const smoothScrollTo = (targetProgress, onComplete) => {
      const startProgress = getProgress();
      const distance = targetProgress - startProgress;
      const duration = 1000;
      let startTime = null;

      const animateScroll = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);

        const newScrollY =
          (startProgress + distance * easedProgress) *
          (document.body.scrollHeight - window.innerHeight);
        window.scrollTo(0, newScrollY);
        setScrollProgress(startProgress + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          currentSectionRef.current = SECTIONS.indexOf(targetProgress);
          isAnimatingRef.current = false;
          onComplete?.();
        }
      };

      isAnimatingRef.current = true;
      requestAnimationFrame(animateScroll);
    };

    const goToNext = () => {
      if (
        isAnimatingRef.current ||
        currentSectionRef.current >= SECTIONS.length - 1
      )
        return;
      currentSectionRef.current++;
      smoothScrollTo(SECTIONS[currentSectionRef.current]);
    };

    const goToPrev = () => {
      if (isAnimatingRef.current || currentSectionRef.current <= 0) return;
      const idx = currentSectionRef.current;
      if (idx === 2) {
        isAnimatingRef.current = true;
        setIsLeavingOptions(true);
        setTimeout(() => {
          currentSectionRef.current = 1;
          smoothScrollTo(SECTIONS[1], () => {
            setTimeout(() => setIsLeavingOptions(false), 2500);
          });
        }, 800);
      } else {
        currentSectionRef.current--;
        smoothScrollTo(SECTIONS[currentSectionRef.current]);
      }
    };

    const handleScroll = () => {
      if (isAnimatingRef.current) return;
      const progress = getProgress();
      setScrollProgress(progress);
      const closest = SECTIONS.reduce((prev, curr) =>
        Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev,
      );
      currentSectionRef.current = SECTIONS.indexOf(closest);
    };

    const handleWheel = (event) => {
      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      const isLastSection = currentSectionRef.current === SECTIONS.length - 1;

      if (isLastSection) {
        const overlay = document.querySelector(".overlay");
        if (overlay) {
          event.preventDefault();
          const isAtTop = overlay.scrollTop <= 0;
          const isAtBottom =
            Math.abs(
              overlay.scrollHeight - overlay.clientHeight - overlay.scrollTop,
            ) < 2;
          const isScrollingUp = event.deltaY < 0;
          const isScrollingDown = event.deltaY > 0;
          if ((isScrollingDown && !isAtBottom) || (isScrollingUp && !isAtTop)) {
            overlay.scrollTop += event.deltaY;
            return;
          }
          if (isScrollingUp && isAtTop) {
            goToPrev();
            return;
          }
          return;
        }
      }

      event.preventDefault();
      const isInOptionsSection = currentSectionRef.current === 2;
      const isScrollingUpGlobal = event.deltaY < 0;

      if (event.deltaY > 0 && currentSectionRef.current < SECTIONS.length - 1) {
        goToNext();
      } else if (isScrollingUpGlobal && currentSectionRef.current > 0) {
        if (isInOptionsSection) {
          goToPrev();
        } else {
          goToPrev();
        }
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchAccumulatedY.current = 0;
    };

    const handleTouchMove = (e) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      touchStartY.current = currentY;

      const isLastSection = currentSectionRef.current === SECTIONS.length - 1;
      if (isLastSection) {
        const overlay = document.querySelector(".overlay");
        if (overlay) {
          const isAtTop = overlay.scrollTop <= 0;
          const isAtBottom =
            Math.abs(
              overlay.scrollHeight - overlay.clientHeight - overlay.scrollTop,
            ) < 2;
          if ((deltaY > 0 && !isAtBottom) || (deltaY < 0 && !isAtTop)) {
            overlay.scrollTop += deltaY; // Corregido: += deltaY en lugar de -= deltaY
            e.preventDefault();
            return;
          }
          if (deltaY < 0 && isAtTop) {
            // Corregido: deltaY < 0 para swipe up en el top
            e.preventDefault();
            touchAccumulatedY.current += deltaY;
            if (Math.abs(touchAccumulatedY.current) >= TOUCH_THRESHOLD) {
              touchAccumulatedY.current = 0;
              goToPrev(); // Swipe up en top = ir a sección anterior
            }
            return;
          }
          e.preventDefault();
          return;
        }
      }

      e.preventDefault();
      touchAccumulatedY.current += deltaY;

      if (Math.abs(touchAccumulatedY.current) >= TOUCH_THRESHOLD) {
        // deltaY > 0 = swipe up = goToNext (abajo)
        // deltaY < 0 = swipe down = goToPrev (arriba)
        if (
          touchAccumulatedY.current > 0 &&
          currentSectionRef.current < SECTIONS.length - 1
        ) {
          goToNext(); // Swipe hacia arriba va a siguiente sección (abajo)
        } else if (
          touchAccumulatedY.current < 0 &&
          currentSectionRef.current > 0
        ) {
          goToPrev(); // Swipe hacia abajo va a sección anterior (arriba)
        }
        touchAccumulatedY.current = 0;
      }
    };

    const handleTouchEnd = () => {
      touchAccumulatedY.current = 0;
    };

    window.addEventListener("scroll", throttledHandleScroll);

    if (isMobile) {
      window.addEventListener("wheel", handleWheel, { passive: false });
      document.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });

      return () => {
        window.removeEventListener("wheel", handleWheel);
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("scroll", handleScroll);
      };
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    setScrollProgress,
    setIsLeavingOptions,
    isMobile,
    throttledHandleScroll,
    getProgress,
    syncSectionFromScroll,
  ]);

  return null;
};

export default ScrollHandler;
