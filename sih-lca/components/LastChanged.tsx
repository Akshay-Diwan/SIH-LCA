import { Project } from '@/interfaces'
import Link from 'next/link'
import React from 'react'
interface LastChangedProps{
  latest_project: Project
}
  const cardClasses = 'bg-gray-800 border-gray-700' 

const LastChanged = (props: LastChangedProps) => {
   const lastChangedTime = ()=> {
     if(props.latest_project.updated_at) {
      const updatedTime = new Date(props.latest_project.updated_at).getTime()
      const time = (Date.now() / 1000) - updatedTime
      if(time > 3600 * 24) {
          const days = Math.floor(time / 3600 * 24)
          return `${days} day${days === 1 && 's'} ago`
      }
      else if (time >  3600) {
        const hours = Math.floor(time/3600)
        return `${hours} hour${hours === 1 && 's'} ago`
      }
      else if(time > 60) {
        const minutes = Math.floor(time/60)
        return `${minutes} minute${minutes === 1 && 's'} ago`
      }
      else {
        return 'few seconds ago'
      }
    }
   }
  return (
    <>
                  {/* Latest Changes Section */}
                  <Link href={`/project/${props.latest_project.id}`}>
            <div className={`${cardClasses} border rounded-lg p-6 hover:cursor-pointer`} >
              <h3 className="font-semibold mb-4">Latest Working Project</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{lastChangedTime()}</p>
                    <b>{props.latest_project.name}</b>
                    <p className="text-sm">
                      {props.latest_project.description}
                    </p>
                  </div>
                </div>
              </div>
            </div> 
            </Link>
    </>
  )
}

export default LastChanged
