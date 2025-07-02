import React, { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
  value: any;
  type: 'text' | 'date' | 'status' | 'priority' | 'number' | 'url';
  onSave: (value: any) => void;
  options?: string[];
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, type, onSave, options }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement && type === 'text') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const formatValue = (val: any) => {
    if (type === 'number' && typeof val === 'number') {
      return val.toLocaleString();
    }
    if (type === 'date' && val) {
      return new Date(val).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    return val || '';
  };

  if (!isEditing) {
    return (
      <div 
        className="w-full h-full cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors min-h-[20px] flex items-center"
        onClick={() => setIsEditing(true)}
        title="Click to edit"
      >
        {formatValue(value)}
      </div>
    );
  }

  if (type === 'status' || type === 'priority') {
    return (
      <select
        ref={inputRef as React.RefObject<HTMLSelectElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
      >
        {options?.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={type === 'date' ? 'date' : type === 'number' ? 'number' : type === 'url' ? 'url' : 'text'}
      value={editValue}
      onChange={(e) => setEditValue(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
      placeholder={type === 'url' ? 'https://example.com' : ''}
    />
  );
};