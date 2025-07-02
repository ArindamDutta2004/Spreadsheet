import React, { useState } from 'react';
import { X, Grid3X3, Maximize2, Minimize2, Edit3, Save, Calendar, User, Flag } from 'lucide-react';
import { Task } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Avatar } from './Avatar';

interface CellViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
}

export const CellViewModal: React.FC<CellViewModalProps> = ({ 
  isOpen, 
  onClose, 
  task, 
  onUpdateTask 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Task | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen || !task) return null;

  const handleEdit = () => {
    setEditData({ ...task });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      onUpdateTask(task.id, editData);
      setIsEditing(false);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const currentTask = editData || task;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${
        isExpanded ? 'w-[90vw] h-[90vh]' : 'w-[600px] max-h-[80vh]'
      } overflow-hidden`}>
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Cell View - Task #{task.id}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex space-x-1">
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-700 rounded-md hover:bg-green-50"
                  title="Save changes"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: isExpanded ? 'calc(90vh - 80px)' : 'calc(80vh - 80px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description
                </label>
                {isEditing ? (
                  <textarea
                    value={currentTask.task}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, task: e.target.value } : null)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-gray-900">{currentTask.task}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Submitted Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={currentTask.date}
                      onChange={(e) => setEditData(prev => prev ? { ...prev, date: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded border text-sm">
                      {new Date(currentTask.date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Due Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={currentTask.dueDate}
                      onChange={(e) => setEditData(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded border text-sm">
                      {new Date(currentTask.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={currentTask.url}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, url: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded border">
                    <a 
                      href={currentTask.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {currentTask.url}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Value
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={currentTask.value}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, value: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1000"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded border text-sm font-medium">
                    ${currentTask.value.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={currentTask.status}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, status: e.target.value as Task['status'] } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Need to start">Need to start</option>
                    <option value="In-progress">In-progress</option>
                    <option value="Complete">Complete</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                ) : (
                  <div className="flex justify-start">
                    <StatusBadge status={currentTask.status} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Flag className="w-4 h-4 inline mr-1" />
                  Priority
                </label>
                {isEditing ? (
                  <select
                    value={currentTask.priority}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, priority: e.target.value as Task['priority'] } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                ) : (
                  <div className="flex justify-start">
                    <PriorityBadge priority={currentTask.priority} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Submitter
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentTask.submitter}
                    onChange={(e) => setEditData(prev => prev ? { ...prev, submitter: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded border text-sm">
                    {currentTask.submitter}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Assigned To
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentTask.assigned}
                    onChange={(e) => {
                      const avatar = e.target.value.split(' ').map(name => name[0]).join('').toUpperCase();
                      setEditData(prev => prev ? { ...prev, assigned: e.target.value, avatar } : null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                    <Avatar initials={currentTask.avatar} />
                    <span className="text-sm">{currentTask.assigned}</span>
                  </div>
                )}
              </div>

              {/* Task Timeline */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Task Timeline</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Created on {new Date(currentTask.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Due on {new Date(currentTask.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Last updated just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};