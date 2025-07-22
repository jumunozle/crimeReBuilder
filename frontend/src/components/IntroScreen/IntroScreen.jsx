import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Componente para cargar y mostrar un modelo GLB
function GLBObject({ modelPath, initialPosition, targetPosition, isAssembling, onAssembled, scale = 1, uniformSize = 1 }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [currentPosition, setCurrentPosition] = useState(new THREE.Vector3(...initialPosition));
  const [assembled, setAssembled] = useState(false);
  const [normalizedScale, setNormalizedScale] = useState(scale);
  
  // Cargar el modelo GLB
  const { scene } = useGLTF(modelPath);
  
  // Calcular el tamaño uniforme cuando el modelo se carga
  useEffect(() => {
    if (scene && groupRef.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      
      const targetSize = uniformSize;
      const calculatedScale = targetSize / maxDimension;
      setNormalizedScale(calculatedScale);
    }
  }, [scene, uniformSize]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Rotación constante más suave
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
      
      if (isAssembling && !assembled) {
        const target = new THREE.Vector3(...targetPosition);
        currentPosition.lerp(target, 0.08);
        meshRef.current.position.copy(currentPosition);
        
        const distance = currentPosition.distanceTo(target);
        if (distance < 0.3 && !assembled) {
          setAssembled(true);
          onAssembled && onAssembled();
        }
      } else if (!isAssembling && assembled) {
        // Alejar los objetos del centro cuando se quedan quietos
        const dispersePosition = new THREE.Vector3(
          initialPosition[0] * 1.5, // Más lejos del centro
          initialPosition[1] * 1.5,
          initialPosition[2] * 1.5
        );
        currentPosition.lerp(dispersePosition, 0.06);
        meshRef.current.position.copy(currentPosition);
        
        const distance = currentPosition.distanceTo(dispersePosition);
        if (distance < 0.3) {
          setAssembled(false);
        }
      }
      
      // Flotación más sutil cuando está ensamblado
      if (assembled) {
        meshRef.current.position.y = targetPosition[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      }
      
      // Efectos de material mejorados
      meshRef.current.traverse((child) => {
        if (child.isMesh) {
          if (assembled) {
            child.material.emissive = new THREE.Color('#1a4a6b');
            child.material.emissiveIntensity = 0.2;
          } else {
            child.material.emissive = new THREE.Color('#0d2438');
            child.material.emissiveIntensity = 0.05;
          }
        }
      });
    }
  });
  
  return (
    <group ref={meshRef}>
      <group ref={groupRef} scale={[normalizedScale, normalizedScale, normalizedScale]}>
        <primitive object={scene.clone()} />
      </group>
    </group>
  );
}

// Componente de carga mejorado
function LoadingFallback({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial 
          color="#3498db" 
          emissive="#1a4a6b" 
          emissiveIntensity={0.2}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Efecto de partículas mejorado con mayor dispersión
function AssemblyEffect({ isActive, center = [0, 0, 0] }) {
  const particlesRef = useRef();
  const particleCount = 150;
  
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    // Mayor radio para más dispersión
    const radius = Math.random() * 5 + 2; // Era 3 + 1, ahora es 5 + 2
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i * 3] = center[0] + radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = center[1] + radius * Math.cos(phi);
    positions[i * 3 + 2] = center[2] + radius * Math.sin(phi) * Math.sin(theta);
    
    // Velocidades más altas para mayor dispersión
    velocities[i * 3] = (Math.random() - 0.5) * 0.08; // Era 0.05
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    
    sizes[i] = Math.random() * 0.2 + 0.08;
  }
  
  useFrame((state) => {
    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] + Math.sin(time + i * 0.1) * 0.015; // Mayor movimiento
        positions[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time + i * 0.1) * 0.015;
        positions[i * 3 + 2] += velocities[i * 3 + 2];
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y += 0.01;
    }
  });
  
  if (!isActive) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color="#1a4a6b" 
        transparent 
        opacity={0.9}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Detector de movimiento del mouse
function MouseTracker({ onMouseMove, onMouseStop }) {
  const { camera, gl } = useThree();
  const mouseRef = useRef(new THREE.Vector2());
  const lastMoveTime = useRef(Date.now());
  
  useEffect(() => {
    let timeoutId;
    
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
      
      lastMoveTime.current = Date.now();
      onMouseMove && onMouseMove(mouseRef.current);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onMouseStop && onMouseStop();
      }, 1500);
    };
    
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [gl, onMouseMove, onMouseStop]);
  
  return null;
}

export default function IntroScreen({ onStart }) {
  const [isAssembling, setIsAssembling] = useState(false);
  const [assembledCount, setAssembledCount] = useState(0);
  const [showEffect, setShowEffect] = useState(false);
  const [mouseActivity, setMouseActivity] = useState(0);

  // Objetos con mejor espaciado y distribución
  const objects = [
    {
      modelPath: '/src/assets/objects/gun_fps_hand.glb',
      initial: [-12, 4, -6],
      target: [-2.5, 1.5, -1],
      label: 'Arma de Fuego',
      uniformSize: 1.2
    },
    {
      modelPath: '/src/assets/objects/magnifying_glass.glb',
      initial: [12, -3, 4],
      target: [2.5, -1, 1],
      label: 'Lupa Forense',
      uniformSize: 1.2
    },
    {
      modelPath: '/src/assets/objects/beaker.glb',
      initial: [-8, -6, 3],
      target: [-1.5, -2, 2],
      label: 'Vaso de Precipitado',
      uniformSize: 1.2
    },
    {
      modelPath: '/src/assets/objects/dna.glb',
      initial: [15, 12, -8],
      target: [1.5, 2.5, -2],
      label: 'ADN',
      uniformSize: 1.5
    },
    {
      modelPath: '/src/assets/objects/microscope.glb',
      initial: [8, -10, 5],
      target: [3, -2.5, 0.5],
      label: 'Microscope',
      uniformSize: 1.2
    },
    {
      modelPath: '/src/assets/objects/crime_scene_card.glb',
      initial: [-15, -10, -12],
      target: [-3, -0.5, -3],
      label: 'Inspection Card',
      uniformSize: 1.2
    }
  ];

  const handleMouseMove = (mousePos) => {
    const activity = Math.abs(mousePos.x) + Math.abs(mousePos.y);
    setMouseActivity(activity);

    if (activity > 0.3 && !isAssembling) {
      setIsAssembling(true);
      setAssembledCount(0);
      setShowEffect(true);
    }
  };

  const handleMouseStop = () => {
    setIsAssembling(false);
    setAssembledCount(0);
    setShowEffect(false);
  };

  const handleObjectAssembled = () => {
    const newCount = assembledCount + 1;
    setAssembledCount(newCount);
  };

  const handleStartReconstruction = () => {
    console.log("Iniciando reconstrucción completa...");
    onStart && onStart();
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[10, 10, 8]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-10, -5, 5]} intensity={0.4} color="#3498db" />
        <pointLight position={[0, 0, 0]} color="#3498db" intensity={isAssembling ? 1.5 : 0.3} />

        <MouseTracker onMouseMove={handleMouseMove} onMouseStop={handleMouseStop} />

        <Suspense fallback={objects.map((obj, index) => (
          <LoadingFallback key={`loading-${index}`} position={obj.initial} />
        ))}>
          {objects.map((obj, index) => (
            <GLBObject
              key={index}
              modelPath={obj.modelPath}
              initialPosition={obj.initial}
              targetPosition={obj.target}
              isAssembling={isAssembling}
              onAssembled={handleObjectAssembled}
              uniformSize={obj.uniformSize}
            />
          ))}
        </Suspense>

        <AssemblyEffect isActive={showEffect && isAssembling} center={[0, 0, 0]} />

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={25}
          autoRotate={!isAssembling}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Título clickeable sin esperar */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#2c3e50',
        cursor: 'pointer'
      }}
      onClick={handleStartReconstruction}
      >
        <h1 style={{
          fontSize: '2.8rem',
          margin: '0 0 10px 0',
          background: 'linear-gradient(45deg, #00ff88, #0088ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          transition: 'transform 0.3s ease',
        }}>
          CrimeReBuilder
        </h1>
        <p style={{
          fontSize: '1.3rem',
          margin: '0',
          color: '#5d6d7e',
          fontWeight: '400'
        }}>
          Sistema de Reconstrucción Forense 3D
        </p>
      </div>
    </div>
  );
}