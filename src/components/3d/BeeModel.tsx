import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BeeModelProps {
  position?: [number, number, number]
  scale?: number
  speed?: number
  path?: 'circle' | 'figure8' | 'waggle' | 'swarm'
  color?: string
}

export default function BeeModel({ 
  position = [0, 0, 0], 
  scale = 1, 
  speed = 1,
  path = 'circle',
  color = '#FFD700'
}: BeeModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const wingLeftRef = useRef<THREE.Mesh>(null)
  const wingRightRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  // Create bee geometry
  const beeGeometry = useMemo(() => {
    const body = new THREE.CapsuleGeometry(0.15, 0.4, 8, 16)
    return body
  }, [])

  const headGeometry = useMemo(() => new THREE.SphereGeometry(0.12, 16, 16), [])
  const eyeGeometry = useMemo(() => new THREE.SphereGeometry(0.03, 8, 8), [])
  const wingGeometry = useMemo(() => new THREE.PlaneGeometry(0.3, 0.5), [])
  const stingerGeometry = useMemo(() => new THREE.ConeGeometry(0.03, 0.15, 8), [])

  // Materials
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: color,
    metalness: 0.3,
    roughness: 0.4,
    emissive: color,
    emissiveIntensity: 0.2
  }), [color])

  const stripeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#000000',
    metalness: 0.2,
    roughness: 0.6
  }), [])

  const wingMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ 
    color: '#ffffff',
    transparent: true,
    opacity: 0.3,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.5
  }), [])

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#000000',
    metalness: 0.8,
    roughness: 0.2
  }), [])

  useFrame((_state, delta) => {
    time.current += delta * speed

    if (groupRef.current) {
      // Different flight paths
      switch (path) {
        case 'circle':
          groupRef.current.position.x = position[0] + Math.cos(time.current) * 2
          groupRef.current.position.y = position[1] + Math.sin(time.current * 0.5) * 0.5
          groupRef.current.position.z = position[2] + Math.sin(time.current) * 2
          groupRef.current.rotation.y = time.current
          break
        case 'figure8':
          groupRef.current.position.x = position[0] + Math.sin(time.current) * 3
          groupRef.current.position.y = position[1] + Math.sin(time.current * 2) * 1
          groupRef.current.position.z = position[2] + Math.cos(time.current) * 2
          groupRef.current.rotation.y = Math.sin(time.current) * 0.5
          break
        case 'waggle':
          groupRef.current.position.x = position[0] + Math.sin(time.current * 5) * 0.3
          groupRef.current.rotation.z = Math.sin(time.current * 5) * 0.3
          break
        case 'swarm':
          groupRef.current.position.x = position[0] + Math.sin(time.current * 2) * 0.5
          groupRef.current.position.y = position[1] + Math.cos(time.current * 3) * 0.5
          groupRef.current.position.z = position[2] + Math.sin(time.current * 1.5) * 0.5
          break
      }
    }

    // Wing flapping animation
    if (wingLeftRef.current && wingRightRef.current) {
      const flapAngle = Math.sin(time.current * 20) * 0.5
      wingLeftRef.current.rotation.y = -Math.PI / 4 + flapAngle
      wingRightRef.current.rotation.y = Math.PI / 4 - flapAngle
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh geometry={beeGeometry} material={bodyMaterial} rotation={[0, 0, Math.PI / 2]} />
      
      {/* Black stripes */}
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <primitive object={stripeMaterial} />
      </mesh>
      <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <primitive object={stripeMaterial} />
      </mesh>

      {/* Head */}
      <mesh geometry={headGeometry} material={bodyMaterial} position={[0.35, 0, 0]} />
      
      {/* Eyes */}
      <mesh geometry={eyeGeometry} material={eyeMaterial} position={[0.42, 0.06, 0.08]} />
      <mesh geometry={eyeGeometry} material={eyeMaterial} position={[0.42, 0.06, -0.08]} />

      {/* Antennae */}
      <mesh position={[0.4, 0.12, 0.05]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
        <primitive object={stripeMaterial} />
      </mesh>
      <mesh position={[0.4, 0.12, -0.05]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
        <primitive object={stripeMaterial} />
      </mesh>

      {/* Wings */}
      <mesh 
        ref={wingLeftRef}
        geometry={wingGeometry} 
        material={wingMaterial} 
        position={[0, 0.1, 0.2]}
        rotation={[0, -Math.PI / 4, 0]}
      />
      <mesh 
        ref={wingRightRef}
        geometry={wingGeometry} 
        material={wingMaterial} 
        position={[0, 0.1, -0.2]}
        rotation={[0, Math.PI / 4, 0]}
      />

      {/* Stinger */}
      <mesh 
        geometry={stingerGeometry} 
        material={stripeMaterial} 
        position={[-0.4, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      />

      {/* Point light for glow effect */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.5} 
        distance={2} 
        color={color}
      />
    </group>
  )
}
