import { Project } from '@/interfaces'
import { FolderOpen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
interface ProjectMenuProps{
  inputClasses: string,
  projects: Project[],
  isDarkMode: boolean
}
const ProjectMenu = (props: ProjectMenuProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            {/* <button onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </button> */}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Your projects
                </h3>
                {/* <button className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  New
                </button> */}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Find a project..."
                  className={`w-full px-3 py-2 text-sm rounded-md border ${props.inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {
                props.projects.length?
                <>
              <div className="space-y-2">
                {props.projects.map((repo: Project, index: any) => (
                  <div key={index} className="flex items-center space-x-2 text-sm p-1 rounded-sm hover:bg-gray-900">
                    <div className="w-4 h-4 bg-gray-600 rounded-full flex-shrink-0"></div>
                    <Link href={`project/${repo.id}`}>
                    <span className="truncate">
                      {/* <span className="text-gray-500">{repo.owner}/</span> */}
                      <span className="font-medium">{repo.name}</span>
                    </span>
                  </Link>
                  </div>
                ))}
              </div>
              <button className={`mt-3 text-sm ${props.isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'}`}>
                Show more
              </button>
              </>
              :
              <>
              <div className={`mt-8 text-md flex flex-col justify-center items-center ${props.isDarkMode ? 'text-gray-700' : 'text-gray-600'}`}>
                <FolderOpen size={70} color='#1E2939'/>
                <div>No Projects created</div>
                </div>
              </>
}
            </div>
              
          </div> 
    </>
  )
}

export default ProjectMenu
