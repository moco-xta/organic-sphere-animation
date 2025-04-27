'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

import './index.scss'

function Scene() {
  const { scene } = useThree()

  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const modelRef = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    if (!isLoaded) {
      const geometry = new THREE.IcosahedronGeometry(1, 100)
      // const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      })

      modelRef.current = new THREE.Mesh(geometry, material)
      modelRef.current.receiveShadow = true
      modelRef.current.castShadow = true

      scene.add(modelRef.current)

      setIsLoaded(true)
    }
  }, [scene, isLoaded])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    if (modelRef.current && modelRef.current.material instanceof THREE.ShaderMaterial) {
      modelRef.current.material.uniforms.uTime.value = time
    }
  })

  return null
}

export default function page() {
  return (
    <Canvas
      dpr={2}
      shadows
      gl={{ antialias: true, shadowMapEnabled: true, shadowMapType: THREE.PCFSoftShadowMap }}
    >
      <PerspectiveCamera
        makeDefault
        position={new THREE.Vector3(2, 2, 2)}
      />
      <OrbitControls />
      <ambientLight intensity={0.1} />

      <directionalLight
        position={new THREE.Vector3(-10, 10, 10)}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Scene />
    </Canvas>
  )
}
