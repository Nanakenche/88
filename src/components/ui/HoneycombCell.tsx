import { useState } from 'react'

interface HoneycombCellProps {
  message?: string
  author?: string
  timestamp?: string
  onClick?: () => void
  active?: boolean
}

export default function HoneycombCell({ 
  message = '', 
  author = 'Anonymous',
  timestamp = new Date().toLocaleTimeString(),
  onClick,
  active = false
}: HoneycombCellProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`
        relative w-32 h-36 cursor-pointer transition-all duration-300
        ${active ? 'scale-110 z-10' : 'scale-100'}
        ${isHovered ? 'scale-105' : ''}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hexagon shape */}
      <div 
        className={`
          honeycomb-clip w-full h-full
          bg-gradient-to-br from-honey-400 to-honey-600
          border-2 border-honey-300
          flex flex-col items-center justify-center
          p-4 text-center
          transition-all duration-300
          ${active || isHovered ? 'neon-glow shadow-2xl' : 'shadow-lg'}
        `}
        style={{
          boxShadow: active || isHovered 
            ? '0 0 20px #FFD700, 0 0 40px #FFA500, 0 0 60px #FF8C00'
            : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {message ? (
          <>
            <p className="text-xs font-semibold text-gray-800 mb-1 line-clamp-2">
              {message}
            </p>
            <p className="text-[10px] text-gray-600 mt-auto">{author}</p>
            <p className="text-[8px] text-gray-500">{timestamp}</p>
          </>
        ) : (
          <div className="text-2xl opacity-50">🐝</div>
        )}
      </div>

      {/* Glow effect when active */}
      {(active || isHovered) && (
        <div 
          className="absolute inset-0 honeycomb-clip animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  )
}
