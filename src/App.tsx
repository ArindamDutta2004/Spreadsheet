import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  Bell,
  User,
  MoreHorizontal,
  EyeOff,
  ArrowUpDown,
  Filter,
  Grid3X3,
  Download,
  Upload,
  Share2,
  Plus,
  Calendar,
  DollarSign,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  RefreshCw,
  Briefcase
} from 'lucide-react';

import { Task, Column } from './types';
import { StatusBadge } from './components/StatusBadge';
import { PriorityBadge } from './components/PriorityBadge';
import { Avatar } from './components/Avatar';
import { EditableCell } from './components/EditableCell';
import { FilterModal, FilterState } from './components/FilterModal';
import { NewTaskModal } from './components/NewTaskModal';
import { ImportModal } from './components/ImportModal';
import { ShareModal } from './components/ShareModal';
import { ToolbarDropdown } from './components/ToolbarDropdown';
import { NotificationModal } from './components/NotificationModal';
import { CellViewModal } from './components/CellViewModal';
import { AddCellModal } from './components/AddCellModal';
import { useSpreadsheet } from './hooks/useSpreadsheet';

const initialTasks: Task[] = [
  {
    id: 1,
    task: "Launch social media campaign for product launch",
    date: "2024-11-15",
    status: "In-progress",
    submitter: "Asha Patel",
    url: "https://www.ashapatel.com",
    assigned: "Sophie Choudhury",
    priority: "Medium",
    dueDate: "2024-11-20",
    value: 500000,
    avatar: "SC"
  },
  {
    id: 2,
    task: "Update press kit for company redesign",
    date: "2024-10-28",
    status: "Need to start",
    submitter: "Irfan Khan",
    url: "https://www.irfankhan.com",
    assigned: "Tejas Pandey",
    priority: "High",
    dueDate: "2024-10-30",
    value: 3500000,
    avatar: "TP"
  },
  {
    id: 3,
    task: "Finalize user testing feedback for app launch",
    date: "2024-12-05",
    status: "In-progress",
    submitter: "Mark Johnson",
    url: "https://www.markjohnson.com",
    assigned: "Rachel Lee",
    priority: "Medium",
    dueDate: "2024-12-10",
    value: 4750000,
    avatar: "RL"
  },
  {
    id: 4,
    task: "Design new features for the website",
    date: "2025-01-10",
    status: "Complete",
    submitter: "Emily Green",
    url: "https://www.emilygreen.com",
    assigned: "Tom Wright",
    priority: "Low",
    dueDate: "2025-01-15",
    value: 5800000,
    avatar: "TW"
  },
  {
    id: 5,
    task: "Prepare financial report for Q4",
    date: "2025-01-25",
    status: "Blocked",
    submitter: "Jessica Brown",
    url: "https://www.jessicabrown.com",
    assigned: "Kevin Smith",
    priority: "Low",
    dueDate: "2025-01-30",
    value: 2800000,
    avatar: "KS"
  }
];

function App() {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCellViewModalOpen, setIsCellViewModalOpen] = useState(false);
  const [isAddCellModalOpen, setIsAddCellModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showToolbarDropdown, setShowToolbarDropdown] = useState(false);
  const [currentView, setCurrentView] = useState('spreadsheet');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    tasks,
    allTasks,
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
  } = useSpreadsheet(initialTasks);

  const tabs = ['All Orders', 'Pending', 'Reviewed', 'Arrived'] as const;
  const tabCounts = getTabCounts();

  // Column definitions with job bag icon
  const columns: Column[] = [
    { key: 'id', label: '', width: 'w-12', align: 'text-center', sortable: false, type: 'number' },
    { key: 'task', label: '💼 Job Request', width: 'w-80', align: 'text-left', sortable: true, type: 'text' },
    { key: 'date', label: '📅 Submitted', width: 'w-28', align: 'text-center', sortable: true, type: 'date' },
    { key: 'status', label: '🔄 Status', width: 'w-32', align: 'text-center', sortable: true, type: 'status' },
    { key: 'submitter', label: '👤 Submitter', width: 'w-36', align: 'text-left', sortable: true, type: 'text' },
    { key: 'url', label: '🔗 URL', width: 'w-40', align: 'text-left', sortable: true, type: 'url' },
    { key: 'assigned', label: '👥 Assigned', width: 'w-40', align: 'text-left', sortable: true, type: 'text' },
    { key: 'priority', label: '⚡ Priority', width: 'w-24', align: 'text-center', sortable: true, type: 'priority' },
    { key: 'dueDate', label: '📅 Due Date', width: 'w-28', align: 'text-center', sortable: true, type: 'date' },
    { key: 'value', label: '💰 Est. Value', width: 'w-32', align: 'text-right', sortable: true, type: 'number' }
  ];

  const visibleColumns = columns.filter(col => !hiddenColumns.has(col.key));

  // Refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate data refresh with a delay
    setTimeout(() => {
      // You can add actual refresh logic here
      // For now, we'll just show a success message
      setIsRefreshing(false);

      // Optional: Show a toast or notification
      console.log('Data refreshed successfully');
    }, 1500);
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === tasks.length && tasks.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(tasks.map(task => task.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size > 0) {
      deleteTasks(Array.from(selectedRows));
      setSelectedRows(new Set());
    }
  };

  const handleCellView = () => {
    if (selectedRows.size === 1) {
      const taskId = Array.from(selectedRows)[0];
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
        setIsCellViewModalOpen(true);
      }
    } else {
      alert('Please select exactly one row to view in cell mode');
    }
  };

  const handleAddCell = (position: { row: number; column: string }) => {
    console.log(`Adding cell at ${position.column}${position.row}`);
    alert(`Cell ${position.column}${position.row} would be added to the spreadsheet`);
  };

  const getSortIcon = (column: keyof Task) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-3 h-3 text-blue-600" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-3 h-3 text-blue-600" />;
    return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
  };

  const renderCellContent = (task: Task, column: Column) => {
    const value = task[column.key];

    switch (column.key) {
      case 'id':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedRows.has(task.id)}
              onChange={() => handleRowSelect(task.id)}
              className="rounded border-gray-400 text-blue-600 focus:ring-blue-500 scale-75"
            />
            <span className="text-xs text-gray-500">{task.id}</span>
          </div>
        );

      case 'task':
        return (
          <EditableCell
            value={value}
            type="text"
            onSave={(newValue) => updateTask(task.id, { task: newValue })}
          />
        );

      case 'date':
      case 'dueDate':
        return (
          <EditableCell
            value={value}
            type="date"
            onSave={(newValue) => updateTask(task.id, { [column.key]: newValue })}
          />
        );

      case 'status':
        return (
          <StatusBadge
            status={task.status}
            onClick={() => {
              const statuses = ['Need to start', 'In-progress', 'Complete', 'Blocked'];
              const currentIndex = statuses.indexOf(task.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              updateTask(task.id, { status: nextStatus as Task['status'] });
            }}
          />
        );

      case 'priority':
        return (
          <PriorityBadge
            priority={task.priority}
            onClick={() => {
              const priorities = ['Low', 'Medium', 'High'];
              const currentIndex = priorities.indexOf(task.priority);
              const nextPriority = priorities[(currentIndex + 1) % priorities.length];
              updateTask(task.id, { priority: nextPriority as Task['priority'] });
            }}
          />
        );

      case 'submitter':
        return (
          <EditableCell
            value={value}
            type="text"
            onSave={(newValue) => updateTask(task.id, { submitter: newValue })}
          />
        );

      case 'url':
        return (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline cursor-pointer truncate block"
            title={task.url}
          >
            {task.url}
          </a>
        );

      case 'assigned':
        return (
          <div className="flex items-center space-x-2">
            <Avatar initials={task.avatar} />
            <EditableCell
              value={task.assigned}
              type="text"
              onSave={(newValue) => {
                const avatar = newValue.split(' ').map((name: string) => name[0]).join('').toUpperCase();
                updateTask(task.id, { assigned: newValue, avatar });
              }}
            />
          </div>
        );

      case 'value':
        return (
          <EditableCell
            value={value}
            type="number"
            onSave={(newValue) => updateTask(task.id, { value: newValue })}
          />
        );

      default:
        return value;
    }
  };

  const activeFilterCount = filters.status.length + filters.priority.length + filters.assigned.length;

  const handleAddNewTab = () => {
    const newTabName = prompt('Enter new tab name:');
    if (newTabName && newTabName.trim()) {
      alert(`New tab "${newTabName}" would be created`);
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    console.log(`Switched to ${view} view`);

    // Show different messages based on view
    const viewMessages = {
      'table': 'Switched to clean table view',
      'kanban': 'Switched to Kanban board view',
      'calendar': 'Switched to calendar view',
      'chart': 'Switched to bar chart view',
      'pie': 'Switched to pie chart view',
      'line': 'Switched to line chart view',
      'list': 'Switched to list view',
      'timeline': 'Switched to timeline view',
      'map': 'Switched to map view',
      'database': 'Switched to database view',
      'spreadsheet': 'Switched to spreadsheet view'
    };

    if (view !== 'spreadsheet') {
      alert(viewMessages[view as keyof typeof viewMessages] || `Switched to ${view} view`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>📁 Workspace</span>
            <ChevronRight className="w-3 h-3" />
            <span>Folder 2</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-gray-900">Spreadsheet 3</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search within sheet"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative bg-green-200"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">2</span>
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <img
                src="https://images.unsplash.com/photo-1615109398623-88346a601842?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFufGVufDB8fDB8fHww"
                className="w-8 h-8 rounded-full object-cover"
                alt="John Doe"
              />
              <span className="text-sm font-medium">John Doe</span>
            </div>

          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setShowToolbarDropdown(!showToolbarDropdown)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span>Tool bar</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              <ToolbarDropdown
                isOpen={showToolbarDropdown}
                onClose={() => setShowToolbarDropdown(false)}
                onViewChange={handleViewChange}
                currentView={currentView}
              />
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Hide fields</span>
                </button>
                {showColumnMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
                    {columns.slice(1).map(column => (
                      <label key={column.key} className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!hiddenColumns.has(column.key)}
                          onChange={() => toggleColumnVisibility(column.key)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{column.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleCellView}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Cell view</span>
              </button>
              <button
                onClick={() => setIsAddCellModalOpen(true)}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 px-3 py-1.5 rounded-md hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Cell</span>
              </button>
              {selectedRows.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete ({selectedRows.size})</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Toolbar - Excel Style with Column Lines */}
      <div className="bg-white border-b border-gray-300 px-0">
        <div className="flex border-gray-300">
          {/* Empty space for checkbox column */}
          <div className="w-12 border-r border-gray-300 bg-gray-50 h-8 flex items-center justify-center">
            <span className="text-xs text-gray-400"></span>
          </div>

          {/* Q3 Financial Overview spanning from Job Request to Submitter */}
          <div className="border-r border-gray-300 bg-blue-50 flex items-center px-3 h-8 text-xs font-medium text-blue-700" style={{ width: 'calc(20rem + 7rem + 8rem + 9rem)' }}>
            <span className="mr-1">📊</span>
            <span>Q3 Financial Overview</span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`ml-2 p-1 rounded hover:bg-blue-100 transition-colors ${isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              title="Refresh data"
            >
              <RefreshCw className={`w-3 h-3 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* URL column - empty */}
          <div className="w-40 border-r border-gray-300 bg-gray-50 h-8"></div>

          {/* ABC for Assigned column */}
          <div className="w-40 border-r border-gray-300 bg-yellow-50 flex items-center px-3 h-8 text-xs font-medium text-yellow-700">
            <span className="mr-1">🔤</span>
            <span>ABC</span>
          </div>

          {/* Answer a question spanning Priority and Due Date */}
          <div className="border-r border-gray-300 bg-green-50 flex items-center justify-center px-3 h-8 text-xs font-medium text-green-700" style={{ width: 'calc(6rem + 7rem)' }}>
            <span>Answer a question</span>
          </div>

          {/* Extract for Est. Value - with proper column line separation */}
          <div className="w-32 border-r border-gray-300 bg-orange-50 flex items-center justify-center px-3 h-8 text-xs font-medium text-orange-700">
            <span>Extract</span>
          </div>

          {/* Plus button for empty columns - separated with column line */}
          <div className="flex-1 bg-gray-50 border-r border-gray-300 flex items-center justify-center h-8">
            <button
              onClick={() => setIsAddCellModalOpen(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100 border border-gray-300 bg-white shadow-sm"
              title="Add new cell"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Excel-Style Spreadsheet Container with Column Lines */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="border-l border-gray-300">
          {/* Column Headers - Excel Style */}
          <div className="sticky top-0 bg-gray-50 border-b border-gray-300 z-10">
            <div className="flex">
              {visibleColumns.map((column, index) => (
                <div
                  key={column.key}
                  className={`${column.width} px-3 py-2 text-xs font-semibold text-gray-700 ${column.align} border-r border-gray-300 flex items-center justify-between hover:bg-gray-100 ${column.sortable ? 'cursor-pointer' : ''} h-8 bg-gray-50`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {index === 0 ? (
                    <input
                      type="checkbox"
                      checked={selectedRows.size === tasks.length && tasks.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-400 text-blue-600 focus:ring-blue-500 scale-75"
                    />
                  ) : (
                    <>
                      <span className="text-xs font-medium">{column.label}</span>
                      {column.sortable && getSortIcon(column.key)}
                    </>
                  )}
                </div>
              ))}
              {/* Extra column for the plus button */}
              {/* <div className="flex-1 px-3 py-2 text-xs font-semibold text-gray-700 text-center border-r border-gray-300 h-8 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400">+</span>
              </div> */}
            </div>
          </div>

          {/* Data Rows - Excel Style with Column Lines */}
          {tasks.map((task, rowIndex) => (
            <div key={task.id} className={`flex border-b border-gray-300 hover:bg-blue-50 group ${selectedRows.has(task.id) ? 'bg-blue-50' : 'bg-white'}`}>
              {visibleColumns.map((column, colIndex) => (
                <div
                  key={`${task.id}-${column.key}`}
                  className={`${column.width} px-3 py-2 border-r border-gray-300 ${column.align} h-8 flex items-center text-xs ${colIndex === 0 ? 'bg-gray-50 group-hover:bg-blue-100' : ''}`}
                >
                  {renderCellContent(task, column)}
                </div>
              ))}
              {/* Extra empty cell for the plus column */}
              <div className="flex-1 px-3 py-2 border-r border-gray-300 h-8 flex items-center justify-center text-xs hover:bg-blue-50 cursor-cell">
                <span className="text-gray-300"></span>
              </div>
            </div>
          ))}

          {/* Empty Rows - Excel Style with Column Lines */}
          {Array.from({ length: Math.max(0, 20 - tasks.length) }, (_, i) => (
            <div key={`empty-${i}`} className="flex border-b border-gray-300 hover:bg-blue-50 group bg-white">
              {visibleColumns.map((column, colIndex) => (
                <div
                  key={`empty-${i}-${column.key}`}
                  className={`${column.width} px-3 py-2 border-r border-gray-300 h-8 flex items-center hover:bg-blue-50 cursor-cell text-xs ${colIndex === 0 ? 'bg-gray-50 group-hover:bg-blue-100 text-gray-400 justify-center' : ''}`}
                >
                  {colIndex === 0 && (
                    <span className="text-xs text-gray-400 font-medium">{tasks.length + i + 1}</span>
                  )}
                </div>
              ))}
              {/* Extra empty cell for the plus column */}
              <div className="flex-1 px-3 py-2 border-r border-gray-300 h-8 flex items-center justify-center text-xs hover:bg-blue-50 cursor-cell">
                <span className="text-gray-300"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${activeTab === tab
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <span>{tab}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
                }`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
          <button
            onClick={handleAddNewTab}
            className="ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Add new tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilter={setFilters}
        tasks={allTasks}
        currentFilters={filters}
      />

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={addTask}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importFromCSV}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      <CellViewModal
        isOpen={isCellViewModalOpen}
        onClose={() => setIsCellViewModalOpen(false)}
        task={selectedTask}
        onUpdateTask={updateTask}
      />

      <AddCellModal
        isOpen={isAddCellModalOpen}
        onClose={() => setIsAddCellModalOpen(false)}
        onAddCell={handleAddCell}
      />

      {/* Click outside handlers */}
      {showColumnMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColumnMenu(false)}
        />
      )}

      {showToolbarDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowToolbarDropdown(false)}
        />
      )}
    </div>
  );
}

export default App;