// scrollConfig.js
export const SCROLL_RANGES = {
  SECTIONS: {
    // TITLES: [0.05, 0.35],
    OPTIONS: [0.35, 0.55],
    // BLADES: [0.55, 0.85],
    CARDS: [0.85, 1],
  },
  
  TRANSITIONS: {
    BLADES_ENTER: 0.46,
    CARDS_EXIT: 0.85,
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

// export const DYNAMIC_RANGES = {
//   getFirstReveal: (scrollProgress) => [
//     SCROLL_RANGES.SECTION_2[0] + SCROLL_RANGES.ANIMATION_OFFSET,
//     SCROLL_RANGES.SECTION_2[1] - SCROLL_RANGES.ANIMATION_OFFSET,
//   ],

//   getSubsection: (baseRange, index, totalSections) => {
//     const rangeSize = (baseRange[1] - baseRange[0]) / totalSections;
//     return [
//       baseRange[0] + index * rangeSize,
//       baseRange[0] + (index + 1) * rangeSize,
//     ];
//   },
// };
