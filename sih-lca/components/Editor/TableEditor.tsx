import React, { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { TableType } from '@/interfaces/index';
import { InputParamSchema, OutputParamSchema, ProcessParamSchema } from '@/lib/schemas/schema';
import { SaveInTable } from '@/lib/actions/table.actions';

interface ValidationErrors {
  [key: string]: Record<string, string>;
}

interface TableEditorProps{
    type : TableType,
}
export default function TableEditor(props: TableEditorProps) {
  const TableRowSchema =  props.type === TableType.INPUT? InputParamSchema : props.type === TableType.PROCESS? ProcessParamSchema : OutputParamSchema
  const TableSchema = z.array(TableRowSchema)
  type TableRow = z.infer<typeof TableRowSchema>
  const [rows, setRows] = useState<TableRow[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const addRow = () => {
    console.log("Default row")
    console.log(TableRowSchema.parse({}))
    const newRow: TableRow = TableRowSchema.parse({process_id: 2});
    setRows([...rows, newRow]);
    setErrors(prev => ({ ...prev, [newRow.process_id]: {} }));
  };

  const removeRow = (process_id: number) => {
    setRows(rows.filter(row => row.process_id !== process_id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[process_id];
      return newErrors;
    });
  };

  const updateRow = (process_id: number, field: keyof Omit<TableRow, 'id'>, value: string) => {
    setRows(rows.map(row => 
      row.process_id === process_id ? { ...row, [field]: value } : row
    ));
    
    // Clear error for this field when user starts typing
    if (errors[process_id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [process_id]: {
          ...prev[process_id],
          [field]: ''
        }
      }));
    }
  };

  const validateAllRows = () => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    rows.forEach(row => {
      const result = TableRowSchema.safeParse(row);
      if (!result.success) {
        const rowErrors: Record<string, string> = {};
        newErrors[row.process_id] = rowErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const saveToDatabase = async () => {
    if (rows.length === 0) {
      alert('Please add at least one row before saving');
      return;
    }

    if (!validateAllRows()) {
      setSaveStatus('error');
      return;
    }

    setIsLoading(true);
    setSaveStatus('idle');

    try {
      // Simulate API call
      await SaveInTable(rows[0].process_id,rows, props.type)
      
      // Simulate database save
      console.log('Saving to database:', rows);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving to database:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{props.type}</h1>
          <div className="flex gap-3">
            <button
              onClick={addRow}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Row
            </button>
            <button
              onClick={saveToDatabase}
              disabled={isLoading || rows.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {saveStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-800 border border-green-600 text-green-100 rounded-lg">
            Data saved successfully to database!
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-800 border border-red-600 text-red-100 rounded-lg">
            Please fix the validation errors before saving.
          </div>
        )}

        {rows.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-lg">No rows added yet</p>
              <p className="text-sm">Click "Add Row" to start entering data</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    {
                        Object.keys(rows[0]).map((col) => <th className="text-left p-4 font-semibold text-gray-200">{col}</th>)
                    }
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.process_id} className="border-t border-gray-700 hover:bg-gray-750">
                    {
                        Object.keys(row).map((col) => {
                            return(<td className="p-4">
                                <div>
                                    <input
                                    type="text"
                                    value={row[col]}
                                    onChange={(e) => updateRow(row.process_id, col, e.target.value)}
                                    placeholder={`Enter ${col}`}
                                    className={`w-full bg-gray-700 border ${
                                      errors[row.process_id]?.name ? 'border-red-500' : 'border-gray-600'
                                    } rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                    />
                                    {errors[row.process_id]?.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors[row.process_id].name}</p>
                                    )}
                        </div>
                      </td>)
})
                    }
                      {/* <td className="p-4">
                        <div>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => updateRow(row.process_id, 'name', e.target.value)}
                            placeholder="Enter name"
                            className={`w-full bg-gray-700 border ${
                              errors[row.process_id]?.name ? 'border-red-500' : 'border-gray-600'
                            } rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                          />
                          {errors[row.process_id]?.name && (
                            <p className="text-red-400 text-sm mt-1">{errors[row.process_id].name}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <input
                            type="email"
                            value={row.email}
                            onChange={(e) => updateRow(row.process_id, 'email', e.target.value)}
                            placeholder="Enter email"
                            className={`w-full bg-gray-700 border ${
                              errors[row.process_id]?.email ? 'border-red-500' : 'border-gray-600'
                            } rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                          />
                          {errors[row.process_id]?.email && (
                            <p className="text-red-400 text-sm mt-1">{errors[row.process_id].email}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <select
                            value={row.role}
                            onChange={(e) => updateRow(row.process_id, 'role', e.target.value)}
                            className={`w-full bg-gray-700 border ${
                              errors[row.process_id]?.role ? 'border-red-500' : 'border-gray-600'
                            } rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                          >
                            <option value="">Select role</option>
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                            <option value="Manager">Manager</option>
                            <option value="Analyst">Analyst</option>
                            <option value="QA">QA Engineer</option>
                          </select>
                          {errors[row.process_id]?.role && (
                            <p className="text-red-400 text-sm mt-1">{errors[row.process_id].role}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => removeRow(row.process_id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700 transition-colors"
                          title="Remove row"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="mt-4 text-sm text-gray-400">
            {rows.length} row{rows.length !== 1 ? 's' : ''} added
          </div>
        )}
      </div>
    </div>
  );
}