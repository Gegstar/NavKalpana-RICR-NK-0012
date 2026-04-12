"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Analytics3DObjectProps {
  color?: string;
  size?: number;
  active?: boolean;
}

function AnimatedSphere({ color, size = 1, active = false }: Analytics3DObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const defaultColor = useThemeColor("--color-primary");
  const activeColor = color || defaultColor;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (active) {
      meshRef.current.scale.setScalar(
        size * (1 + Math.sin(time * 3) * 0.05)
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[size, 64, 64]}>
        <MeshDistortMaterial
          color={activeColor}
          speed={active ? 4 : 2}
          distort={0.4}
          radius={1}
          metalness={0.8}
          roughness={0.2}
          emissive={activeColor}
          emissiveIntensity={active ? 1 : 0.5}
        />
      </Sphere>
    </Float>
  );
}

export default function Analytics3DObject({ color, size, active }: Analytics3DObjectProps) {
  return (
    <div style={{ width: "100%", height: "150px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <AnimatedSphere color={color} size={size} active={active} />
      </Canvas>
    </div>
  );
}
