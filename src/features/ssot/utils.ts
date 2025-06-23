export interface Item {
  id: number;
  name: string;
  role: string;
}

export const DATA: Item[] = [
  { id: 1, name: 'Alice', role: 'Dev' },
  { id: 2, name: 'Bob', role: 'Design' },
  { id: 3, name: 'Charlie', role: 'Dev' },
  { id: 4, name: 'Diana', role: 'QA' },
  { id: 5, name: 'Eve', role: 'Manager' },
];

export const COLUMNS = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'role', headerName: 'Role', width: 100 },
];
