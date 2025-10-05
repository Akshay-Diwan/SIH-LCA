import React, { useState, useRef, useEffect } from 'react';
import { Edit, Save, X, Plus, Trash2, Settings, Users, Table } from 'lucide-react';
import { GetTable, SetTable } from '@/lib/actions/table.actions';
import { TableType } from '@/interfaces';
import DropdownInput from './DropdownInput';
import {v4 as uuid} from 'uuid'
import Papa from "papaparse"

interface TableRow {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}
interface ParamsRow {
  name: string;
  amount: number;
  unit: string;
  source?: string;
  location?: string;
  uncertainty_low?: number;
  uncertainty_high?: number;
  allocation_method?: string;
  notes: string;
}
const ParamsFields = ['name','type','amount', 'unit', 'source', 'location', 'uncertainty_low', 'uncertainty_high', 'allocation_method', 'notes']
interface EditingCell {
  rowId: string;
  column: keyof Omit<TableRow, 'id'>;
}
interface EditableTablePopoverProps{
  process_id: number
}

const EditableTablePopover: React.FC = ({process_id}: EditableTablePopoverProps) => {
  const [data, setData] = useState<ParamsRow[]>([]);
  const [file, setFile] = useState(null);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTable, setSelectedTable] = useState(TableType.INPUT);
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
        setShowActions(false);
        setEditingCell(null);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);
  useEffect(()=>{
    console.log(process_id)
    GetTable(process_id,selectedTable)
    .then((data)=> {
      setData(data)
      console.log(data)
  })

  }, [selectedTable])
   useEffect(()=>{
    console.log("Inside use effect")
    if(data.length){
      SetTable(process_id,data, selectedTable)
    }
   }, [data])

  const startEditing = (rowId: string, column: keyof Omit<TableRow, 'id'>) => {
    const row = data.find(r => r.id === rowId);
    if (row) {
      setEditingCell({ rowId, column });
      setEditValue(row[column]);
    }
  };

  const saveEdit = () => {
    if (editingCell) {
      setData(prev => prev.map(row => 
        row.id === editingCell.rowId 
          ? { ...row, [editingCell.column]: editValue }
          : row
      ));
      setEditingCell(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const addRow = () => {
    setData(prev => [...prev, { 
      id: uuid(), 
      name: 'New Parameter', 
      type: 'none', 
      amount: 0,
      unit: 'None'
    }]);
  };

  const deleteRow = (name: string) => {
    setData(prev => prev.filter(row => row.name !== name));
    
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };
  const handleExportCSV = (filename = "data.csv")=> {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  const handleImportCSV = ()=> {
    fileInputRef.current?.click()
  }
  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if(selected && selected.type === 'text/csv'){
      setFile(selected)
      parseCsvFile(selected)
    }
  }
  const parseCsvFile = (file)=> {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data.map(result =>{ return {...result, id: uuid()}}));
        console.log("Parsed CSV data: ", results.data)
      },  
    })
  }
  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-400' : 'text-red-400';
  };

  const getStatusBg = (status: string) => {
    return status === 'Active' ? 'bg-green-400/20' : 'bg-red-400/20';
  };

  return (
    <div className="bg-gray-900 text-white p-8">
      {/* Background Content */}
      <div className="max-w-6xl mx-auto">
        {/* <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Employee Management Dashboard
        </h1> */}
        
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
            <p className="text-3xl font-bold text-blue-400">{data.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Active</h3>
            <p className="text-3xl font-bold text-green-400">
              {data.filter(row => row.status === 'Active').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Inactive</h3>
            <p className="text-3xl font-bold text-red-400">
              {data.filter(row => row.status === 'Inactive').length}
            </p>
          </div>
        </div> */}

        {/* <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-400">Engineering</p>
              <p className="text-xl font-bold">
                {data.filter(row => row.department === 'Engineering').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Design</p>
              <p className="text-xl font-bold">
                {data.filter(row => row.department === 'Design').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Marketing</p>
              <p className="text-xl font-bold">
                {data.filter(row => row.department === 'Marketing').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Management</p>
              <p className="text-xl font-bold">
                {data.filter(row => row.department === 'Management').length}
              </p>
            </div>
          </div>
        </div> */}

        {/* Popover Trigger */}
        <div className="text-center relative flex justify-end gap-2">
          <button
            ref={triggerRef}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3"
          >
            {/* <Users className="w-5 h-5" /> */}
            Manage Table
          </button>
 
        </div>

        {/* Large Popover */}
        {isPopoverOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            
            {/* Popover */}
            <div 
              ref={popoverRef}
              className="fixed inset-4 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Popover Header */}
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 flex justify-between items-center">
                <div>
                                    <DropdownInput
                   name='Table'
                   options={[
                    { value: TableType.INPUT, label: 'Input Parameters'},
                    {value: TableType.PROCESS, label: 'Process Parameters'},
                    {value: TableType.OUTPUT, label: 'Output Parameters'}
                  ]}
                  defaultValue='input_params'
                  onChange={(value)=> setSelectedTable(value)}

                />
                  <p className="text-gray-300 text-sm">Edit, add, or remove parameters</p>
                  
                </div>
                <div>

                </div>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <button
                      onClick={() => setShowActions(!showActions)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Actions
                    </button>
                    
                    {showActions && (
                      <div className="absolute top-12 right-0 bg-gray-700 border border-gray-600 rounded-lg shadow-xl p-3 z-10 w-48">
                        <div className="space-y-1">
                          <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm" onClick={handleExportCSV}>
                            Export CSV
                          </button>
                          <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm" onClick={handleImportCSV}>
                            <input type="file" name="csv-upload" accept='.csv' id="csv-upload" className="hidden" ref={fileInputRef} onChange={handleFileChange}/>
                            Import CSV
                          </button>
                          <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm">
                            Bulk Edit
                          </button>
                          <hr className="border-gray-600 my-1" />
                          <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm text-red-400">
                            Clear All
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={addRow}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Parameter
                  </button>
                  
                  <button
                    onClick={() => setIsPopoverOpen(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Popover Content - Table */}
              <div className="flex-1 overflow-auto bg-gray-800">
                <table className="w-full">
                  <thead className="bg-gray-700 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Name</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Type</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Amount</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Unit</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Source</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Location</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Uncertainty Low</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Uncertainty High</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Allocation Method</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm">Notes</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold text-sm w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {data.map((row, index) => (
                      <tr 
                        key={row.id} 
                        className={`hover:bg-gray-700/50 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                        }`}
                      >
                        { ParamsFields.map((column) => (
                          <td key={column} className="px-4 py-3 text-gray-200">
                            {editingCell?.rowId === row.id && editingCell?.column === column ? (
                              <div className="flex items-center gap-2">
                                <input
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  className="bg-gray-900 border border-gray-600 text-white rounded px-2 py-1 focus:border-blue-500 focus:outline-none text-sm flex-1"
                                  autoFocus
                                />
                                <button
                                  onClick={saveEdit}
                                  className="p-1 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
                                >
                                  <Save className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => startEditing(row.id, column)}
                                className="flex items-center justify-between group cursor-pointer py-1 px-2 rounded hover:bg-gray-600/30 transition-colors"
                              >
                                <span className="text-sm">{row[column]}</span>
                                <Edit className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity text-gray-400" />
                              </div>
                            )}
                          </td>
                        ))}
                        
                        {/* Status Column */}
                        {/* <td className="px-4 py-3">
                          {editingCell?.rowId === row.id && editingCell?.column === 'status' ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-gray-900 border border-gray-600 text-white rounded px-2 py-1 focus:border-blue-500 focus:outline-none text-sm"
                                autoFocus
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                              <button
                                onClick={saveEdit}
                                className="p-1 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => startEditing(row.id, 'status')}
                              className="group cursor-pointer"
                            >
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(row.status)} ${getStatusColor(row.status)}`}>
                                {row.status}
                              </span>
                            </div>
                          )}
                        </td> */}
                        
                        {/* Actions Column */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteRow(row.name)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                            title="Delete Parameter"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Popover Footer */}
              <div className="bg-gray-700 px-6 py-3 border-t border-gray-600">
                <div className="flex justify-between items-center text-sm text-gray-300">
                  <div>
                    Showing {data.length} parameters • Click any cell to edit • Enter to save, Esc to cancel
                  </div>
                  <div>
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableTablePopover;