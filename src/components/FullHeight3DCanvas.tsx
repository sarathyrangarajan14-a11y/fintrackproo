import React, { Component, ReactNode, Suspense, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

// Error Boundary specifically to ensure iPad/WebKit WebGL failures NEVER blank the webpage
class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('WebGL / ThreeJS render warning (safe fallback enabled):', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#030712] via-[#0b132b]/40 to-[#030712]" />
      );
    }
    return this.props.children;
  }
}

function ContinuousWealthMatrix() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null); // Large-Cap Sapphire
  const ring2 = useRef<THREE.Mesh>(null); // Mid-Cap Emerald
  const ring3 = useRef<THREE.Mesh>(null); // Multi-Cap Gold
  const ring4 = useRef<THREE.Mesh>(null); // Liquid Platinum
  const particlesRef = useRef<THREE.Points>(null);
  const gridFloorRef = useRef<THREE.GridHelper>(null);

  // 800 Procedural Compounding Wealth Stream Particles (optimized for iPad 9 / mobile GPUs)
  const particleCount = 800;
  const particlePositions = useMemo(() => {
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 24;
      coords[i + 1] = (Math.random() - 0.5) * 24;
      coords[i + 2] = (Math.random() - 0.5) * 24;
    }
    return coords;
  }, []);

  // Frame-by-frame exact scroll calculation spanning 0.0 (top) to 1.0 (bottom)
  useFrame((state, delta) => {
    if (typeof window === 'undefined') return;

    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
    const innerHeight = window.innerHeight || 800;
    const maxScroll = scrollHeight - innerHeight;
    const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;

    // 1. Group Global Transform (Follows user throughout whole page journey)
    if (groupRef.current) {
      groupRef.current.rotation.y = progress * Math.PI * 3 + state.clock.getElapsedTime() * 0.08;
      groupRef.current.position.z = THREE.MathUtils.lerp(0, -2.5, progress);
      groupRef.current.position.y = THREE.MathUtils.lerp(0.3, -0.8, progress);
    }

    // 2. Central Core: High-gloss vault at top -> Disperses smoothly
    if (coreRef.current) {
      const coreScale = Math.max(1.35 * (1 - progress * 2.0), 0.08);
      coreRef.current.scale.set(coreScale, coreScale, coreScale);
      coreRef.current.rotation.x += delta * 0.35;
      coreRef.current.rotation.y += delta * 0.25;
    }

    // 3. Four Mutual Fund Asset Rings (Separate in mid-scroll -> Dock at footer)
    const separationFactor = Math.sin(progress * Math.PI); // Peaks at 50% scroll

    if (ring1.current) {
      ring1.current.position.x = -3.2 * separationFactor;
      ring1.current.position.y = THREE.MathUtils.lerp(1.6, 2.0, progress);
      ring1.current.position.z = 1.0 * separationFactor;
      ring1.current.rotation.x = progress * Math.PI * 2;
    }

    if (ring2.current) {
      ring2.current.position.x = 3.2 * separationFactor;
      ring2.current.position.y = THREE.MathUtils.lerp(0.7, 0.6, progress);
      ring2.current.position.z = -0.8 * separationFactor;
      ring2.current.rotation.y = progress * Math.PI * 2;
    }

    if (ring3.current) {
      ring3.current.position.x = -2.8 * separationFactor;
      ring3.current.position.y = THREE.MathUtils.lerp(-0.7, -0.7, progress);
      ring3.current.position.z = 0.7 * separationFactor;
      ring3.current.rotation.z = progress * Math.PI * 2;
    }

    if (ring4.current) {
      ring4.current.position.x = 2.8 * separationFactor;
      ring4.current.position.y = THREE.MathUtils.lerp(-1.6, -2.0, progress);
      ring4.current.position.z = -1.0 * separationFactor;
    }

    // 4. Particle Kinetic Orbit
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * (0.04 + progress * 0.15);
      particlesRef.current.rotation.x += delta * 0.015;
    }

    // 5. Grid Floor Rises Seamlessly into Footer
    if (gridFloorRef.current) {
      gridFloorRef.current.position.y = THREE.MathUtils.lerp(-5.5, -2.8, progress);
      gridFloorRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.25, progress);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Solid Obsidian Vault Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 3]} />
        <meshStandardMaterial
          color="#060c1c"
          metalness={0.9}
          roughness={0.15}
          emissive="#001a44"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Layer 1: Large-Cap Stability (Sapphire Gloss Ring) */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.75, 0.09, 24, 64]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#1d4ed8"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Layer 2: Mid-Cap Multipliers (Emerald Alpha Ring) */}
      <mesh ref={ring2}>
        <torusGeometry args={[1.4, 0.08, 24, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Layer 3: Multi-Cap / Flexi Growth (Amber Gold Ring) */}
      <mesh ref={ring3}>
        <torusGeometry args={[1.05, 0.07, 24, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Layer 4: Liquid Debt Safety Shield (Platinum Shield) */}
      <mesh ref={ring4}>
        <torusGeometry args={[0.7, 0.06, 24, 64]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#94a3b8"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.95}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Kinetic Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#38bdf8"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* 3D Horizon Grid (Locks at Footer) */}
      <gridHelper
        ref={gridFloorRef}
        args={[32, 32, '#2563eb', '#1e293b']}
        position={[0, -5.5, 0]}
      />
    </group>
  );
}

export default function FullHeight3DCanvas() {
  const [canRenderWebGL, setCanRenderWebGL] = useState(true);

  useEffect(() => {
    // Quick test if WebGL context is available on this device
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setCanRenderWebGL(false);
      }
    } catch {
      setCanRenderWebGL(false);
    }
  }, []);

  if (!canRenderWebGL) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#030712] via-[#0b132b]/40 to-[#030712]" />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <WebGLErrorBoundary>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 45 }}
            dpr={[1, 2]} // Capped at 2x for iPad retina performance
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'default',
            }}
            className="w-full h-full"
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
            <pointLight position={[-8, -8, -4]} intensity={3.0} color="#2563eb" />
            <pointLight position={[0, 6, 2]} intensity={2.2} color="#10b981" />
            <pointLight position={[6, -4, 3]} intensity={2.0} color="#f59e0b" />

            <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.25}>
              <ContinuousWealthMatrix />
            </Float>
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>
    </div>
  );
}
