import { useEffect, useCallback } from "react";
import { SCROLL_RANGES, calculateProgress } from "./scrollConfig";

export const useScrollManager = (setScrollProgress) => {
  const smoothScroll = useCallback(
    (targetScrollY, currentScrollY, totalHeight) => {
      const difference = targetScrollY - currentScrollY;
      const newY = currentScrollY + difference;

      if (Math.abs(difference) > SCROLL_RANGES.SMOOTH.PRECISION) {
        setScrollProgress(calculateProgress(newY, totalHeight));
        requestAnimationFrame(() =>
          smoothScroll(targetScrollY, newY, totalHeight)
        );
      }
    },
    [setScrollProgress]
  );

  useEffect(() => {
    let targetScrollY = window.scrollY;
    let currentScrollY = targetScrollY;
    let animationFrameId;
    let totalHeight = document.body.scrollHeight - window.innerHeight;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() =>
          smoothScroll(targetScrollY, currentScrollY, totalHeight)
        );
      }
    };

    const handleResize = () => {
      totalHeight = document.body.scrollHeight - window.innerHeight;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothScroll]);

  const isInSection = (section) => (progress) => {
    const range = SCROLL_RANGES.SECTIONS[section];
    if (!range) {
      console.error(
        `Sección "${section}" no definida en SCROLL_RANGES.SECTIONS`
      );
      return false;
    }
    return progress >= range[0] && progress < range[1];
  };
  return {
    isInSection,
    transitions: SCROLL_RANGES.TRANSITIONS,
  };
};
