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
    <div onClick = {()=>handleNodeClick(node.id)} className='bg-gray-800 w-[170px] h-[50px] text-white flex justify-center items-center border-2 border-purple-500 rounded-2xl'>
        {node.data.label}
        <Handle type='target' position={Position.Top} id="t"/>
        <Handle type="source" position={Position.Right} id="r"/>
        <Handle type="target" position={Position.Left} id="l"/>
        <Handle type="source" position={Position.Bottom} id="b"/>

    </div>

  )
}

export default CustomNode
