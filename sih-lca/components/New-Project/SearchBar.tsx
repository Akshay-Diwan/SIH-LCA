import React from 'react'
import {cardClasses, inputClasses} from '@/lib/constants'
const SearchBar = () => {
  return (
    <>
     <div className={`${cardClasses} w-[80%] max-w-[800px] border rounded-lg p-4 mb-6`}>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Ask Copilot"
                  className={`flex-1 px-3 py-2 rounded-md border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <button className="p-2 text-gray-400 hover:text-gray-300">
                  →
                </button>
              </div>
            </div> 
    </>
  )
}

export default SearchBar
