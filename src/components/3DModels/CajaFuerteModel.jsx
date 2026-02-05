import { useGLTF, Html } from "@react-three/drei";
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";

export default function CajaFuerteModel({
    url = "/nuevomodel.glb",
    position = [-10, 0, 10],
    rotation = [0, 0, 0],
    scale = 1
}) {
    const { maletinRef,cajafuerteRef } = useContext(AppContext)
    const { scene } = useGLTF(url);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle mouse movement for parallax effect
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Calculate mouse position relative to the window
            const x = (event.clientX / window.innerWidth) - 0.5;
            const y = (event.clientY / window.innerHeight) - 0.5;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Habilitar sombras en todo el modelo
    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <>
            {/* HTML Clouds with parallax effect */}
            {/* <Html position={[position[0] - 15, position[1] + 5, position[2] +4]}>
                <div 
                    style={{
                        position: 'relative',
                        width: '500px',
                        height: '500px',
                        pointerEvents: 'none'
                    }}
                >
                    <img 
                        src="/nubee.png" 
                        style={{
                            position: 'absolute',
                            width: '200px',
                            height: 'auto',
                            left: `${50 + mousePosition.x * -30}px`,
                            top: `${50 + mousePosition.y * -30}px`,
                            opacity: 0.7,
                            zIndex:-10,
                            transform: 'scale(1.5)'
                        }}
                    />
                    <img 
                        src="/nubee.png" 
                        style={{
                            position: 'absolute',
                            width: '180px',
                            height: 'auto',
                            left: `${200 + mousePosition.x * -50}px`,
                            top: `${150 + mousePosition.y * -50}px`,
                            opacity: 0.6,
                            zIndex:-10,
                            transform: 'scale(1.2)'
                        }}
                    />
                    <img 
                        src="/nubee.png" 
                        style={{
                            position: 'absolute',
                            width: '220px',
                            height: 'auto',
                            left: `${100 + mousePosition.x * -70}px`,
                            top: `${250 + mousePosition.y * -70}px`,
                            opacity: 0.8,
                            zIndex:-10,
                            transform: 'scale(1.7)'
                        }}
                    />
                    <img 
                        src="/nubee.png" 
                        style={{
                            position: 'absolute',
                            width: '190px',
                            height: 'auto',
                            left: `${300 + mousePosition.x * -40}px`,
                            top: `${200 + mousePosition.y * -40}px`,
                            opacity: 0.7,
                            zIndex:-10,
                            transform: 'scale(1.4)'
                        }}
                    />
                </div>
            </Html> */}

            <primitive
                ref={cajafuerteRef}
                object={scene}
                position={position}
                rotation={rotation}
                scale={scale}
            />
        </>
    );
}