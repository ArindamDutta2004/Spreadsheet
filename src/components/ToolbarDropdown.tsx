import React, { useState } from 'react';
import { ChevronDown, Grid3X3, BarChart3, PieChart, LineChart, Table, Calendar, Kanban, List, Map, Baseline as Timeline, Database } from 'lucide-react';

interface ToolbarDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({ 
  isOpen, 
  onClose, 
  onViewChange, 
  currentView 
}) => {
  if (!isOpen) return null;

  const tools = [
    { 
      id: 'spreadsheet', 
      name: 'Spreadsheet View', 
      icon: Grid3X3, 
      description: 'Traditional grid layout with cells',
      category: 'Data Views'
    },
    { 
      id: 'table', 
      name: 'Table View', 
      icon: Table, 
      description: 'Clean table format for data',
      category: 'Data Views'
    },
    { 
      id: 'list', 
      name: 'List View', 
      icon: List, 
      description: 'Simple list format',
      category: 'Data Views'
    },
    { 
      id: 'kanban', 
      name: 'Kanban Board', 
      icon: Kanban, 
      description: 'Card-based workflow management',
      category: 'Project Views'
    },
    { 
      id: 'calendar', 
      name: 'Calendar View', 
      icon: Calendar, 
      description: 'Timeline and date-based view',
      category: 'Project Views'
    },
    { 
      id: 'timeline', 
      name: 'Timeline View', 
      icon: Timeline, 
      description: 'Gantt chart style timeline',
      category: 'Project Views'
    },
    { 
      id: 'chart', 
      name: 'Bar Chart', 
      icon: BarChart3, 
      description: 'Vertical bar data visualization',
      category: 'Analytics'
    },
    { 
      id: 'pie', 
      name: 'Pie Chart', 
      icon: PieChart, 
      description: 'Proportion and percentage analysis',
      category: 'Analytics'
    },
    { 
      id: 'line', 
      name: 'Line Chart', 
      icon: LineChart, 
      description: 'Trend analysis over time',
      category: 'Analytics'
    },
    { 
      id: 'map', 
      name: 'Map View', 
      icon: Map, 
      description: 'Geographic data visualization',
      category: 'Specialized'
    },
    { 
      id: 'database', 
      name: 'Database View', 
      icon: Database, 
      description: 'Relational data structure',
      category: 'Specialized'
    }
  ];

  const categories = ['Data Views', 'Project Views', 'Analytics', 'Specialized'];

  const handleToolSelect = (toolId: string) => {
    onViewChange(toolId);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-80 max-h-96 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-2 flex items-center">
          <Grid3X3 className="w-3 h-3 mr-1" />
          VIEW OPTIONS
        </div>
        
        {categories.map(category => (
          <div key={category} className="mb-3">
            <div className="text-xs font-medium text-gray-400 px-2 py-1 uppercase tracking-wide">
              {category}
            </div>
            {tools.filter(tool => tool.category === category).map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`w-full flex items-center space-x-3 px-2 py-2 text-left hover:bg-gray-50 rounded transition-colors ${
                    currentView === tool.id ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' : 'text-gray-700'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${currentView === tool.id ? 'text-blue-600' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.description}</div>
                  </div>
                  {currentView === tool.id && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
        
        <div className="border-t pt-2 mt-2">
          <div className="text-xs text-gray-500 px-2 py-1">
            💡 <strong>Tip:</strong> Switch views to analyze your data differently
          </div>
        </div>
      </div>
    </div>
  );
};