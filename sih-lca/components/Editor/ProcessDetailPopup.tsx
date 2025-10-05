import React, { useEffect, useState } from 'react';
import { X, ChevronDown, Database, FileText, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { NodeData, Process, TableType } from '@/interfaces/index';
import TableEditor from './TableEditor';
import DropdownInput from './DropdownInput';
import { GetOneProcess } from '@/lib/actions/process.actions';
import { useForm } from 'react-hook-form';
import { DatePicker } from '../Inputs/DatePicker';
import LocationInput from '../Inputs/LocationInput';
import EditableTablePopover from './TableEditor2';

interface Column {
  name: string;
  format: string;
  type: string;
  description?: string;
}

interface SidePopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentProcessid : number
}

const ProcessDetailPopup: React.FC<SidePopupProps> = ({ 
  isOpen, 
  onClose, 
  currentProcessid
},
) => {
  const [selectedTable, setSelectedTable] = useState<TableType>(TableType.INPUT);
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);
  const [process, setProcess] = useState<Process>({id: 32})
  const {register, handleSubmit, formState} = useForm()
  const {errors, isSubmitting} = formState
  const operations = [
    { name: "Read rows", icon: Database },
    { name: "Filtering", icon: Filter },
    { name: "Insert rows", icon: Plus },
    { name: "Update rows", icon: Edit },
    { name: "Delete rows", icon: Trash2 },
    { name: "Subscribe to changes", icon: Database }
  ];
  useEffect(()=>{
    GetOneProcess(Number(currentProcessid))
    .then((data)=>{
      console.log("Data...")
      console.log(data)
      setProcess(data[0])
  })
  },[currentProcessid])
    if (!isOpen) return null;
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
            <input type="text" placeholder='Process Name' className='bg-gray-800 py-1 px-2 focus:outline-0' value={process?.name} disabled={true}/>
            {/* <h2 className="text-lg font-semibold">Process Name</h2> */}
            <button
              onClick={onClose}
              className="rounded-md p-1 hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* Operations */}
            {/* <div className="border-b border-gray-700 p-4">
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

            </div> */}
            <div className='border-b border-gray-700 p-4'>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Generate with AI
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Tell us about your process..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-400">{String(errors.description)}</p>
              )}
            </div>
            <div className='border-b border-gray-700 p-4'>
            <DatePicker label='valid from'/>
            </div>
            <div className='border-b border-gray-700 p-4'>
            <DatePicker label='valid till'/>
            </div>

            <div className='border-b border-gray-700 p-4'>
              <label htmlFor="reference flow" className="block text-sm font-medium text-gray-300 mb-2">
                Reference Flow
              </label>
              <input
                type="text"
                id="reference flow"
                {...register("reference flow")}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Example - 1 kg of aluminum ingot"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{String(errors.name)}</p>
              )}
            
              </div>

            <div className='border-b border-gray-700 p-4'>
             <label htmlFor="reference flow" className="block text-sm font-medium text-gray-300 mb-2">
                Technology
              </label>
              <input
                type="technology"
                id="technology"
                {...register("reference flow")}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Example - Electricity from grid process, transportation service process"
                disabled={isSubmitting}
              />
            </div>
            <div className='border-b border-gray-700 p-4'>
              <LocationInput/>
              </div>
            {/* Table Selection */}
            <div className="border-b border-gray-700 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">Tables & Views</h3>
              {/* <div className="relative">
              </div> */}
            </div>
            {/* Table Info */}
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{selectedTable}</h3>
                <p className="text-sm text-gray-400 mt-1">No description available</p>
              </div>

              {/* Columns */}
              <EditableTablePopover process_id={currentProcessid}/>
              {/* <TableEditor type={selectedTable} process_id={Number(process.id)}/> */}
              {/* <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Columns</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-400 pb-2 border-b border-gray-700">
                    <span>Name</span>
                    <span>Format</span>
                    <span>Type</span>
                    <span>Description</span>
                  </div>
                  {data?.input_params?.map((input, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-xs py-1">
                      <span className="text-white">{input.name}</span>
                      <span className="text-gray-400">{input.category}</span>
                      <span className="text-gray-400">{input.amount}</span>
                      <span className="text-gray-500">{input.scale || '-'}</span>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDetailPopup;