import React from 'react'
import { Code,X } from 'lucide-react'
const Banner = () => {
  return (
    <>
       {/* Universe Banner */}
          <div className="mb-8 relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 p-6 text-white">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="h-6 w-6" />
                <span className="font-bold text-lg">UNIVERSE'25</span>
              </div>
              <p className="text-sm opacity-90 mb-1">OCT 28-29 • SAN FRANCISCO</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                The full agenda is here: Choose your favorite sessions.
              </h2>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                START PLANNING →
              </button>
            </div>
            <div className="absolute top-4 right-4">
              <button className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20"></div>
            <div className="absolute top-20 right-20 w-20 h-20 bg-green-400 rounded-lg opacity-30 transform rotate-45"></div>
          </div>
    </>
  )
}

export default Banner
