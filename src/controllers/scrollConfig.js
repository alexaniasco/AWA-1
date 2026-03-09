// scrollConfig.js
export const SCROLL_RANGES = {
  SECTIONS: {
    // TITLES: [0.05, 0.35],
    OPTIONS: [0.25, 0.65],
    // BLADES: [0.55, 0.85],
    CARDS: [0.65, 1],
  },

  TRANSITIONS: {
    BLADES_ENTER: 0.26,
    CARDS_EXIT: 0.65,
  },
  SMOOTH: {
    FACTOR: 0.08, // Ajusta la suavidad (0.01 = muy lento, 0.1 = rápido)
    PRECISION: 0.0001, // Para evitar cálculos innecesarios
  },
};

export const getDynamicRange = (baseRange, offset = 0.03) => [
  baseRange[0] + offset,
  baseRange[1] - offset,
];

export const calculateProgress = (scrollY, totalHeight) => {
  return Math.min(1, Math.max(0, scrollY / totalHeight));
};

