import React from 'react'

const LastChanged = () => {
   let cardClasses = {}
  return (
    <>
                  {/* Latest Changes Section */}
            <div className={`${cardClasses} border rounded-lg p-6`}>
              <h3 className="font-semibold mb-4">Latest Working Project</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">2 hours ago</p>
                    <p className="text-sm">
                      description is now available
                    </p>
                  </div>
                </div>
              </div>
            </div> 
    </>
  )
}

export default LastChanged
