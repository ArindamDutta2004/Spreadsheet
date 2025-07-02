import React, { useState } from 'react';
import { X, Plus, Grid3X3 } from 'lucide-react';

interface AddCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCell: (position: { row: number; column: string }) => void;
}

export const AddCellModal: React.FC<AddCellModalProps> = ({ isOpen, onClose, onAddCell }) => {
  const [selectedRow, setSelectedRow] = useState(1);
  const [selectedColumn, setSelectedColumn] = useState('A');
  const [cellType, setCellType] = useState<'text' | 'number' | 'date' | 'formula'>('text');
  const [initialValue, setInitialValue] = useState('');

  if (!isOpen) return null;

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
  const rows = Array.from({ length: 50 }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCell({ row: selectedRow, column: selectedColumn });
    
    // Reset form
    setSelectedRow(1);
    setSelectedColumn('A');
    setCellType('text');
    setInitialValue('');
    onClose();
  };

  const getCellReference = () => `${selectedColumn}${selectedRow}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Add New Cell</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Grid3X3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">
              Selected Cell: <span className="font-bold text-lg">{getCellReference()}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Column
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Row
              </label>
              <select
                value={selectedRow}
                onChange={(e) => setSelectedRow(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {rows.map(row => (
                  <option key={row} value={row}>{row}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cell Type
            </label>
            <select
              value={cellType}
              onChange={(e) => setCellType(e.target.value as typeof cellType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="formula">Formula</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Value (Optional)
            </label>
            <input
              type={cellType === 'number' ? 'number' : cellType === 'date' ? 'date' : 'text'}
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                cellType === 'formula' ? '=SUM(A1:A10)' :
                cellType === 'number' ? '0' :
                cellType === 'date' ? 'Select date' :
                'Enter text...'
              }
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Cell Preview</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Position:</strong> {getCellReference()}</p>
              <p><strong>Type:</strong> {cellType.charAt(0).toUpperCase() + cellType.slice(1)}</p>
              <p><strong>Value:</strong> {initialValue || 'Empty'}</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Cell</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};