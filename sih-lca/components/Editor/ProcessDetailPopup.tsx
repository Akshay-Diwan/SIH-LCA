import React, { useState } from 'react';
import { X, ChevronDown, Database, FileText, Filter, Plus, Edit, Trash2 } from 'lucide-react';

interface Column {
  name: string;
  format: string;
  type: string;
  description?: string;
}

interface SidePopupProps {
  isOpen: boolean;
  onClose: () => void;
  tableName?: string;
  columns?: Column[];
}

const ProcessDetailPopup: React.FC<SidePopupProps> = ({ 
  isOpen, 
  onClose, 
  tableName = "companions",
  columns = [
    { name: "id", format: "uuid", type: "string" },
    { name: "created_at", format: "timestamp with time zone", type: "string" },
    { name: "name", format: "character varying", type: "string" },
    { name: "subject", format: "character varying", type: "string" },
    { name: "topic", format: "character varying", type: "string" },
    { name: "style", format: "character varying", type: "string" },
    { name: "voice", format: "character varying", type: "string" },
    { name: "duration", format: "bigint", type: "number" },
    { name: "author", format: "character varying", type: "string" }
  ]
}) => {
  const [selectedTable, setSelectedTable] = useState(tableName);
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const operations = [
    { name: "Read rows", icon: Database },
    { name: "Filtering", icon: Filter },
    { name: "Insert rows", icon: Plus },
    { name: "Update rows", icon: Edit },
    { name: "Delete rows", icon: Trash2 },
    { name: "Subscribe to changes", icon: Database }
  ];

  return (
    <div className="inset-0 flex fixed">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-60 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative ml-auto h-full w-[700px] bg-gray-900 text-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-700 p-4">
            <h2 className="text-lg font-semibold">Process Name</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Table Selection */}
            <div className="border-b border-gray-700 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">Tables & Views</h3>
              <div className="relative">
                <button
                  onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-md bg-gray-800 px-3 py-2 text-left hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm">{selectedTable}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isTableDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md bg-gray-800 border border-gray-600 shadow-lg">
                    <div className="py-1">
                      <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-700 transition-colors">
                        input
                      </button>
                      <button className="block w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-700 transition-colors">
                        output
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Operations */}
            <div className="border-b border-gray-700 p-4">
              <div className="space-y-1">
                {operations.map((operation, index) => (
                  <button
                    key={index}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors"
                  >
                    <operation.icon className="h-4 w-4 text-gray-400" />
                    {operation.name}
                  </button>
                ))}
              </div>

            </div>

            {/* Table Info */}
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{tableName}</h3>
                <p className="text-sm text-gray-400 mt-1">No description available</p>
              </div>

              {/* Columns */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Columns</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-400 pb-2 border-b border-gray-700">
                    <span>Name</span>
                    <span>Format</span>
                    <span>Type</span>
                    <span>Description</span>
                  </div>
                  {columns.map((column, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-xs py-1">
                      <span className="text-white">{column.name}</span>
                      <span className="text-gray-400">{column.format}</span>
                      <span className="text-gray-400">{column.type}</span>
                      <span className="text-gray-500">{column.description || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDetailPopup;