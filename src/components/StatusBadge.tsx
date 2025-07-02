import React from 'react';

interface StatusBadgeProps {
  status: string;
  onClick?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'In-progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      case 'Need to start':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'Complete':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'Blocked':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors ${getStatusStyles()}`}
      onClick={onClick}
    >
      {status}
    </span>
  );
};