export const options = [
    {
      label: "PROFESIONAL",
      img: "/soyUnPro.png",
      //aca se maneja la posicion de la moneda dentro de las opciones
      position2: [-2, 0.5, 12],
      left: "20%",
      right: "49%",
      exit: {
        opacity: 0,
  
  
      },
      initial: {
        opacity: 0,
        transition: { duration: 0.1 },
      }
    },
    {
      label: "EMPRESA",
      img: "/soyUnaEmpresa.png",
      //aca se maneja la posicion de la moneda dentro de las opciones
      position2: [2, 0.5, 12],
      left: "88%",
      right: "24%",
      exit: {
        opacity: 0,
  
  
      },
      initial: {
        opacity: 0,
        transition: { duration: 0.1 },
      }
    },
  
    {
      label: "EXCLUSIVO",
      img: "/Exclusivo.png",
      //aca se maneja la posicion de la moneda dentro de las opciones
      position2: [2.5, -0.5,12],
      left: "88%",
      right: "82%",
      exit: {
        opacity: 0,
  
      },
      initial: {
        opacity: 0,
        transition: { duration: 0.1 },
      }
    },
  ];