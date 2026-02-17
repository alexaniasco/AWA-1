export const options = [
  {
    label: "PROFESIONAL",
    img: "/soyUnPro.png",
    //aca se maneja la posicion de la moneda dentro de las opciones
    position2: [-2, 0.5, 12],
    // Desktop
    left: "20%",
    right: "49%",
    // Mobile: centrado en el área blanca izquierda
    mobileLeft: "80%",
    mobileTop: "50%",
    exit: {
      opacity: 0,
    },
    initial: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  },
  {
    label: "EMPRESA",
    img: "/soyUnaEmpresa.png",
    //aca se maneja la posicion de la moneda dentro de las opciones
    position2: [2, 0.5, 12],
    // Desktop
    left: "88%",
    right: "24%",
    // Mobile: centrado en el vidrio rosado (arriba derecha)
    mobileLeft: "50%",
    mobileTop: "10%",
    exit: {
      opacity: 0,
    },
    initial: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  },
  {
    label: "EXCLUSIVO",
    img: "/Exclusivo.png",
    //aca se maneja la posicion de la moneda dentro de las opciones
    position2: [2.5, -0.5, 12],
    // Desktop
    left: "88%",
    right: "82%",
    // Mobile: centrado en el vidrio verde (abajo derecha)
    mobileLeft: "50%",
    mobileTop: "90%",
    exit: {
      opacity: 0,
    },
    initial: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  },
];
