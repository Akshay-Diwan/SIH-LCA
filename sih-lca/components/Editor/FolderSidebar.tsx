import React, {useState} from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';


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

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, level, onFileSelect }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node.path);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <File className="w-4 h-4 text-gray-400" />;
  };

  const paddingLeft = level * 16 + 8;

  return (
    <div>
      <div
        className="flex items-center h-6 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm select-none"
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleToggle}
      >
        {node.type === 'folder' ? (
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
        ) : (
          <>
            <div className="w-5 mr-1 flex-shrink-0" />
            {getFileIcon(node.name)}
            <span className="ml-2" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem
              key={`${child.path}-${index}`}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const FolderSidebar = () => {
     const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    console.log('Selected file:', path);
  };
  return (
    <>
    {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen shadow-2xl shadow-black">
        {/* Header */}
        <div className="h-8 bg-gray-900 border-b border-gray-700 flex items-center px-3">
          <span className="text-gray-300 text-xs font-medium uppercase tracking-wider">
            Explorer
          </span>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto py-1">
          {mockFileStructure.map((node, index) => (
            <FileTreeItem
              key={`${node.path}-${index}`}
              node={node}
              level={0}
              onFileSelect={handleFileSelect}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default FolderSidebar
