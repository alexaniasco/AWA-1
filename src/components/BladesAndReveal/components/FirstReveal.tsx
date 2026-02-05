import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ButtonAction } from "./Buttons";


const preloadImagechica2 = new Image();
preloadImagechica2.src = "/chica2.png";
const preloadImagechica1 = new Image();
preloadImagechica1.src = "/chica3.png";

export const FirstReveal = React.memo(({ scrollProgress,isVisible }: { scrollProgress: number ,isVisible:boolean}) => {

  const [ showModal , setShowModal] = useState(false);

    // Definición de condiciones para mostrar cada bloque
    const firstImage = scrollProgress >= 0.04 && scrollProgress < 0.3;
    const secondImage = scrollProgress >= 0.07 && scrollProgress < 0.3;
    const firstText = scrollProgress >= 0.09 && scrollProgress < 0.14;
    const secondText = scrollProgress >= 0.09 && scrollProgress < 0.14;
    const thirdText = scrollProgress >= 0.09 && scrollProgress < 0.14;
  
    const [mouseActive, setMouseActive] = useState(false);

    
    useEffect(() => {
      setTimeout(() => {
        setMouseActive(true);
      }, 1000);
    }, []);
  
    const [offset, setOffset] = useState({ x: 0, y: 0 });
  
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) * 0.02;
      const deltaY = (e.clientY - centerY) * 0.02;
      setOffset({ x: deltaX, y: deltaY });
    };
  
    return (
      // Contenedor que escucha el movimiento del mouse
      <div
        style={{ display: isVisible ? "block": "none" }}
        onMouseMove={mouseActive ? handleMouseMove : undefined}
      >
          {firstImage && !showModal && (
            <motion.div
              key="firstImage"
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.8 },
              }}
              initial={{ opacity: 0, scale: 0.8 ,
                x: 0,
                y: 0,
              }}
              style={{
                x: offset.x * 1.1,
                y: offset.y * 1.1,
              }}
              className="background-image2"
              animate={{
                scale: 1.2,
                opacity: 0.3,
                x: -offset.x,
                y: -offset.y,
                // Primer imagen se mueve hacia la dirección del offset
  
                transition: { duration: 0.8, ease: "easeOut" },
              }}
            >
              {/* <img
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                src={preloadImagechica2.src}
                alt="Imagen chica 2"
              /> */}
            </motion.div>
          )}
      
        <AnimatePresence mode="popLayout">
          {secondImage && mouseActive && !showModal && (
            <motion.div
            className="background-imageS"
              key="secondImage"
              initial={{
                x: -200,
                y: 200,
                scale: 0.8,
              }}
              exit={{
                opacity: 0,
                x: -200,
                y: 200,
                scale: 0.8,
                transition: { duration: scrollProgress > 0.26 ? 1 : 0.8 },
              }}
              style={{
                x: -offset.x * 1.5,
                y: -offset.y * 1.5,
              }}
              animate={
                !mouseActive
                  ? {
                    // Segunda imagen se mueve en sentido contrario
                    x: 0,
                    y: 0,
                    scale: 1.2,
                    transition: {
                      duration: 1.5,
                      ease: "easeOut",
                    },
                  }
                  : {
                    x: offset.x,
                    y: offset.y,
                    scale: 1.2,
                    transition: {
                      duration: 1.5,
                      ease: "easeOut",
                    },
                  }
              }
            >
              <motion.div
              className="background-image1"

                animate={{
                  y: [-10, 10, -10], // Movimiento vertical suave arriba y abajo
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                      repeatType: "reverse"
                    }
                  }
                }}
              >
               {/* <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  src={preloadImagechica1.src}
                  alt="Imagen chica 1"
                /> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
       <div style={{position:"absolute",top:0,left:0,zIndex:-100}}>
         <AnimatePresence mode="wait">
          { firstImage && showModal && (
            <motion.div
            // className="background-imageS"
              key="secondImage"
              initial={{
                // x: -200,
                // y: 200,
                // scale: 0.8,
                opacity:0

              }}
              exit={{
                opacity: 0,
                // x: -200,
                // y: 200,
                // scale: 0.8,
                // transition: { duration: scrollProgress > 0.26 ? 1 : 0.8 },
              }}
              style={{
                backgroundColor:"red",
                width:"100vw",height:"100vh",
              
                // x: -offset.x * 1.5,
                // y: -offset.y * 1.5,
              }}
              animate={
                {
                  transition: {
                    duration: 1.5,
                  },
                  opacity:1

                }
              }
            >
              {/* <motion.div
                style={{
                  width:"50vw",
                  position:"absolute",
                  right:0,
                }}
                animate={{
                  y: [-10, 10, -10], // Movimiento vertical suave arriba y abajo
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                      repeatType: "reverse"
                    }
                  }
                }}
              >
              
                <motion.img
                  style={{
                    width: 220,
                    height: 220,
                    objectFit: "contain",
                    position:"absolute",
                    right:"25vw",
                    top:"50vh"
                  }}
                  animate={{
                    x: mouseActive ? -offset.x * 1.2 : 0,
                    y: mouseActive ? -offset.y * 0.8 : 0,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  src={"/par1.png"}
                  alt="Partícula 1"
                />
                <motion.img
                  style={{
                    width: 100,
                    height: 100,
                    position:"absolute",
                    right:"15vw",
                    top:"12vh",
                    objectFit: "contain",
                  }}
                  animate={{
                    x: mouseActive ? offset.x * 2 : 0,
                    y: mouseActive ? offset.y * 1.5 : 0,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  src={"/par2.png"}
                  alt="Partícula 2"
                />
                <motion.img
                  style={{
                    width: 150,
                    height: 150,
                    position:"absolute",
                    right:"19vw",
                    top:"30vh",
                    objectFit: "contain",
                  }}
                  animate={{
                    x: mouseActive ? -offset.x * 0.7 : 0,
                    y: mouseActive ? offset.y * 1.2 : 0,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                  src={"/par3.png"}
                  alt="Partícula 3"
                />
                <motion.img
                  style={{
                    width: 200,
                    height: 200,
                    position:"absolute",
                    right:"32vw",
                    top:"15vh",
                    objectFit: "contain",
                  }}
                  animate={{
                    x: mouseActive ? offset.x * 1.5 : 0,
                    y: mouseActive ? -offset.y * 0.9 : 0,
                    transition: { duration: 0.35, ease: "easeOut" }
                  }}
                  src={"/par4.png"}
                  alt="Partícula 4"
                />
                <motion.img
                  style={{
                    width: 600,
                    height: 600,
                    position:"absolute",
                    right:0,
                    top:"20vh",
                    objectFit: "contain",
                  }}
                  animate={{
                    x: mouseActive ? -offset.x * 0.4 : 0,
                    y: mouseActive ? -offset.y * 0.6 : 0,
                    transition: { duration: 0.45, ease: "easeOut" }
                  }}
                  src={"/par6.svg"}
                  alt="Partícula 5"
                />
              </motion.div> */}
              <video src="/video2.mp4" style={{width:"100%",height:"100%",objectFit:"cover"}} autoPlay loop muted>
                {/* <source src="/video.mp4" type="video/mp4"></source> */}
                </video>
            </motion.div>
          )}
        </AnimatePresence>
       </div>
        <div
          style={{
            position: "fixed",
            height: "100vh",
            width: "50vw",
            zIndex: 21,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "20px 40px",
            justifyContent: "center",
            gap:"4vh"
            }}
          >
            <AnimatePresence mode="popLayout">
              {firstText  && (
                <motion.div
                  key="firstText"
                  exit={{
                    opacity: 0,
                    x: -100,
                    transition: { duration: 0.5 },
                  }}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 1 },
                  }}
                  style={{
                    maxWidth: "60vw",
                    color: "white",
                  }}
                >
                  <div style={{ 
                 padding: "0px 0px 0px 0px ",width:"max-content",borderRadius:10 }}>
                    <img
                      style={{ width: "44vw" }}
                      src="/DiseñadoresUx.png"
                      alt="Diseñadores UX"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
           <div style={{height:"auto"}}>
           <AnimatePresence mode="popLayout">
              {secondText && !showModal && (
                <motion.div
                  key="secondText"
                  exit={{
                    opacity: 0,
                    x: -200,
                    transition: { duration: 0.5 },
                  }}
                  initial={{ opacity: 0, x: -200 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 1 },
                  }}
                  style={{
                    maxWidth: "50vw",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      height:"250px"
                    }}
                  >
                    <p
                      style={{
                        width: "fit-content",
                        padding: "20px 20px 20px 0px",
                        borderRadius: 20,
                        fontFamily: "Nunito Sans",
                      }}
                    >
                      <strong style={{ lineHeight: 2 }}>
                      Diseña pensando en todo
                      </strong>
                      <br />
                      Somos estrategas en el arte de pulir los detalles que diferencian un producto potencial de uno exitoso. Trabajamos con las mejores metodologias del diseño y lo aplicamos en tecnologia de vanguardia.
                    </p>
                  </div>
                </motion.div>
              )}   
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {secondText && showModal && (
                <motion.div
                  key="secondText"
                  exit={{
                    opacity: 0,
                    x: -200,
                    transition: { duration: 0.5 },
                  }}
                  initial={{ opacity: 0, x: -200 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 1 },
                  }}
                  style={{
                    maxWidth: "50vw",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      height:"250px",
                      justifyContent:"center"

                    }}
                  >
                    <p
                      style={{
                        width: "fit-content",
                        padding: "20px 20px 20px 0px",
                        borderRadius: 20,
                        fontFamily: "Nunito Sans",
                      }}
                    >
                   

                     Desde estrategias de experiencia, optimización de procesos, flujos de navegación, UX writing y  arquitectura de la información hasta prototipos, interfaces y la sostenibilidad a futuro.
                    </p>
                  </div>
                </motion.div>
              )}           
            </AnimatePresence>
           </div> 
            <AnimatePresence mode="popLayout">
              {thirdText  && (
                <motion.div
                  key="thirdText"
                  exit={{
                    opacity: 0,
                    x: -300,
                    transition: { duration: 0.5 },
                  }}
                  initial={{ opacity: 0, x: -300 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { duration: 1 },
                  }}
                  style={{
                    maxWidth: "50vw",
                  }}
                >
                  <div style={{ width: "35vw" }}>
                    <ButtonAction secondHanle={()=>{}}  handle={()=> setShowModal(!showModal)}/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  });

FirstReveal.displayName = "FirstReveal";
