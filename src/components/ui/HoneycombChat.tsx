import { useState } from 'react'
import HoneycombCell from './HoneycombCell'
import VideoCallModal from './VideoCallModal'

interface Message {
  id: number
  text: string
  author: string
  timestamp: string
}

export default function HoneycombChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Welcome to the Hive!', author: 'Queen Bee', timestamp: '10:00 AM' },
    { id: 2, text: 'Buzzing with excitement!', author: 'Worker Bee', timestamp: '10:05 AM' },
    { id: 3, text: 'Found amazing flowers!', author: 'Scout Bee', timestamp: '10:10 AM' },
    { id: 4, text: 'Let\'s communicate!', author: 'Drone', timestamp: '10:15 AM' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const [showVideoCall, setShowVideoCall] = useState(false)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        author: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleCellClick = (id: number) => {
    setSelectedCell(selectedCell === id ? null : id)
  }

  const handleVideoCall = () => {
    setShowVideoCall(true)
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Chat interface - bottom right */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 w-96 border border-honey-500/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-honey-400 text-glow">
              🐝 Hive Chat
            </h2>
            <button
              onClick={handleVideoCall}
              className="px-4 py-2 bg-gradient-to-r from-honey-500 to-honey-600 rounded-lg
                       hover:from-honey-600 hover:to-honey-700 transition-all duration-300
                       text-sm font-semibold text-gray-900 neon-glow"
            >
              📹 Video Call
            </button>
          </div>

          {/* Message input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-900/50 border border-honey-500/30 rounded-lg
                       text-honey-100 placeholder-honey-700 focus:outline-none focus:border-honey-500
                       transition-all duration-300"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-2 bg-gradient-to-r from-honey-500 to-honey-600 rounded-lg
                       hover:from-honey-600 hover:to-honey-700 transition-all duration-300
                       font-semibold text-gray-900"
            >
              Send
            </button>
          </div>

          {/* Recent messages */}
          <div className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-2 custom-scrollbar">
            {messages.slice(-5).map((msg) => (
              <div 
                key={msg.id}
                className="bg-gray-900/50 rounded-lg p-3 border border-honey-500/20
                         hover:border-honey-500/40 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-honey-400">{msg.author}</span>
                  <span className="text-xs text-honey-700">{msg.timestamp}</span>
                </div>
                <p className="text-sm text-honey-100">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Honeycomb message grid - left side */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-honey-500/30">
          <h3 className="text-xl font-bold text-honey-400 mb-4 text-center text-glow">
            Message Hive
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {messages.slice(0, 9).map((msg) => (
              <HoneycombCell
                key={msg.id}
                message={msg.text}
                author={msg.author}
                timestamp={msg.timestamp}
                onClick={() => handleCellClick(msg.id)}
                active={selectedCell === msg.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video call modal */}
      {showVideoCall && (
        <VideoCallModal onClose={() => setShowVideoCall(false)} />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFA500;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FFD700;
        }
      `}</style>
    </div>
  )
}
