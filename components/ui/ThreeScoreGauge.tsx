"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function GlowingTorus({ score }: { score: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Calculate arc based on score (e.g., 85 = 85%)
  // The TorusGeometry takes arc length as the 4th parameter (default Math.PI * 2)
  const arcLength = (score / 100) * Math.PI * 2;

  // Emissive color based on score
  const neonColor = score > 80 ? "#10b981" : score > 50 ? "#eab308" : "#ef4444";

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.4, 32, 100, arcLength]} />
        <meshStandardMaterial 
          color={neonColor} 
          emissive={neonColor}
          emissiveIntensity={2} 
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>
      
      {/* Dim track for the remaining percentage */}
      <mesh position={[0, 0, -0.05]}>
         <torusGeometry args={[1.5, 0.3, 16, 100, Math.PI * 2 - arcLength]} />
         <meshStandardMaterial 
           color="#334155" 
           transparent 
           opacity={0.3}
         />
         {/* Rotate it so it starts where the main torus ends */}
         <group rotation={[0, 0, arcLength]} /> 
      </mesh>

       <ambientLight intensity={0.5} />
       <directionalLight position={[10, 10, 10]} intensity={1} />
    </Float>
  );
}

export default function ThreeScoreGauge({ score }: { score: number }) {
  return (
    <div style={{ width: "100%", height: "200px" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <GlowingTorus score={score} />
      </Canvas>
    </div>
  );
}
