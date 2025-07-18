import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'

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

export default function Scene({ version }) {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Suspense fallback={null}>
        <Model version={version} key={version} />
      </Suspense>
    </Canvas>
  )
}
