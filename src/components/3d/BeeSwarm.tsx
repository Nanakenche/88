import { useMemo } from 'react'
import BeeModel from './BeeModel'

interface BeeSwarmProps {
  count?: number
  radius?: number
  position?: [number, number, number]
}

export default function BeeSwarm({ 
  count = 15, 
  radius = 5,
  position = [0, 0, 0]
}: BeeSwarmProps) {
  
  const bees = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const distance = radius * (0.5 + Math.random() * 0.5)
      const height = (Math.random() - 0.5) * 3
      
      return {
        id: i,
        position: [
          position[0] + Math.cos(angle) * distance,
          position[1] + height,
          position[2] + Math.sin(angle) * distance
        ] as [number, number, number],
        speed: 0.5 + Math.random() * 1,
        scale: 0.6 + Math.random() * 0.4,
        path: ['circle', 'figure8', 'swarm'][Math.floor(Math.random() * 3)] as 'circle' | 'figure8' | 'swarm',
        color: ['#FFD700', '#FFA500', '#FF8C00'][Math.floor(Math.random() * 3)]
      }
    })
  }, [count, radius, position])

  return (
    <group>
      {bees.map((bee) => (
        <BeeModel
          key={bee.id}
          position={bee.position}
          scale={bee.scale}
          speed={bee.speed}
          path={bee.path}
          color={bee.color}
        />
      ))}
    </group>
  )
}
