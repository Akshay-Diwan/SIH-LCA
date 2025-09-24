import React from 'react'
import { Filter,TrendingUp,Star } from 'lucide-react'
// import Card from './Card'
const Feed = (props: any) => {

  return (
    <>
               {/* Feed Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Feed</h2>
              <button className={`flex items-center space-x-2 px-3 py-2 rounded-md border ${props.cardClasses} hover:${props.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                <Filter className="h-4 w-4" />
                <span className="text-sm">Filter</span>
              </button>
            </div>

            {/* Trending Section */}
            <div className={`${props.cardClasses} border rounded-lg p-6`}>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">Trending repositories</span>
                <span className="text-sm text-gray-500">• See more</span>
              </div>

              <div className="space-y-6">
                {/* {props.trendingRepos.map((repo:any, index: any) => (
                 <Card isDarkMode={props.isDarkMode} repo={repo} index={index}/>
                ))} */}
              </div>
            </div>


          </div> 
    </>
  )
}

export default Feed
