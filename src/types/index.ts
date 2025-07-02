export interface Task {
  id: number;
  task: string;
  date: string;
  status: 'In-progress' | 'Need to start' | 'Complete' | 'Blocked';
  submitter: string;
  url: string;
  assigned: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  value: number;
  avatar: string;
}

export interface Column {
  key: keyof Task;
  label: string;
  width: string;
  align: string;
  sortable: boolean;
  type: 'text' | 'date' | 'status' | 'priority' | 'number' | 'url';
}

export type SortDirection = 'asc' | 'desc' | null;
export type FilterType = 'all' | 'status' | 'priority' | 'assigned';