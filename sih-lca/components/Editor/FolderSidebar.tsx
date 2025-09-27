import React, {ReactNode, useEffect, useState} from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Check, Cross, CrossIcon, X } from 'lucide-react';
import { ProductSystem,Process } from '@/interfaces';
import { ProcessSchema, ProductSystemSchema } from '@/lib/schemas/schema';
import { GetAllProductSystems, SaveProductSystem } from '@/lib/actions/productSystem.actions';
import { toast } from 'sonner';
import { GetAllProcesses, SaveProcess } from '@/lib/actions/process.actions';


interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onFileSelect: (path: string) => void;
}

// Mock directory structure - replace with your actual data
const mockFileStructure: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: '/src/components',
        children: [
          { name: 'Header.tsx', type: 'file', path: '/src/components/Header.tsx' },
          { name: 'Sidebar.tsx', type: 'file', path: '/src/components/Sidebar.tsx' },
          { name: 'Button.tsx', type: 'file', path: '/src/components/Button.tsx' }
        ]
      },
      {
        name: 'pages',
        type: 'folder',
        path: '/src/pages',
        children: [
          { name: 'index.tsx', type: 'file', path: '/src/pages/index.tsx' },
          { name: 'about.tsx', type: 'file', path: '/src/pages/about.tsx' },
          {
            name: 'api',
            type: 'folder',
            path: '/src/pages/api',
            children: [
              { name: 'users.ts', type: 'file', path: '/src/pages/api/users.ts' },
              { name: 'auth.ts', type: 'file', path: '/src/pages/api/auth.ts' }
            ]
          }
        ]
      },
      {
        name: 'styles',
        type: 'folder',
        path: '/src/styles',
        children: [
          { name: 'globals.css', type: 'file', path: '/src/styles/globals.css' },
          { name: 'Home.module.css', type: 'file', path: '/src/styles/Home.module.css' }
        ]
      },
      {
        name: 'utils',
        type: 'folder',
        path: '/src/utils',
        children: [
          { name: 'helpers.ts', type: 'file', path: '/src/utils/helpers.ts' },
          { name: 'constants.ts', type: 'file', path: '/src/utils/constants.ts' }
        ]
      }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    path: '/public',
    children: [
      { name: 'favicon.ico', type: 'file', path: '/public/favicon.ico' },
      { name: 'logo.png', type: 'file', path: '/public/logo.png' }
    ]
  },
  { name: 'package.json', type: 'file', path: '/package.json' },
  { name: 'tsconfig.json', type: 'file', path: '/tsconfig.json' },
  { name: 'tailwind.config.js', type: 'file', path: '/tailwind.config.js' },
  { name: 'next.config.js', type: 'file', path: '/next.config.js' },
  { name: 'README.md', type: 'file', path: '/README.md' }
];
interface ProductSystemItemProps{
  productSystem: ProductSystem,
  processes: Process[],
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>> 
}
interface ProcessItemProps{
  process: Process
}
const ProcessItem = ({process}: ProcessItemProps) => {
    const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <File className="w-4 h-4 text-gray-400" />;
  };
  return(
   <>
            <div className="flex items-center h-6 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm select-none pl-[40px]">
            {getFileIcon(process.name)}
            <span className="ml-2" />
            <span>{process.name}</span>
            </div>
    </>
  )
}
const ProductSystemItem = ({productSystem, processes, setProcesses}: ProductSystemItemProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [newProcess, setNewProcess] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('process');
  const handleToggle = () => {
      setIsExpanded(!isExpanded);
  };
  const addProcess = () => {
    setIsExpanded(true)
    setNewProcess(true)
  }
  const createProcess = async (process: Process)=> {
        // setProcess(prev => [...prev, current])
    try{
      await SaveProcess(process)
    }
    catch(err){
      console.log(err)
      toast("Could not create Product System")
    }
    setNewProcess(false)
    setNewName('')
    setProcesses((prev)=> [...prev, process])
  }
  const abordProcess = ()=> {
    setNewName('')
    setNewProcess(false)
  }



  const paddingLeft = 24;

  return (
    <div>
      <div
        className="flex items-center h-6 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm select-none"
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleToggle}
      >
        {
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
            )}
          </>
        }
        <span className="truncate">{productSystem.name}</span>
          <button className='hover:opacity-60 hover:cursor-pointer' onClick={addProcess}><Plus color='gray'/></button>
        
      </div>
        {
          isExpanded && newProcess && 
          <div className='flex items-center h-6 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm select-none px-[24px]'>
            <Folder className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
          <input type="text" placeholder='name' className='text-gray-300 text-sm bg-gray-900 focus:outline-gray-600 focus:outline-2 px-1 max-w-[70%]' value={newName} onChange={(e)=>setNewName(e.target.value)}/>
          <button className='px-1 hover:bg-gray-800' onClick={()=>createProcess(ProcessSchema.parse({name: newName, product_system_id: productSystem.id}))}><Check size={20} color='gray'/></button>
          <button className='px-1 hover:bg-gray-800' onClick={abordProcess}><X size={20} color='gray'/></button>

          
          </div>
        }
      {isExpanded && (
        <div>
          {processes.map((process, index) => (
            <ProcessItem
              key={`${process.id}-${index}`}
              process={process}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FolderSidebarProps{
  processes: Process[],
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>> 
}
const FolderSidebar = ({processes, setProcesses}: FolderSidebarProps) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [creating, setcreating] = useState<boolean>(false)
  const [productSystems, setProductSystems] = useState<ProductSystem[]>([])
  const [newName, setNewName] = useState<string>('')
  useEffect(()=> {
    GetAllProductSystems(2) 
    .then((systems)=>{
      setProductSystems(systems)
      console.log("Systems")
      console.log(systems)
      return Promise.all(
        // @ts-expect-error
        systems.map((ps)=> GetAllProcesses(ps.id))
      )
  })
  .then((allProcesses)=> {
    const flat = allProcesses.flat()
    setProcesses(flat)
  })
    .catch((err) => {
      console.log(err?.message)
      toast("failed to get Product Systems")
    })
    
  },[])
  const addProductSystem = ()=> {
      //create a inputbox
      setcreating(true)
      //create in db
  }
  const abordProductSystem = ()=> {
    setcreating(false)
  }
  const createProductSystem = async(current: ProductSystem) => {
    setProductSystems(prev => [...prev, current])
    try{
      await SaveProductSystem(current)
    }
    catch(err){
      console.log(err)
      toast("Could not create Product System")
    }
    setcreating(false)
  }
  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    console.log('Selected file:', path);
  };
  return (
    <>
    {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen shadow-2xl shadow-black">
        {/* Header */}
        <div className="h-8 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-3">
          <span className="text-gray-300 text-xs font-medium uppercase tracking-wider">
            Explorer
          </span>
          <button className='hover:opacity-60 hover:cursor-pointer' onClick={addProductSystem}><Plus color='gray'/></button>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto py-1">
          {
            creating && 
          <div className='flex items-center h-6 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm select-none px-[24px]'>
            <Folder className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
          <input type="text" placeholder='name' className='text-gray-300 text-sm bg-gray-900 focus:outline-gray-600 focus:outline-2 px-1 max-w-[70%]' value={newName} onChange={(e)=>setNewName(e.target.value)}/>
          <button className='px-1 hover:bg-gray-800' onClick={()=>createProductSystem(ProductSystemSchema.parse({name: newName}))}><Check size={20} color='gray'/></button>
          <button className='px-1 hover:bg-gray-800' onClick={abordProductSystem}><X size={20} color='gray'/></button>

          
          </div>
          }
          {productSystems.map((productSystem, index) => (
            <ProductSystemItem
              key={`${productSystem.id}-${index}`}
              productSystem={productSystem}
              setProcesses={setProcesses}
              processes={processes.filter(process=> process.product_system_id === productSystem.id)}
            />
          ))}
        </div>

      </div>
    </>
  )
}

export default FolderSidebar
