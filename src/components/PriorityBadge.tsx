import React from 'react';

interface PriorityBadgeProps {
  priority: string;
  onClick?: () => void;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, onClick }) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors ${getPriorityStyles()}`}
      onClick={onClick}
    >
      {priority}
    </span>
  );
};