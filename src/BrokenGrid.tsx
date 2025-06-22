import {
  DataGrid,
  useGridApiRef,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
} from '@mui/x-data-grid';

const rows = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGrid', col2: 'Rocks' },
  { id: 3, col1: 'MUI', col2: 'is Great' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

export default function FilteredRowsExample() {
  const apiRef = useGridApiRef();

  const getFilteredRows = () => {
    const filteredRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);

    console.log('Filtered Row IDs:', filteredRowIds, visibleColumnFields);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <button onClick={getFilteredRows}>Log Filtered Rows</button>
      <DataGrid apiRef={apiRef} rows={rows} columns={columns} />
    </div>
  );
}
