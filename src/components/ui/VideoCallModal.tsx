import { useState, useEffect } from 'react'

interface VideoCallModalProps {
  onClose: () => void
}

export default function VideoCallModal({ onClose }: VideoCallModalProps) {
  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsConnecting(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-[90vw] max-w-5xl h-[80vh] bg-gradient-to-br from-gray-900 to-black rounded-3xl border-2 border-honey-500 overflow-hidden neon-glow">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500/80 hover:bg-red-600 
                   rounded-full flex items-center justify-center transition-all duration-300
                   text-white font-bold text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
          <h2 className="text-3xl font-bold text-honey-400 text-glow flex items-center gap-3">
            🐝 Hive Video Call
            {isConnecting && (
              <span className="text-sm text-honey-600 animate-pulse">Connecting...</span>
            )}
          </h2>
        </div>

        {/* Main video area */}
        <div className="w-full h-full flex items-center justify-center p-20">
          {isConnecting ? (
            <div className="text-center">
              <div className="w-32 h-32 border-8 border-honey-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-2xl text-honey-400 font-semibold">Summoning the swarm...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 w-full h-full">
              {/* Remote participant */}
              <div className="relative bg-gradient-to-br from-honey-900/30 to-hive-900/30 rounded-2xl border-2 border-honey-500/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-honey-500 to-honey-600 rounded-full 
                                  flex items-center justify-center text-6xl mb-4 animate-float">
                      🐝
                    </div>
                    <p className="text-xl font-semibold text-honey-400">Queen Bee</p>
                    <p className="text-sm text-honey-600">Connected</p>
                  </div>
                </div>
                {/* Honeycomb overlay effect */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 50px,
                    #FFD700 50px,
                    #FFD700 51px
                  ),
                  repeating-linear-gradient(
                    60deg,
                    transparent,
                    transparent 50px,
                    #FFD700 50px,
                    #FFD700 51px
                  ),
                  repeating-linear-gradient(
                    120deg,
                    transparent,
                    transparent 50px,
                    #FFD700 50px,
                    #FFD700 51px
                  )`
                }}></div>
              </div>

              {/* Local participant (you) */}
              <div className="relative bg-gradient-to-br from-hive-900/30 to-honey-900/30 rounded-2xl border-2 border-hive-500/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-hive-500 to-hive-600 rounded-full 
                                  flex items-center justify-center text-6xl mb-4 animate-float"
                         style={{ animationDelay: '0.5s' }}>
                      👤
                    </div>
                    <p className="text-xl font-semibold text-hive-400">You</p>
                    <p className="text-sm text-hive-600">Connected</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  LIVE
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <div className="flex items-center justify-center gap-4">
            <button className="w-14 h-14 bg-honey-500 hover:bg-honey-600 rounded-full 
                             flex items-center justify-center transition-all duration-300 text-2xl">
              🎤
            </button>
            <button className="w-14 h-14 bg-honey-500 hover:bg-honey-600 rounded-full 
                             flex items-center justify-center transition-all duration-300 text-2xl">
              📹
            </button>
            <button className="w-14 h-14 bg-hive-500 hover:bg-hive-600 rounded-full 
                             flex items-center justify-center transition-all duration-300 text-2xl">
              🖥️
            </button>
            <button 
              onClick={onClose}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full 
                       flex items-center justify-center transition-all duration-300 text-2xl">
              📞
            </button>
          </div>
        </div>

        {/* Decorative bee particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                opacity: 0.3
              }}
            >
              🐝
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
