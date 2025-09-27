import React from 'react'
import { Background, Handle, Position } from '@xyflow/react';

interface Node{
 label: string
}
interface CustomNodeProps{
  handleNodeClick: React.MouseEventHandler<HTMLDivElement>,
  node: Node
}
const CustomNode = ({handleNodeClick, node}: CustomNodeProps) => {
  console.log('Node: ')
  console.log(node)
  return (
    <div onClick = {handleNodeClick} className='bg-gray-800 w-[170px] h-[50px] text-white flex justify-center items-center border-2 border-purple-500 rounded-2xl'>
        {node.data.label}
        <Handle type="source" position={Position.Right} id="r"/>
        <Handle type="source" position={Position.Left} id="l"/>
    </div>

  )
}

export default CustomNode
