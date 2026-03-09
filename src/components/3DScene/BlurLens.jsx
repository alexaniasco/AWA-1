import { useRef, useContext } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { AppContext } from "../../context/AppContext";

export const BlurLens = () => {
    const meshRef = useRef();
    const { viewport } = useThree();
    const { activeInfo, scrollProgress } = useContext(AppContext);

    // El lens solo es visible en la sección de opciones cuando NO hay info activa
    const isVisible = activeInfo === "" && scrollProgress >= 0.45 && scrollProgress < 0.99;

    useFrame((state) => {
        if (!meshRef.current) return;

        // Suavizar la entrada/salida de la opacidad (usando el material)
        const targetOpacity = isVisible ? 1 : 0;
        meshRef.current.material.opacity = THREE.MathUtils.lerp(
            meshRef.current.material.opacity,
            targetOpacity,
            0.1
        );

        // Solo renderizar si es visible para ahorrar recursos
        meshRef.current.visible = meshRef.current.material.opacity > 0.01;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 10]}>
            <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
            <MeshTransmissionMaterial
                backside
                samples={4}
                thickness={1}
                chromaticAberration={0.025}
                anisotropy={0.1}
                distortion={0}
                distortionScale={0}
                temporalDistortion={0}
                clearcoat={1}
                attenuationDistance={0.5}
                attenuationColor="#ffffff"
                color="#ffffff"
                bg="#ffffff"
                roughness={0.2}
                transmission={1}
                ior={1.2}
                transparent
                opacity={0}
            />
        </mesh>
    );
};
