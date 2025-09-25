import React from 'react'
import { Background, Handle, Position } from '@xyflow/react';
interface CustomNodeProps{
  handleNodeClick: React.MouseEventHandler<HTMLDivElement>
}
const CustomNode = ({handleNodeClick}: CustomNodeProps) => {
  return (
    <div onClick = {handleNodeClick} className='bg-gray-800 w-[170px] h-[50px] text-white flex justify-center items-center border-2 border-purple-500 rounded-2xl'>
        Node
        <Handle type="source" position={Position.Right} id="r"/>
        <Handle type="source" position={Position.Left} id="l"/>
    </div>

  )
}

export default CustomNode
