"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColor } from "@/hooks/useThemeColor";

function WavePoints({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null!);
  
  const count = 40;
  const spacing = 1.5;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * count * 3);
    let i = 0;
    for (let x = 0; x < count; x++) {
      for (let z = 0; z < count; z++) {
        pos[i++] = (x - count / 2) * spacing;
        pos[i++] = 0;
        pos[i++] = (z - count / 2) * spacing;
      }
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const posAttribute = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    
    for (let i = 0; i < count * count; i++) {
      const x = posAttribute.getX(i);
      const z = posAttribute.getZ(i);
      const y = Math.sin(x * 0.3 + time) * 0.5 + Math.cos(z * 0.3 + time) * 0.5;
      posAttribute.setY(i, y);
    }
    posAttribute.needsUpdate = true;
    ref.current.rotation.y = time * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  const primaryColor = useThemeColor("--color-primary");
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
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        <fog attach="fog" args={[fogColor, 10, 50]} />
        <ambientLight intensity={0.5} />
        <WavePoints color={primaryColor} />
      </Canvas>
    </div>
  );
}
