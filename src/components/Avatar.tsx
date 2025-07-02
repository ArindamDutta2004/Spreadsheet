import React from 'react';

interface AvatarProps {
   src?: string;
  initials: string;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, className = "", onClick }) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500'
  ];
  
  const colorIndex = initials.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div 
      className={`w-6 h-6 rounded-full ${bgColor} text-white flex items-center justify-center text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={onClick}
    >
      {initials}
    </div>
  );
};