export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  type: string; // Story, Bug, Feature, etc.
}

export interface PagedResult<T> {
  pageNumber: number,
  pageSize: number,
  items: T[];
  totalCount: number;
}