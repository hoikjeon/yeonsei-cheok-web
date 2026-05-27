"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export function LiquidSphere() {
  const mainRef = useRef<THREE.Group>(null);
  const sat1Ref = useRef<THREE.Group>(null);
  const sat2Ref = useRef<THREE.Group>(null);
  const sat3Ref = useRef<THREE.Group>(null);
  
  const mainMatRef = useRef<any>(null);
  const sat1MatRef = useRef<any>(null);
  const sat2MatRef = useRef<any>(null);
  const sat3MatRef = useRef<any>(null);
  
  // Base relative layout positions
  const mainPos = [-0.3, 0, 0.5];
  const sat1Pos = [-1.58, 0.23, 0.2];
  const sat2Pos = [0.68, -0.75, 0.8];
  const sat3Pos = [1.35, -0.53, 0];

  useFrame((state) => {
    // 1. Mouse Tracking using native R3F pointer
    const targetX = state.pointer.x * (state.viewport.width / 2.5);
    const targetY = state.pointer.y * (state.viewport.height / 2.5);

    // 2. Smooth Position Tracking
    if (mainRef.current) {
      mainRef.current.position.x = THREE.MathUtils.lerp(mainRef.current.position.x, targetX + mainPos[0], 0.8);
      mainRef.current.position.y = THREE.MathUtils.lerp(mainRef.current.position.y, targetY + mainPos[1], 0.8);
    }
    if (sat1Ref.current) {
      sat1Ref.current.position.x = THREE.MathUtils.lerp(sat1Ref.current.position.x, targetX + sat1Pos[0], 0.15);
      sat1Ref.current.position.y = THREE.MathUtils.lerp(sat1Ref.current.position.y, targetY + sat1Pos[1], 0.15);
    }
    if (sat2Ref.current) {
      sat2Ref.current.position.x = THREE.MathUtils.lerp(sat2Ref.current.position.x, targetX + sat2Pos[0], 0.08);
      sat2Ref.current.position.y = THREE.MathUtils.lerp(sat2Ref.current.position.y, targetY + sat2Pos[1], 0.08);
    }
    if (sat3Ref.current) {
      sat3Ref.current.position.x = THREE.MathUtils.lerp(sat3Ref.current.position.x, targetX + sat3Pos[0], 0.04);
      sat3Ref.current.position.y = THREE.MathUtils.lerp(sat3Ref.current.position.y, targetY + sat3Pos[1], 0.04);
    }

    // 3. Internal Micro-Shimmer
    const time = state.clock.elapsedTime;
    const iorJitter = Math.sin(time * 60) * 0.0015; 
    const thickJitter = Math.cos(time * 65) * 0.025;

    if (mainMatRef.current) {
      mainMatRef.current.ior = 1.5 + iorJitter;
      mainMatRef.current.thickness = 4 + thickJitter;
    }
    if (sat1MatRef.current) {
      sat1MatRef.current.ior = 1.5 + iorJitter;
      sat1MatRef.current.thickness = 2 + thickJitter * 0.5;
    }
    if (sat2MatRef.current) {
      sat2MatRef.current.ior = 1.5 + iorJitter;
    }
    if (sat3MatRef.current) {
      sat3MatRef.current.ior = 1.5 + iorJitter;
    }
  });

  const materialProps = {
    transmission: 1, 
    roughness: 0,
    thickness: 3,
    ior: 1.5, 
    chromaticAberration: 0.05,
    backside: true, 
    resolution: 1024, 
    color: "#ffffff",
  };

  return (
    <group position={[0, 0, 1]}>
      {/* Main Large Sphere */}
      <group ref={mainRef} position={[mainPos[0], mainPos[1], mainPos[2]]}>
        <mesh>
          <sphereGeometry args={[0.72, 64, 64]} />
          <MeshTransmissionMaterial ref={mainMatRef} {...materialProps} thickness={4} />
        </mesh>
      </group>

      {/* Medium Sphere */}
      <group ref={sat1Ref} position={[sat1Pos[0], sat1Pos[1], sat1Pos[2]]}>
        <mesh>
          <sphereGeometry args={[0.36, 64, 64]} />
          <MeshTransmissionMaterial ref={sat1MatRef} {...materialProps} thickness={2} />
        </mesh>
      </group>

      {/* Small Sphere */}
      <group ref={sat2Ref} position={[sat2Pos[0], sat2Pos[1], sat2Pos[2]]}>
        <mesh>
          <sphereGeometry args={[0.26, 64, 64]} />
          <MeshTransmissionMaterial ref={sat2MatRef} {...materialProps} thickness={1.5} />
        </mesh>
      </group>
      
      {/* Tiny Sphere */}
      <group ref={sat3Ref} position={[sat3Pos[0], sat3Pos[1], sat3Pos[2]]}>
        <mesh>
          <sphereGeometry args={[0.1, 32, 32]} />
          <MeshTransmissionMaterial ref={sat3MatRef} {...materialProps} thickness={1} />
        </mesh>
      </group>
    </group>
  );
}
