import React, { useRef, useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three-stdlib'

export default function CrimeSceneModel({ url }) {
  const obj = useLoader(OBJLoader, url)

  return (
    <primitive object={obj} />
  )
}