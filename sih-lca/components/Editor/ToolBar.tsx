import { Copy, Delete, Plus } from 'lucide-react'
import React from 'react'

const ToolBar = () => {
  return (
    <div className='bg-gray-700 w-[80vw] p-1 max-w-[500px] rounded-2xl flex justify-center shadow-black shadow-2xl'>
      <ul className='flex w-70 justify-between px-10'>
        <li className='hover:bg-gray-800 p-2.5 rounded-lg'><Plus color='gray'/></li>
        <li className='hover:bg-gray-800 p-2.5 rounded-lg'><Delete color="gray"/></li>
        <li className='hover:bg-gray-800 p-2.5 rounded-lg'><Copy color="gray"/></li>
      </ul>
    </div>
  )
}

export default ToolBar
