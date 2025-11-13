import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PollenParticlesProps {
  count?: number
  position?: [number, number, number]
  explode?: boolean
}

export default function PollenParticles({ 
  count = 100, 
  position = [0, 0, 0],
  explode = false
}: PollenParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const velocitiesRef = useRef<Float32Array>()

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Initial positions in a sphere
      const radius = Math.random() * 0.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i3] = position[0] + radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = position[1] + radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = position[2] + radius * Math.cos(phi)

      // Velocities for explosion effect
      velocities[i3] = (Math.random() - 0.5) * 0.1
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.1
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1

      // Yellow/orange colors
      colors[i3] = 1.0
      colors[i3 + 1] = 0.6 + Math.random() * 0.4
      colors[i3 + 2] = 0.0

      // Random sizes
      sizes[i] = Math.random() * 0.1 + 0.05
    }

    velocitiesRef.current = velocities

    return { positions, colors, sizes }
  }, [count, position])

  useFrame((state, delta) => {
    if (pointsRef.current && velocitiesRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      const velocities = velocitiesRef.current

      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        if (explode) {
          // Explosion effect
          positions[i3] += velocities[i3]
          positions[i3 + 1] += velocities[i3 + 1]
          positions[i3 + 2] += velocities[i3 + 2]

          // Add gravity
          velocities[i3 + 1] -= delta * 0.5
        } else {
          // Floating effect
          positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.001
          positions[i3] += Math.cos(state.clock.elapsedTime + i) * 0.001
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      
      // Rotate the entire particle system
      pointsRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
