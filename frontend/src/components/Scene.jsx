import React, { Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

function Model() {
  const obj = useLoader(OBJLoader, './models/resultado.obj')

  return (
    <primitive 
  object={obj} 
  scale={[100000, 100000, 100000]}
  rotation={[0, Math.PI, 0]}
/>

  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  )
}
