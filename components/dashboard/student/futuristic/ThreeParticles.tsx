"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColor } from "@/hooks/useThemeColor";

function ParticleField({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null!);
  
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = time * 0.02;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.pointer.x * 2, 0.02);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, state.pointer.y * 2, 0.02);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

export default function ThreeParticles() {
  const primaryLight = useThemeColor("--color-primary-light");
  const bgDeep = useThemeColor("--color-bg-deep");
  const bgDark = useThemeColor("--color-background");
  const fogColor = useThemeColor("--color-fog");

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: -1,
      pointerEvents: "none",
      background: `radial-gradient(circle at 50% 50%, ${bgDark} 0%, ${bgDeep} 100%)`
    }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <fog attach="fog" args={[fogColor, 10, 50]} />
        <ambientLight intensity={0.5} />
        <ParticleField color={primaryLight} />
      </Canvas>
    </div>
  );
}
