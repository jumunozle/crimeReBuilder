import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
//import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import './Scene.css'

function Model({ version }) {
  const obj = useLoader(OBJLoader, `http://localhost:8000/get_obj?version=${version}`)
  const ref = useRef()

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(obj)
    const center = new THREE.Vector3()
    box.getCenter(center)
    obj.position.sub(center)
  }, [obj])

  return (
    <primitive
      ref={ref}
      object={obj}
      scale={[100000, 100000, 100000]}
      rotation={[0, Math.PI, 0]}
    />
  )
}


function SceneControls() {
  const [wireframe, setWireframe] = useState(false)
  
  return (
    <div className="scene-controls">
      <button 
        className="control-button"
        onClick={() => setWireframe(!wireframe)}
        title="Toggle Wireframe"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </button>
    </div>
  )
}

export default function Scene({ version }) {
  return (
    <div className="scene-wrapper">
      <div className="scene-header">
        <h3>Reconstrucción 3D</h3>
        <div className="scene-info">
          <span>Usa el mouse para navegar: rotar, hacer zoom y mover</span>
        </div>
      </div>
      
      <Canvas 
        className="scene-canvas"
        camera={{ position: [0, 2, 10], fov: 60 }}
        shadows
      >
        {/* Iluminación mejorada */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Controles de órbita con configuración mejorada */}
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={1}
          maxDistance={50}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        {/* Modelo 3D con loading */}
         {/* Suspense fallback={<LoadingSpinner />}>*/}
          <Model version={version} key={version} />
        {/* </Suspense>*/}
        

      </Canvas>
      
      <SceneControls />
    </div>
  )
}