"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text, Lightformer, Html } from "@react-three/drei";
import { LiquidSphere } from "./LiquidSphere";
import { Suspense, useEffect, useState, useRef } from "react";
import * as THREE from "three";

// A rudimentary kerning map for uppercase Inter Black to simulate a continuous string while rendering distinct meshes
const charWidthMap: Record<string, number> = {
  "I": 0.3, " ": 0.3, "!": 0.35, "L": 0.55, "F": 0.55, "E": 0.6,
  "T": 0.65, "P": 0.65, "S": 0.65, "B": 0.65, "R": 0.65, "Y": 0.65, "K": 0.65,
  "D": 0.75, "G": 0.75, "C": 0.75, "N": 0.7, "H": 0.7, "U": 0.7, "A": 0.7,
  "O": 0.8, "M": 0.9, "W": 0.9
};

function ReactiveChar({ char, originX, originY, fontSize, color, baseOutlineColor }: { char: string, originX: number, originY: number, fontSize: number, color: string, baseOutlineColor: string }) {
  const ref = useRef<any>(null); 
  const isReady = useRef(false);

  // Bottom-to-Top Stagger: Lower lines appear first, cascading upwards
  const delay = 0.3 + (1.8 - originY) * 0.15;

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.elapsedTime;
    
    // --- PHASE 1: FADE-UP FROM BOTTOM ---
    if (!isReady.current) {
      if (time < delay) {
        return;
      }
      
      const elapsed = time - delay;
      const progress = Math.min(elapsed / 1.2, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      
      ref.current.position.y = originY - 1.5 * (1 - ease);
      ref.current.position.x = originX;
      ref.current.position.z = 0;
      
      if (ref.current.material) {
        ref.current.material.opacity = ease;
      }
      ref.current.fillOpacity = ease;
      
      if (progress >= 1) {
        ref.current.position.set(originX, originY, 0);
        if (ref.current.material) ref.current.material.opacity = 1;
        ref.current.fillOpacity = 1;
        isReady.current = true;
      }
      return;
    }

    // --- PHASE 2: INTERACTIVE HOVER BEHAVIOR ---
    const mouseX = state.pointer.x * (state.viewport.width / 2.5);
    const mouseY = state.pointer.y * (state.viewport.height / 2.5);
    
    const orgDistX = mouseX - originX; 
    const orgDistY = mouseY - originY;
    const distance = Math.sqrt(orgDistX * orgDistX + orgDistY * orgDistY);

    const maxDist = 2.0;

    if (distance < maxDist && distance > 0.01) {
      const force = Math.pow((maxDist - distance) / maxDist, 2);
      
      const pushX = (orgDistX / distance) * -0.26 * force; 
      const pushY = (orgDistY / distance) * -0.26 * force; 

      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, originX + pushX, 0.15);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, originY + pushY, 0.15);
      
      const targetScale = 1.0 + force * 0.15;
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.15));
      
      const targetRotation = Math.sin(originX * 10) * force * 0.15;
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotation, 0.15);

    } else {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, originX, 0.1);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, originY, 0.1);
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, 1, 0.1));
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1);
    }
  });

  return (
    <Text 
      ref={ref}
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf" 
      position={[originX, originY - 1.5, 0]} 
      fillOpacity={0}
      fontSize={fontSize} 
      letterSpacing={0} 
      color={color} 
      outlineWidth={0.02} 
      outlineBlur={0.03} 
      outlineColor={baseOutlineColor} 
      outlineOpacity={0.4}
    >
      {char}
    </Text>
  );
}

function ReactiveLine({ text, y, fontSize, color, baseOutlineColor }: { text: string, y: number, fontSize: number, color: string, baseOutlineColor: string }) {
  const chars = text.split("");
  
  let totalWidth = 0;
  const positions: number[] = [];
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const width = (charWidthMap[char] || 0.65) * fontSize;
    positions.push(totalWidth + width / 2);
    totalWidth += width;
  }
  
  const startX = -totalWidth / 2;

  return (
    <group>
      {chars.map((char, i) => {
        if (char === " ") return null;
        const originX = startX + positions[i];
        return (
          <ReactiveChar 
            key={`${i}-${char}`} 
            char={char} 
            originX={originX} 
            originY={y} 
            fontSize={fontSize} 
            color={color} 
            baseOutlineColor={baseOutlineColor} 
          />
        );
      })}
    </group>
  );
}

export function GlassSphereScene() {
  const [dpr, setDpr] = useState([1, 2]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setDpr([1, 1.5]);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-[#121212] overflow-hidden fixed top-0 left-0 z-0 text-white select-none touch-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        dpr={dpr as [number, number]}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      >
        <color attach="background" args={["#121212"]} />
        <ambientLight intensity={0.2} />
        
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          color="#ffffff" 
        />
        <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#4f4f4f" />
        
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} color="#ffffff" />
            <Lightformer form="circle" intensity={1} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} color="#cccccc" />
            <Lightformer form="circle" intensity={1} rotation-y={Math.PI / 2} position={[5, 1, -1]} scale={2} color="#eeeeee" />
            <Lightformer form="rect" intensity={0.5} rotation-x={Math.PI / 2} position={[0, -5, 0]} scale={10} color="#ffffff" />
          </group>
        </Environment>

        <Suspense fallback={<Html center><div className="text-white/50 text-sm tracking-widest">LOADING 3D...</div></Html>}>

          <group position={[0, 0, -2]}>
            <ReactiveLine text="DISTORTING!" y={1.8} fontSize={0.85} color="#b5b5b5" baseOutlineColor="#b5b5b5" />
            <ReactiveLine text="SKIES BEYOND" y={0.9} fontSize={0.8} color="#e6e6e6" baseOutlineColor="#e6e6e6" />
            <ReactiveLine text="THE LIMITS OF" y={0} fontSize={0.8} color="#e6e6e6" baseOutlineColor="#e6e6e6" />
            <ReactiveLine text="TYPOGRAPHIC" y={-0.9} fontSize={0.8} color="#e6e6e6" baseOutlineColor="#e6e6e6" />
            <ReactiveLine text="GLASS REFLECTION" y={-1.8} fontSize={0.8} color="#b5b5b5" baseOutlineColor="#b5b5b5" />
          </group>

          <LiquidSphere />

        </Suspense>
      </Canvas>
    </div>
  );
}
