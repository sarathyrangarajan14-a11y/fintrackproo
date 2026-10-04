import { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function DeconstructingEcosystem() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null); // Blue / Large-Cap
  const ring2 = useRef<THREE.Mesh>(null); // Emerald / Mid-Cap
  const ring3 = useRef<THREE.Mesh>(null); // Amber / Flexi-Cap
  const ring4 = useRef<THREE.Mesh>(null); // Platinum / Liquid Debt
  const particlesRef = useRef<THREE.Points>(null);
  const gridRef = useRef<THREE.GridHelper>(null);

  // 600 Compounding Kinetic Particles
  const particlePositions = useMemo(() => {
    const coords = new Float32Array(600 * 3);
    for (let i = 0; i < 600 * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 20;
      coords[i + 1] = (Math.random() - 0.5) * 20;
      coords[i + 2] = (Math.random() - 0.5) * 20;
    }
    return coords;
  }, []);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#full-page-scroll-root',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // 0% -> 25% (Top Section): Subtle rotation & expansion
      if (coreRef.current) {
        tl.to(coreRef.current.rotation, { y: Math.PI, x: 0.2, duration: 2 }, 0);
      }
        
      // 25% -> 50% (Upper Mid): Core implodes, 4 Glass Rings explode outward to screen perimeters
      if (coreRef.current) {
        tl.to(coreRef.current.scale, { x: 0.05, y: 0.05, z: 0.05, duration: 2 }, 0.2);
      }
      if (ring1.current) {
        tl.to(ring1.current.position, { x: -3.8, y: 2.2, z: 1.5, duration: 3, ease: 'power2.out' }, 0.22)
          .to(ring1.current.rotation, { x: 1.2, y: 0.8, z: 0.4, duration: 3 }, 0.22);
      }
      if (ring2.current) {
        tl.to(ring2.current.position, { x: 3.8, y: 1.8, z: -0.8, duration: 3, ease: 'power2.out' }, 0.24)
          .to(ring2.current.rotation, { x: -0.9, y: 1.2, z: -0.5, duration: 3 }, 0.24);
      }
      if (ring3.current) {
        tl.to(ring3.current.position, { x: -3.4, y: -2.4, z: 1.0, duration: 3, ease: 'power2.out' }, 0.26)
          .to(ring3.current.rotation, { x: 1.4, y: -0.6, z: 0.9, duration: 3 }, 0.26);
      }
      if (ring4.current) {
        tl.to(ring4.current.position, { x: 3.5, y: -2.2, z: -1.2, duration: 3, ease: 'power2.out' }, 0.28)
          .to(ring4.current.rotation, { x: -0.6, y: -1.4, z: 0.7, duration: 3 }, 0.28);
      }

      // 50% -> 75% (Lower Mid): Rings realign into an ascending Compounding Spiral
      const ringPositions = [];
      if (ring1.current) ringPositions.push(ring1.current.position);
      if (ring2.current) ringPositions.push(ring2.current.position);
      if (ring3.current) ringPositions.push(ring3.current.position);
      if (ring4.current) ringPositions.push(ring4.current.position);

      if (ringPositions.length > 0) {
        tl.to(ringPositions, {
          x: 0,
          duration: 3,
          ease: 'power3.inOut'
        }, 0.52);
      }

      if (ring1.current) tl.to(ring1.current.position, { y: 2.5, z: 0.2, duration: 3 }, 0.52);
      if (ring2.current) tl.to(ring2.current.position, { y: 0.9, z: 0.6, duration: 3 }, 0.52);
      if (ring3.current) tl.to(ring3.current.position, { y: -0.8, z: -0.2, duration: 3 }, 0.52);
      if (ring4.current) tl.to(ring4.current.position, { y: -2.4, z: -0.8, duration: 3 }, 0.52);

      const ringRotations = [];
      if (ring1.current) ringRotations.push(ring1.current.rotation);
      if (ring2.current) ringRotations.push(ring2.current.rotation);
      if (ring3.current) ringRotations.push(ring3.current.rotation);
      if (ring4.current) ringRotations.push(ring4.current.rotation);

      if (ringRotations.length > 0) {
        tl.to(ringRotations, {
          x: Math.PI / 2.5,
          y: Math.PI * 2,
          duration: 3
        }, 0.52);
      }

      // 75% -> 100% (Bottom Footer): Geometry docks into a wide glowing horizon grid
      if (groupRef.current) {
        tl.to(groupRef.current.position, { y: -1.5, z: -4.5, duration: 2.5, ease: 'power2.inOut' }, 0.75)
          .to(groupRef.current.rotation, { x: 0.6, y: Math.PI * 3, duration: 3 }, 0.75);
      }
      if (gridRef.current) {
        tl.to(gridRef.current.position, { y: -3.5, duration: 2.5 }, 0.75);
      }
    });

    return () => ctx.revert();
  }, []);

  // Ambient floating physics loop
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
      particlesRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Solid Obsidian Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.4, 4]} />
        <meshStandardMaterial color="#050811" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Ring 1: Sapphire Glass (Large-Cap) */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.8, 0.12, 32, 100]} />
        <meshPhysicalMaterial
          color="#0066FF"
          emissive="#002277"
          emissiveIntensity={0.6}
          transmission={0.85}
          roughness={0.08}
          metalness={0.25}
          thickness={1.4}
        />
      </mesh>

      {/* Ring 2: Emerald Glass (Mid-Cap Alpha) */}
      <mesh ref={ring2}>
        <torusGeometry args={[1.45, 0.1, 32, 100]} />
        <meshPhysicalMaterial
          color="#00E599"
          emissive="#006633"
          emissiveIntensity={0.6}
          transmission={0.85}
          roughness={0.1}
          metalness={0.2}
          thickness={1.1}
        />
      </mesh>

      {/* Ring 3: Amber Gold Glass (Flexi-Cap) */}
      <mesh ref={ring3}>
        <torusGeometry args={[1.1, 0.08, 32, 100]} />
        <meshPhysicalMaterial
          color="#FFB800"
          emissive="#996600"
          emissiveIntensity={0.5}
          transmission={0.8}
          roughness={0.12}
          metalness={0.3}
          thickness={0.9}
        />
      </mesh>

      {/* Ring 4: Platinum Liquid Shield */}
      <mesh ref={ring4}>
        <torusGeometry args={[0.75, 0.07, 32, 100]} />
        <meshPhysicalMaterial
          color="#F8FAFC"
          emissive="#CBD5E1"
          emissiveIntensity={0.3}
          transmission={0.4}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Compounding Kinetic Micro-Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.032} color="#38BDF8" transparent opacity={0.65} />
      </points>

      {/* Horizon Baseline Grid */}
      <gridHelper
        ref={gridRef}
        args={[30, 30, '#0066FF', '#1e293b']}
        position={[0, -6, 0]}
      />
    </group>
  );
}

export default function FullPage3DCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2.8} color="#FFFFFF" />
        <pointLight position={[-8, -8, -4]} intensity={3.5} color="#0055FF" />
        <pointLight position={[0, 6, 2]} intensity={2.2} color="#00FFAA" />
        <pointLight position={[6, -4, 3]} intensity={2.0} color="#FFB800" />

        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.3}>
          <DeconstructingEcosystem />
        </Float>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
