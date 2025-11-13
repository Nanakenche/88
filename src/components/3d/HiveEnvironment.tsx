import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HoneycombCellProps {
  position: [number, number, number]
  color: string
  glowIntensity?: number
}

function HoneycombCell({ position, color, glowIntensity = 0.2 }: HoneycombCellProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const size = 0.5
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      const x = Math.cos(angle) * size
      const y = Math.sin(angle) * size
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3
    }
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.4,
    roughness: 0.3,
    emissive: color,
    emissiveIntensity: glowIntensity,
    transparent: true,
    opacity: 0.8
  }), [color, glowIntensity])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 
        glowIntensity + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} material={material} />
  )
}

export default function HiveEnvironment() {
  const groupRef = useRef<THREE.Group>(null)

  // Generate honeycomb grid
  const honeycombs = useMemo(() => {
    const cells: Array<{ position: [number, number, number]; color: string }> = []
    const rows = 8
    const cols = 12
    const hexWidth = 1
    const hexHeight = 0.866 * hexWidth

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexWidth * 1.5 - (cols * hexWidth * 1.5) / 2
        const y = row * hexHeight - (rows * hexHeight) / 2 + (col % 2) * (hexHeight / 2)
        const z = -5 + Math.random() * 0.5
        
        // Vary colors for visual interest
        const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FFAA00']
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        cells.push({ position: [x, y, z], color })
      }
    }
    return cells
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Honeycomb wall */}
      {honeycombs.map((cell, index) => (
        <HoneycombCell 
          key={index} 
          position={cell.position} 
          color={cell.color}
          glowIntensity={0.2 + Math.random() * 0.2}
        />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        color="#FFE4B5"
        castShadow
      />
      
      {/* Fill lights */}
      <pointLight position={[-10, 5, 5]} intensity={0.5} color="#FFA500" />
      <pointLight position={[10, -5, 5]} intensity={0.5} color="#FFD700" />
      
      {/* Rim light */}
      <spotLight
        position={[0, 10, -10]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#FFAA00"
      />

      {/* Fog for depth */}
      <fog attach="fog" args={['#1a0a00', 10, 30]} />
    </group>
  )
}
