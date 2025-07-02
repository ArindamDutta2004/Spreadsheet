import React, { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import { Task } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterState) => void;
  tasks: Task[];
  currentFilters?: FilterState;
}

export interface FilterState {
  status: string[];
  priority: string[];
  assigned: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  tasks, 
  currentFilters 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    assigned: []
  });

  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const uniqueStatuses = Array.from(new Set(tasks.map(task => task.status)));
  const uniquePriorities = Array.from(new Set(tasks.map(task => task.priority)));
  const uniqueAssigned = Array.from(new Set(tasks.map(task => task.assigned)));

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = { status: [], priority: [], assigned: [] };
    setFilters(clearedFilters);
    onApplyFilter(clearedFilters);
  };

  const totalFilters = filters.status.length + filters.priority.length + filters.assigned.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filter Tasks</h2>
            {totalFilters > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {totalFilters}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Status</h3>
            <div className="space-y-2">
              {uniqueStatuses.map(status => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => handleFilterChange('status', status, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Priority</h3>
            <div className="space-y-2">
              {uniquePriorities.map(priority => (
                <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.priority.includes(priority)}
                    onChange={(e) => handleFilterChange('priority', priority, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{priority}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Assigned Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Assigned To</h3>
            <div className="space-y-2">
              {uniqueAssigned.map(assigned => (
                <label key={assigned} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.assigned.includes(assigned)}
                    onChange={(e) => handleFilterChange('assigned', assigned, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{assigned}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={handleClear}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear All
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};