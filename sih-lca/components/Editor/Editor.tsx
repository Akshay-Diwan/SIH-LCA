import React,{useState, useCallback, useEffect} from 'react'
import FolderSidebar from './FolderSidebar'
import ProcessDetailPopup from './ProcessDetailPopup'
import TopNavbar from './TopNavbar';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ToolBar from './ToolBar';
import { Toaster } from "@/components/ui/sonner"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import CustomNode from './CustomNode';
import { NodeData, Process, ProcessLink } from '@/interfaces/index';
import { DeleteProcesses, SaveProcess, UpdatePositions } from '@/lib/actions/process.actions';
import { ProcessSchema } from '@/lib/schemas/schema';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { CreateEdges, DeleteEdges, GetAllEdges } from '@/lib/actions/processLinks.actions';
import { redirect } from 'next/navigation';

const Editor = () => {
      const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'processNode', },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
  const [processes, setProcesses] = useState<Process[]>([])
  const [currentProcessId, setCurrentProcessId] = useState<number>(32)
  const [processLink, setProcessLink] = useState<ProcessLink[]>([])
  const [newNodeName, setNewNodeName] = useState<string>('node')
  const [creating, setCreating] = useState<boolean>(false)
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleNodeClick = (id:number)=> {
    console.log("Mei yaha puch gaya")
    setCurrentProcessId(id)
    setIsPopupOpen((prev)=> !prev)
  }
    const nodeTypes = {
       // @ts-expect-error
        processNode: (props) => <CustomNode node={props} handleNodeClick={handleNodeClick} />
    }


  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => {
        console.log(changes) 
              //  Detect deleted nodes
        // const removedNodeIds = changes
        // .filter((change: any) => change.type === 'remove')
        // .map((change: any) => change.id);

              // Update 'processes' state
      // if (removedNodeIds.length > 0) {
      //   console.log('Removed Nodes')
      //   console.log(removedNodeIds)
      //      DeleteProcesses(removedNodeIds)
      //      .then( 
      //      ()=>         
      //       setProcesses((prev) =>{
      //         console.log("prev nodes")
      //        console.log(prev.filter((p) => !removedNodeIds.includes(String(p.id))))
      //        return prev.filter((p) => !removedNodeIds.includes(String(p.id)))
      //       }
      //     )
      //    )
      //    .catch(err => {
      //      console.log(err)
      //      toast('Error occured')
      //    })


          
      // }
      console.log("Nodes after changes:")
      console.log(nodes)
        return applyNodeChanges(changes, nodesSnapshot)}),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => {
     setEdges((edgesSnapshot) => {
      console.log("Edges..")
       console.log(edges)
      return applyEdgeChanges(changes, edgesSnapshot)
})
    },
    []
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  // const initializeNewNode = ()=> {
  //   setCreating(true)
  // }
  const abortNewNode = ()=> {
    setCreating(false)
  }
  const Calculate = async ()=> {
    redirect('/calculations')
  }
  const SaveEditing = async ()=> {
    const existing_ids = nodes.map(node => node.id)
    const deletedProcesses = processes.filter(process => !existing_ids.includes(String(process.id)))
    const deleted_ids = deletedProcesses.map((process) => process.id)

    if(deleted_ids && deleted_ids.length > 0){
      await DeleteProcesses(deleted_ids)
    }
    await UpdatePositions(nodes)
    const existing_edge_ids = edges.map(edge => edge.id)
    const exsting_on_db = processLink.map(processLink => processLink.id)
    const deletedEdges = processLink.filter(link => !existing_ids.includes(String(link.id)))
    if(deletedEdges.length > 0) {
      await DeleteEdges(deletedEdges)
    }
    if(edges.length > 0){
      await CreateEdges(edges)
    }
    toast("saved successfully")

  }
  // const addNewNode = async (e: any)=> {
  //   const bounds = e.currentTarget.getBoundingClientRect();
  //   const position = {
  //     x: 200,
  //     y: 0
  //   };
  //   try{
  //     await SaveProcess(processData)
  //   setNodes([...nodes,{
  //       id: `n${nodes.length + 1}`,
  //       position: position,
  //       type: 'processNode',
  //       data: {
  //           label: `n${nodes.length + 1}`
  //       }
  //   }])
  // }catch(err){
  //   console.log(err)
  //   toast("Could not create Process")
  // }

  // }
  useEffect(()=> {
    console.log("Process Positions")
    const data = processes.map(process => {
      console.log(process.position)
      return {
      id: String(process.id),
      position: process.position,
      data: {label : process.name},
      type: 'processNode'
      }
    })
    const processes_id = processes.map(process => process.id)
    console.log("Processessss.sssss")
    console.log(processes)
    // @ts-expect-error
     GetAllEdges(processes_id)
    .then(
      (edgesData) =>{
    setProcessLink(edgesData)
    const formatEdges = edgesData.map(edge =>{ return {
      id: String(edge.id),
      source: String(edge.source),
      target: String(edge.target),
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: 'step'
    }})
    setEdges(formatEdges)
  }
  )
  .catch((err)=>{
    console.log(err)
    toast('error occured')
  })
    // @ts-expect-error
    setNodes(data)
  },[processes])
  return (
    <>
    <TopNavbar/>
    <div className='w-screen flex bg-gray-900'>
             
  

{/* <ContextMenu> */}
    {/* <ContextMenuTrigger> */}
    <div className="bg-gray-900" style={{ width: '100vw', height: '95vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        selectNodesOnDrag={true}
        fitView>
            <Panel position="top-left">
                <FolderSidebar processes={processes} setProcesses={setProcesses} SaveEditing = {SaveEditing}/>
            </Panel>
            <Panel position='bottom-center'>
                <ToolBar/>
            </Panel>
            <Panel position='top-right'>
              <button className='bg-gray-600 text-gray-300 px-6 py-3 rounded-2xl mx-5 hover:bg-gray-500 hover:cursor-pointer' onClick={Calculate}>Calculate</button>
              <button className='bg-blue-500 text-gray-300 px-6 py-3 rounded-2xl hover:bg-blue-600 hover:cursor-pointer' onClick={SaveEditing}>Save</button>
           
            </Panel>
      <Background/>
      <Controls/>
      </ReactFlow>
 
    </div>
    {/* </ContextMenuTrigger>
    <ContextMenuContent>
    {/* <ContextMenuItem>
      {
        creating?
        <div className='flex'>
        <input type="text" placeholder='node name' className='w-[70%]' value={newNodeName} onChange={(e)=> setNewNodeName(e.target.value)}/>
        <button className='hover:bg-gray-400 px-1' onClick={addNewNode}><Plus color='gray'/></button>
        <button className='hover:bg-gray-400 px-1' onClick={abortNewNode}><X color='gray'/></button>
        </div>:
        <button onClick={initializeNewNode}>New Process</button>
        
        
      }
      </ContextMenuItem> */}
  {/* </ContextMenuContent> */}
    {/* </ContextMenu>  */}
    </div>
      <ProcessDetailPopup isOpen={isPopupOpen} currentProcessid = {currentProcessId} onClose={() => {setIsPopupOpen(false)}}/>
        </>
  )
}

export default Editor
