import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BeeModel from './BeeModel'

interface WaggleDanceProps {
  position?: [number, number, number]
  message?: string
  active?: boolean
}

export default function WaggleDance({ 
  position = [0, 0, 0], 
  message = '',
  active = false 
}: WaggleDanceProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [trailPoints, setTrailPoints] = useState<THREE.Vector3[]>([])
  const trailRef = useRef<THREE.Line>(null)

  useEffect(() => {
    if (active && message) {
      // Create trail based on message
      const points: THREE.Vector3[] = []
      const messageLength = message.length
      
      for (let i = 0; i < messageLength * 5; i++) {
        const t = i / (messageLength * 5)
        const x = Math.sin(t * Math.PI * 4) * 2
        const y = t * 3 - 1.5
        const z = Math.cos(t * Math.PI * 2) * 0.5
        points.push(new THREE.Vector3(x, y, z))
      }
      
      setTrailPoints(points)
    }
  }, [message, active])

  useFrame((state) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2
    }

    if (trailRef.current) {
      const material = trailRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Dancing bee */}
      {active && (
        <BeeModel 
          position={[0, 0, 0]} 
          scale={1.5} 
          speed={2}
          path="waggle"
          color="#FFD700"
        />
      )}

      {/* Waggle dance trail */}
      {trailPoints.length > 0 && (
        <line ref={trailRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={trailPoints.length}
              array={new Float32Array(trailPoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.5}
            linewidth={3}
          />
        </line>
      )}

      {/* Glowing particles along the dance path */}
      {active && trailPoints.map((point, index) => (
        index % 3 === 0 && (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
            <pointLight 
              intensity={0.3} 
              distance={1} 
              color="#FFD700"
            />
          </mesh>
        )
      ))}

      {/* Message visualization - glowing honeycombs */}
      {active && message && (
        <group position={[3, 0, 0]}>
          {message.split('').map((char, index) => (
            <mesh 
              key={index} 
              position={[
                Math.floor(index / 5) * 0.8,
                (index % 5) * 0.8 - 2,
                0
              ]}
            >
              <cylinderGeometry args={[0.3, 0.3, 0.1, 6]} />
              <meshStandardMaterial
                color="#FFA500"
                emissive="#FFA500"
                emissiveIntensity={0.5 + Math.sin(Date.now() * 0.001 + index) * 0.3}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}
