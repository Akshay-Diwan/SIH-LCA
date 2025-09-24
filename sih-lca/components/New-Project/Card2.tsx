import React from 'react'

interface Card2props {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card2 = ({title , description, children, onClick, className}:Card2props) => {
  return (
    <div className={`max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 overflow-hidden ${className}`}> 
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {description}
        </p>
        
        {children}
        
        {/* Action Button */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Learn More
          </button>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card2
