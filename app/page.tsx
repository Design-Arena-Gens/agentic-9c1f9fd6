'use client'

import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-IN'

        recognitionRef.current.onresult = (event: any) => {
          const last = event.results.length - 1
          const userSpeech = event.results[last][0].transcript

          setTranscript(prev => [...prev, `You: ${userSpeech}`])
          processUserInput(userSpeech)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error)
        }

        recognitionRef.current.onend = () => {
          if (isCallActive) {
            recognitionRef.current.start()
          }
        }
      }
    }
  }, [isCallActive])

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-IN'
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
      setTranscript(prev => [...prev, `Agent: ${text}`])
    }
  }

  const processUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase()

    // Simple rule-based responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      speak('Hello! Welcome to Style and Shine Barber Shop in Ahmedabad. How can I help you today?')
    } else if (lowerInput.includes('book') || lowerInput.includes('appointment')) {
      speak('Great! I can help you book an appointment. What day works best for you?')
    } else if (lowerInput.includes('monday') || lowerInput.includes('tuesday') || lowerInput.includes('wednesday') ||
               lowerInput.includes('thursday') || lowerInput.includes('friday') || lowerInput.includes('saturday') ||
               lowerInput.includes('sunday') || lowerInput.includes('today') || lowerInput.includes('tomorrow')) {
      speak('Perfect! What time would you prefer? We are open from 9 AM to 8 PM.')
    } else if (lowerInput.includes('morning') || lowerInput.includes('afternoon') || lowerInput.includes('evening') ||
               /\d+/.test(lowerInput)) {
      speak('Excellent! And what service would you like? We offer haircut, shave, beard trim, hair coloring, and combo packages.')
    } else if (lowerInput.includes('haircut') || lowerInput.includes('shave') || lowerInput.includes('beard') ||
               lowerInput.includes('color') || lowerInput.includes('combo')) {
      speak('Great choice! Can I have your name and phone number to confirm the booking?')
    } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('charge')) {
      speak('Our haircut is 300 rupees, shave is 150 rupees, beard trim is 200 rupees, and our combo package is 500 rupees.')
    } else if (lowerInput.includes('location') || lowerInput.includes('address') || lowerInput.includes('where')) {
      speak('We are located in C G Road, Ahmedabad, Gujarat. Near Pantaloons showroom.')
    } else if (lowerInput.includes('cancel') || lowerInput.includes('reschedule')) {
      speak('No problem! Please provide your booking reference number or phone number and I will help you with that.')
    } else if (lowerInput.includes('thank') || lowerInput.includes('bye')) {
      speak('Thank you for calling Style and Shine Barber Shop! Have a great day!')
      setTimeout(() => endCall(), 2000)
    } else {
      speak('I understand. Could you please provide more details so I can better assist you?')
    }
  }

  const startCall = () => {
    setIsCallActive(true)
    setTranscript([])

    setTimeout(() => {
      speak('Hello! Thank you for calling Style and Shine Barber Shop in Ahmedabad. This is your AI assistant. How may I help you today?')

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
          setIsListening(true)
        } catch (error) {
          console.error('Error starting recognition:', error)
        }
      }
    }, 500)
  }

  const endCall = () => {
    setIsCallActive(false)
    setIsListening(false)

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Style & Shine Barber Shop
          </h1>
          <p className="text-purple-300 text-lg">📍 C G Road, Ahmedabad, Gujarat</p>
          <p className="text-purple-400 mt-2">AI Voice Assistant</p>
        </div>

        {/* Call Interface */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Status Indicator */}
          <div className="text-center mb-8">
            {isCallActive ? (
              <div className="inline-flex items-center gap-3 bg-green-500/20 px-6 py-3 rounded-full border border-green-500/50">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-semibold">Call Active</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-gray-500/20 px-6 py-3 rounded-full border border-gray-500/50">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-300 font-semibold">Ready to Call</span>
              </div>
            )}
          </div>

          {/* Call Button */}
          <div className="flex justify-center mb-8">
            {!isCallActive ? (
              <button
                onClick={startCall}
                className="w-24 h-24 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={endCall}
                className="w-24 h-24 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </button>
            )}
          </div>

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 text-purple-300">
                <div className="flex gap-1">
                  <div className="w-1 h-8 bg-purple-400 rounded animate-pulse" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1 h-10 bg-purple-400 rounded animate-pulse" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1 h-6 bg-purple-400 rounded animate-pulse" style={{animationDelay: '300ms'}}></div>
                  <div className="w-1 h-8 bg-purple-400 rounded animate-pulse" style={{animationDelay: '450ms'}}></div>
                </div>
                <span>AI is speaking...</span>
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
            {transcript.length === 0 ? (
              <p className="text-gray-400 text-center italic">Call transcript will appear here...</p>
            ) : (
              <div className="space-y-3">
                {transcript.map((line, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      line.startsWith('You:')
                        ? 'bg-blue-500/20 text-blue-200 ml-8'
                        : 'bg-purple-500/20 text-purple-200 mr-8'
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {line.startsWith('You:') ? '👤 You' : '🤖 AI Agent'}
                    </p>
                    <p>{line.split(': ')[1]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 text-center text-purple-300 text-sm">
            {isListening ? (
              <p>🎤 Listening... Speak clearly into your microphone</p>
            ) : (
              <p>Click the green button to start a voice call</p>
            )}
          </div>
        </div>

        {/* Services Info */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✂️</span>
              <div>
                <p className="font-semibold">Haircut</p>
                <p className="text-sm text-purple-300">₹300</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🪒</span>
              <div>
                <p className="font-semibold">Shave</p>
                <p className="text-sm text-purple-300">₹150</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧔</span>
              <div>
                <p className="font-semibold">Beard Trim</p>
                <p className="text-sm text-purple-300">₹200</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="font-semibold">Hair Coloring</p>
                <p className="text-sm text-purple-300">₹800+</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-purple-200">
              <strong>Hours:</strong> 9:00 AM - 8:00 PM (All Days)
            </p>
            <p className="text-purple-200 mt-2">
              <strong>Contact:</strong> +91 79 1234 5678
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
