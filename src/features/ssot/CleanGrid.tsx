import { useMemo, useEffect, useState, useCallback } from 'react';
import {
  DataGrid,
  type GridRowSelectionModel,
  type DataGridProps,
  type GridRowId,
  GridLogicOperator,
  gridFilteredSortedRowIdsSelector,
  useGridApiRef,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { COLUMNS, type Item } from './utils';

interface Props {
  listData: Item[];
}

function CleanGrid(props: Props) {
  // Hooks
  const apiRef = useGridApiRef();

  // data state
  const [rows, setRows] = useState(props.listData);

  // ui state
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const [filterModel, setFilterModel] = useState<DataGridProps['filterModel']>({
    items: [],
    logicOperator: GridLogicOperator.And,
  });
  const [filterIds, setFilterIds] = useState<Set<GridRowId>>(new Set());

  useEffect(() => {
    setRows(props.listData);
  }, [props.listData]);

  const onFilterModelChange = useCallback<
    NonNullable<DataGridProps['onFilterModelChange']>
  >((newFilterModel) => {
    setFilterModel(newFilterModel);
  }, []);

  const selectedItems = rows.filter((i) => {
    return rowSelectionModel.ids.has(i.id);
  });

  const highlightItem = useMemo(() => {
    return rows.find((i) => i.id === 1);
  }, [rows]);

  useEffect(() => {
    const xxx = gridFilteredSortedRowIdsSelector(apiRef);
    console.log('Filtered Row IDs:', xxx);
    setFilterIds(new Set(xxx));
  }, [apiRef, filterModel]);

  const filteredItems = useMemo(() => {
    return rows.filter((i) => filterIds.has(i.id));
  }, [rows, filterIds]);

  return (
    <Box sx={{ height: 400 }}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={COLUMNS}
        rowHeight={40}
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelection) =>
          setRowSelectionModel(newSelection)
        }
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
      />
      <div style={{ marginTop: 20 }}>
        <p>
          🧠 <strong>Selected Items:</strong>{' '}
          {selectedItems.length
            ? selectedItems.map((i) => i.name).join(', ')
            : 'None'}
        </p>
        <p>
          🌟 <strong>Highlight Item:</strong> {highlightItem?.name ?? 'None'}
        </p>
        <p>
          🔎 <strong>Filtered Items:</strong>{' '}
          {filteredItems.map((i) => i.name).join(', ') || 'Empty'}
        </p>
      </div>
    </Box>
  );
}

export default CleanGrid;
