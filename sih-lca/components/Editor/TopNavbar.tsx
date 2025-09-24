import React from 'react'

const TopNavbar = () => {
  return (
    <div className='text-white flex bg-gray-800 text-sm border-gray-600 border-b-1 h-[5vh]'>
      <ul className='flex gap-10 py-2 px-10'>
        <li>Save</li>
        <li>Exit</li>
        <li>Database</li>
        <li>Tools</li>
      </ul>
    </div>
  )
}

export default TopNavbar
