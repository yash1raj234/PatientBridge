'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges } from '@react-three/drei';
import * as THREE from 'three';

function MedicalCross() {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1B4FD8',
        metalness: 0.3,
        roughness: 0.2,
        transmission: 0.1,
        transparent: true,
      }),
    []
  );

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.3}>
      <group>
        <mesh material={material}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <Edges color="#38BDF8" threshold={15} />
        </mesh>
        <mesh material={material}>
          <boxGeometry args={[1.2, 0.3, 0.3]} />
          <Edges color="#38BDF8" threshold={15} />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitingIcons() {
  const groupRef = useRef<THREE.Group>(null);
  const pillMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0D9488' }), []);
  const crystalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#38BDF8' }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Objects are children of groupRef.current
    const children = groupRef.current.children;
    if (children.length >= 4) {
      children[0].position.x = Math.cos(time * 0.5) * 1.8;
      children[0].position.z = Math.sin(time * 0.5) * 1.8;

      children[1].position.x = Math.cos(time * 0.6 + 2) * 2.2;
      children[1].position.z = Math.sin(time * 0.6 + 2) * 2.2;
      children[1].position.y = Math.sin(time * 0.8) * 0.5;

      children[2].position.x = Math.cos(time * 0.4 + 4) * 2.0;
      children[2].position.z = Math.sin(time * 0.4 + 4) * 2.0;
      children[2].rotation.x += 0.01;

      children[3].position.x = Math.cos(time * 0.7 + 1) * 2.4;
      children[3].position.z = Math.sin(time * 0.7 + 1) * 2.4;
      children[3].position.y = Math.cos(time * 0.5) * -0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh material={pillMat}>
        <capsuleGeometry args={[0.1, 0.2, 4, 8]} />
      </mesh>
      <mesh material={crystalMat}>
        <octahedronGeometry args={[0.15]} />
      </mesh>
      <mesh material={pillMat}>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
      </mesh>
      <mesh material={crystalMat}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const radius = 4 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#1B4FD8" transparent opacity={0.4} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 5] }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 0]} intensity={1.2} color="white" />
      <pointLight position={[2, 2, 2]} color="#38BDF8" intensity={1.5} />
      <pointLight position={[-2, -1, 1]} color="#0D9488" intensity={0.8} />

      <MedicalCross />
      <OrbitingIcons />
      <ParticleField />
    </Canvas>
  );
}
