import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import BeeModel from './components/3d/BeeModel'
import HiveEnvironment from './components/3d/HiveEnvironment'
import WaggleDance from './components/3d/WaggleDance'
import BeeSwarm from './components/3d/BeeSwarm'
import PollenParticles from './components/3d/PollenParticles'
import NectarLake from './components/3d/NectarLake'
import HoneycombChat from './components/ui/HoneycombChat'

function Scene() {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={75} />
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Environment */}
      <HiveEnvironment />
      
      {/* Stars background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />

      {/* Main bee swarm */}
      <BeeSwarm count={12} radius={6} position={[0, 0, 0]} />

      {/* Hero bee */}
      <BeeModel 
        position={[0, 1, 3]} 
        scale={2} 
        speed={0.8}
        path="figure8"
        color="#FFD700"
      />

      {/* Waggle dance demonstration */}
      <WaggleDance 
        position={[-4, 0, 2]} 
        message="Welcome to the Hive!"
        active={true}
      />

      {/* Pollen particles */}
      <PollenParticles count={150} position={[3, 2, 1]} explode={false} />
      <PollenParticles count={100} position={[-3, -1, 2]} explode={false} />

      {/* Nectar lake */}
      <NectarLake position={[0, -4, 0]} size={12} />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={1.5} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9}
        />
        <DepthOfField 
          focusDistance={0.01} 
          focalLength={0.05} 
          bokehScale={3}
        />
      </EffectComposer>
    </>
  )
}

function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <div className="text-8xl mb-6 animate-float">🐝</div>
        <h2 className="text-4xl font-bold text-honey-400 text-glow mb-4">
          Loading the Hive...
        </h2>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-honey-500 to-honey-600 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [showInfo, setShowInfo] = useState(true)

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      {/* 3D Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Loading screen overlay */}
      <Suspense fallback={<LoadingScreen />}>
        <div />
      </Suspense>

      {/* UI Overlay */}
      <HoneycombChat />

      {/* Welcome info */}
      {showInfo && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 max-w-2xl border border-honey-500/30 relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-honey-500/20 hover:bg-honey-500/40 
                       rounded-full flex items-center justify-center transition-all duration-300 text-honey-400"
            >
              ✕
            </button>
            <h1 className="text-4xl font-bold text-honey-400 text-glow mb-4 text-center">
              🐝 Welcome to BeeHive Communication Hub
            </h1>
            <p className="text-honey-100 text-center mb-4">
              Experience immersive 3D communication inspired by nature's most efficient messengers.
              Watch bees perform the waggle dance, explore the honeycomb message grid, and connect through video calls!
            </p>
            <div className="flex gap-4 justify-center text-sm text-honey-300">
              <div className="flex items-center gap-2">
                <span>🖱️</span>
                <span>Drag to rotate</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span>Scroll to zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span>Chat in real-time</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio toggle (placeholder) */}
      <button 
        className="absolute top-8 right-8 w-14 h-14 bg-honey-500/20 hover:bg-honey-500/40 
                 backdrop-blur-md rounded-full flex items-center justify-center 
                 transition-all duration-300 text-2xl border border-honey-500/30 z-40"
        title="Toggle ambient sounds"
      >
        🔊
      </button>

      {/* Credits */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-honey-700 text-sm">
        <p>🐝 Powered by Three.js & React Three Fiber</p>
      </div>
    </div>
  )
}
