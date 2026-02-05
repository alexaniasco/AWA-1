import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 1500;
const PARTICLE_COLOR = 0xffffff;

export const ParticleBackground = () => {
  const particlesRef = useRef();
  const positions = useRef(new Float32Array(PARTICLE_COUNT * 3));
  const originalPositions = useRef();

  useEffect(() => {
    // Initialize particle positions
    for(let i = 0; i < PARTICLE_COUNT; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 100;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 50 - 50;
    }
    
    originalPositions.current = new Float32Array(positions.current);
    
    // Handle window resize
    const handleResize = () => {
      for(let i = 0; i < PARTICLE_COUNT; i++) {
        positions.current[i * 3] = originalPositions.current[i * 3] * window.innerWidth / 1000;
        positions.current[i * 3 + 1] = originalPositions.current[i * 3 + 1] * window.innerHeight / 1000;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state, delta) => {
    if(!particlesRef.current) return;
    
    // Animate particles
    const positions = particlesRef.current.geometry.attributes.position.array;
    for(let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      positions[i * 3 + 2] += delta * 0.5;
      if(positions[i * 3 + 2] > 50) positions[i * 3 + 2] = -50;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Add texture for spherical particles
  const alphaMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points ref={particlesRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          itemSize={3}
          array={positions.current}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color={PARTICLE_COLOR}
        transparent
        opacity={0.7}
        sizeAttenuation
        alphaMap={alphaMap}
        alphaTest={0.1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};