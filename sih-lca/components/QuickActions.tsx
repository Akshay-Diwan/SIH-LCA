import React from 'react'
import { Code,BookOpen, GitPullRequest } from 'lucide-react';
const QuickActions = () => {
    const isDarkMode = true;
      const quickActions = [
    { icon: Code, text: 'Make a Pong game' },
    { icon: BookOpen, text: 'Create a profile README for me' },
    { icon: GitPullRequest, text: 'Summarize a pull request' }
  ];
    const cardClasses = 'bg-gray-800 border-gray-700' 

  return (
    <>
       {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`${cardClasses} border rounded-lg p-4 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors text-left`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium">{action.text}</span>
                  </div>
                </button>
              ))}
            </div>
    </>
  )
}

export default QuickActions
