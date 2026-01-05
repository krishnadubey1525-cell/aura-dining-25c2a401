import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating food-inspired abstract shapes
function FoodShape({ position, color, scale = 1, speed = 1 }: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.002 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// Sphere shapes for variety
function FloatingSphere({ position, color, scale = 1, speed = 1 }: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.001;
    }
  });

  return (
    <Float speed={speed * 0.8} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

// Diamond/gem shapes
function GemShape({ position, color, scale = 1, speed = 1 }: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005 * speed;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.05}
          metalness={1}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

// Particle field for ambiance
function ParticleField() {
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
      pointsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#D4A574"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Mouse-following camera effect
function CameraRig() {
  const { camera, mouse } = useThree();
  
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.3 + 2, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <CameraRig />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#FFD700"
        castShadow
      />
      <spotLight
        position={[-10, 5, -10]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#8B0000"
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFA500" />
      
      {/* Food-inspired shapes */}
      {/* Gold/amber tones - representing warmth and luxury */}
      <FoodShape position={[-3, 1, -2]} color="#D4A574" scale={0.8} speed={0.8} />
      <FloatingSphere position={[3.5, 0.5, -1]} color="#FFD700" scale={0.6} speed={1.2} />
      <GemShape position={[0, 2.5, -3]} color="#CD853F" scale={0.5} speed={0.6} />
      
      {/* Burgundy/wine tones */}
      <FoodShape position={[2, -0.5, 1]} color="#722F37" scale={0.7} speed={1} />
      <FloatingSphere position={[-2.5, 2, 0]} color="#8B0000" scale={0.5} speed={0.9} />
      
      {/* Cream/white accents */}
      <GemShape position={[-1, -1, 2]} color="#F5DEB3" scale={0.4} speed={1.1} />
      <FloatingSphere position={[1.5, 1.5, 2]} color="#FAEBD7" scale={0.35} speed={0.7} />
      
      {/* Additional decorative elements */}
      <FoodShape position={[4, 2, -2]} color="#B8860B" scale={0.45} speed={0.5} />
      <GemShape position={[-4, -0.5, -1]} color="#DAA520" scale={0.55} speed={0.8} />
      
      {/* Ambient particles */}
      <ParticleField />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
    </>
  );
}

// Fallback for non-WebGL browsers
function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 rounded-full bg-gradient-gold opacity-20 animate-pulse" />
        <div className="absolute inset-8 rounded-full bg-gradient-gold opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-16 rounded-full bg-secondary/40 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}

export default function HeroScene() {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <Fallback />;
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
