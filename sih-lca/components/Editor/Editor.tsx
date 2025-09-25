import React,{useState, useCallback} from 'react'
import FolderSidebar from './FolderSidebar'
import ProcessDetailPopup from './ProcessDetailPopup'
import TopNavbar from './TopNavbar';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ToolBar from './ToolBar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import CustomNode from './CustomNode';
import { NodeData } from '@/interfaces/index';

const Editor = () => {
  const [processData, setProcessData] = useState<NodeData | undefined>() 
  const handleNodeClick = (data: NodeData)=> {

    setIsPopupOpen((prev)=> !prev)
  }
    const nodeTypes = {
        processNode: (props: any) => <CustomNode {...props} handleNodeClick={handleNodeClick} />
    }
    const [isPopupOpen, setIsPopupOpen] = useState(true);
    const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'processNode', },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => {
        console.log(changes) 
        return applyNodeChanges(changes, nodesSnapshot)}),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const addNewNode = (e: any)=> {
    const bounds = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
    setNodes([...nodes,{
        id: `n${nodes.length + 1}`,
        position: position,
        type: 'processNode',
        data: {
            label: `n${nodes.length + 1}`
        }
    }])
  }
  return (
    <>
    <TopNavbar/>
    <div className='w-screen flex bg-gray-900'>
             
  

<ContextMenu>
    <ContextMenuTrigger>
    <div className="bg-gray-900" style={{ width: '100vw', height: '95vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView>
            <Panel position="top-left">
                <FolderSidebar/>
            </Panel>
            <Panel position='bottom-center'>
                <ToolBar/>
            </Panel>
      <Background/>
      <Controls/>
      </ReactFlow>
 
    </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
    <ContextMenuItem><button onClick={addNewNode}>New Process</button></ContextMenuItem>
  </ContextMenuContent>
    </ContextMenu>
    </div>
      <ProcessDetailPopup isOpen={isPopupOpen} data={processData} onClose={() => {setIsPopupOpen(false)}}/>
        </>
  )
}

export default Editor
