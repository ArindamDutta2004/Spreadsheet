import { useState, useMemo } from 'react';
import { Task, SortDirection } from '../types';
import { FilterState } from '../components/FilterModal';

export const useSpreadsheet = (initialTasks: Task[]) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({ status: [], priority: [], assigned: [] });
  const [hiddenColumns, setHiddenColumns] = useState<Set<keyof Task>>(new Set());
  const [activeTab, setActiveTab] = useState('All Orders');

  // Sorting logic
  const handleSort = (column: keyof Task) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Tab filtering logic
  const getTabFilteredTasks = (tabName: string, taskList: Task[]) => {
    switch (tabName) {
      case 'Pending':
        return taskList.filter(task => task.status === 'Need to start' || task.status === 'In-progress');
      case 'Reviewed':
        return taskList.filter(task => task.status === 'Complete');
      case 'Arrived':
        return taskList.filter(task => task.status === 'Blocked');
      case 'All Orders':
      default:
        return taskList;
    }
  };

  // Filtering and searching logic
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply tab filter first
    result = getTabFilteredTasks(activeTab, result);

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(task =>
        Object.entries(task).some(([key, value]) => {
          if (key === 'id' || key === 'value') return false;
          return value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    if (filters.status.length > 0) {
      result = result.filter(task => filters.status.includes(task.status));
    }
    if (filters.priority.length > 0) {
      result = result.filter(task => filters.priority.includes(task.priority));
    }
    if (filters.assigned.length > 0) {
      result = result.filter(task => filters.assigned.includes(task.assigned));
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        // Handle different data types
        if (sortColumn === 'date' || sortColumn === 'dueDate') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tasks, searchTerm, filters, sortColumn, sortDirection, activeTab]);

  // Get tab counts
  const getTabCounts = () => {
    return {
      'All Orders': tasks.length,
      'Pending': getTabFilteredTasks('Pending', tasks).length,
      'Reviewed': getTabFilteredTasks('Reviewed', tasks).length,
      'Arrived': getTabFilteredTasks('Arrived', tasks).length
    };
  };

  // Task management
  const addTask = (newTask: Omit<Task, 'id'>) => {
    const id = Math.max(...tasks.map(t => t.id), 0) + 1;
    setTasks(prev => [...prev, { ...newTask, id }]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const deleteTasks = (ids: number[]) => {
    setTasks(prev => prev.filter(task => !ids.includes(task.id)));
  };

  // Column management
  const toggleColumnVisibility = (column: keyof Task) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ['ID', 'Task', 'Date', 'Status', 'Submitter', 'URL', 'Assigned', 'Priority', 'Due Date', 'Value'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedTasks.map(task => [
        task.id,
        `"${task.task.replace(/"/g, '""')}"`,
        task.date,
        task.status,
        `"${task.submitter}"`,
        task.url,
        `"${task.assigned}"`,
        task.priority,
        task.dueDate,
        task.value
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_${activeTab.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import functionality
  const importFromCSV = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          const newTasks: Task[] = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',');
            if (values.length >= headers.length) {
              const task: Task = {
                id: Math.max(...tasks.map(t => t.id), 0) + newTasks.length + 1,
                task: values[1]?.replace(/"/g, '') || '',
                date: values[2] || new Date().toISOString().split('T')[0],
                status: (values[3] as Task['status']) || 'Need to start',
                submitter: values[4]?.replace(/"/g, '') || '',
                url: values[5] || '',
                assigned: values[6]?.replace(/"/g, '') || '',
                priority: (values[7] as Task['priority']) || 'Medium',
                dueDate: values[8] || new Date().toISOString().split('T')[0],
                value: Number(values[9]) || 0,
                avatar: values[6]?.replace(/"/g, '').split(' ').map(n => n[0]).join('').toUpperCase() || 'XX'
              };
              newTasks.push(task);
            }
          }
          
          setTasks(prev => [...prev, ...newTasks]);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortColumn,
    sortDirection,
    handleSort,
    hiddenColumns,
    toggleColumnVisibility,
    activeTab,
    setActiveTab,
    getTabCounts,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    exportToCSV,
    importFromCSV
  };
};