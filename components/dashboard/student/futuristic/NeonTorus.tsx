"use client";

import React, { useRef } from "react";
import { Box } from "@mui/material";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColor } from "@/hooks/useThemeColor";
import styles from "./NeonTorus.module.css";

interface NeonTorusProps {
  score: number;
}

function GlowingTorus({ score }: NeonTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const successColor = useThemeColor("--color-success");
  const warningColor = useThemeColor("--color-warning");
  const errorColor = useThemeColor("--color-error");
  const surfaceColor = useThemeColor("--color-bg-dark");

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.2;
  });

  const arcLength = (score / 100) * Math.PI * 2;
  const neonColor = score > 80 ? successColor : score > 50 ? warningColor : errorColor;

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1.5, 0.4, 32, 100, arcLength]} />
        <MeshWobbleMaterial
          color={neonColor}
          factor={0.2}
          speed={2}
          emissive={neonColor}
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Background track */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.35, 16, 100, Math.PI * 2]} />
        <meshStandardMaterial
          color={surfaceColor}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function NeonTorus({ score }: NeonTorusProps) {
  return (
    <Box className={styles.container}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <GlowingTorus score={score} />
      </Canvas>
    </Box>
  );
}