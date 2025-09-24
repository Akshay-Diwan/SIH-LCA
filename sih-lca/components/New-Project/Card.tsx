import React, { useState, useEffect } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title = "Card Title",
  description = "This is a beautiful card component built with Next.js, TypeScript, and Tailwind CSS. It features hover effects and clean styling.",
  imageUrl = "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop",
  imageAlt = "Card image",
  badge = "Featured",
  children,
  onClick,
  className = ""
}) => {
  return (
    <div className={`max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:scale-105 overflow-hidden ${className}`}>
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
        {badge && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {badge}
          </div>
        )}
      </div>
      
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
};

// Dark mode hook
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled in localStorage or system preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { isDarkMode, toggleDarkMode };
};

// Example usage with multiple cards
// const CardShowcase: React.FC = () => {
//   const { isDarkMode, toggleDarkMode } = useDarkMode();
  
//   const handleCardClick = () => {
//     alert('Card clicked!');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-8 transition-colors duration-300">
//       <div className="max-w-6xl mx-auto">
//         {/* Dark Mode Toggle */}
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={toggleDarkMode}
//             className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 group"
//             aria-label="Toggle dark mode"
//           >
//             {isDarkMode ? (
//               <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//               </svg>
//             )}
//           </button>
//         </div>
        
//         <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2 transition-colors duration-300">
//           Beautiful Cards
//         </h1>
//         <p className="text-center text-gray-600 dark:text-gray-300 mb-12 transition-colors duration-300">
//           Modern card components built with Next.js, TypeScript, and Tailwind CSS
//         </p>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           <Card
//             title="Web Development"
//             description="Learn modern web development with React, Next.js, and TypeScript. Build amazing applications with the latest technologies."
//             imageUrl="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop"
//             badge="Popular"
//             onClick={handleCardClick}
//           />
          
//           <Card
//             title="UI/UX Design"
//             description="Master the art of user interface and user experience design. Create beautiful, intuitive designs that users love."
//             imageUrl="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=200&fit=crop"
//             badge="Trending"
//             onClick={handleCardClick}
//           />
          
//           <Card
//             title="Mobile Development"
//             description="Build cross-platform mobile applications using React Native and modern development practices."
//             imageUrl="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop"
//             badge="New"
//             onClick={handleCardClick}
//           >
//             <div className="flex flex-wrap gap-2 mb-4">
//               <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full transition-colors duration-300">React Native</span>
//               <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full transition-colors duration-300">iOS</span>
//               <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full transition-colors duration-300">Android</span>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

export default Card;