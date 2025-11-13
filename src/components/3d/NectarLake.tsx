import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NectarLakeProps {
  position?: [number, number, number]
  size?: number
}

export default function NectarLake({ 
  position = [0, -3, 0], 
  size = 10 
}: NectarLakeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle wave animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }

    if (materialRef.current) {
      // Pulsing emissive effect
      materialRef.current.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group>
      {/* Main reflective surface */}
      <mesh 
        ref={meshRef}
        position={position} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[size, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#FFA500"
          metalness={0.9}
          roughness={0.1}
          emissive="#FF8C00"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Ripple effects */}
      {[1, 2, 3].map((ring, index) => (
        <mesh 
          key={index}
          position={[position[0], position[1] + 0.01, position[2]]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[size * 0.3 * ring, size * 0.3 * ring + 0.1, 32]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.2 - index * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Ambient glow underneath */}
      <pointLight 
        position={[position[0], position[1] - 1, position[2]]} 
        intensity={2} 
        distance={size * 2}
        color="#FFA500"
      />

      {/* Reflection helper - creates illusion of depth */}
      <mesh 
        position={[position[0], position[1] - 0.5, position[2]]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[size * 0.8, 64]} />
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
