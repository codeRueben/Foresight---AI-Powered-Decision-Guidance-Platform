import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbCoreProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function OrbCore({ mousePosition }: OrbCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Simple orb geometry - no heavy shaders
  const geometry = useMemo(() => new THREE.SphereGeometry(1.5, 64, 64), []);
  
  // Glow geometry
  const glowGeometry = useMemo(() => new THREE.SphereGeometry(2.2, 32, 32), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth mouse following
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mousePosition.current.y * 0.2,
        0.05
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -mousePosition.current.x * 0.1,
        0.05
      );
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y -= 0.001;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Main orb */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#4F6DFF"
          emissive="#1a2a6c"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh ref={glowRef} geometry={glowGeometry}>
        <meshBasicMaterial
          color="#4F6DFF"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer glow rings */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
          <torusGeometry args={[2.5 + i * 0.3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#4F6DFF" transparent opacity={0.3 - i * 0.1} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 50; // Reduced for performance

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
      
      vel[i3] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    
    return [pos, vel];
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positionArray[i3] += velocities[i3];
      positionArray[i3 + 1] += velocities[i3 + 1];
      positionArray[i3 + 2] += velocities[i3 + 2];
      
      // Gentle orbital motion
      const x = positionArray[i3];
      const z = positionArray[i3 + 2];
      positionArray[i3] = x * Math.cos(0.002) - z * Math.sin(0.002);
      positionArray[i3 + 2] = x * Math.sin(0.002) + z * Math.cos(0.002);
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#4F6DFF"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

interface Orb3DProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  className?: string;
}

export function Orb3D({ mousePosition, className = '' }: Orb3DProps) {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]} // Reduced for performance
        gl={{ 
          antialias: false, // Disabled for performance
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#4F6DFF" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7B9FFF" />
        <pointLight position={[0, 0, 10]} intensity={0.8} color="#ffffff" />
        
        <OrbCore mousePosition={mousePosition} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
