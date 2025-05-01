/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type {
  ColDef,
  RowSelectionOptions,
  RowNodeTransaction,
  StatusPanelDef,
} from "ag-grid-community";
import { TableAggrid } from "@/@core/components/table-aggrid";
import { DEFAULT_COL_DEFS } from "./utils";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/@core/components/button";
import { v4 as uuidv4 } from "uuid";
// import ScanStatusPanel from "./components/ScanStatusPanel";
import SelectedStatusPanel from "@/@core/components/table-aggrid/status-panel/SelectedStatusPanel";
import GridFeaturesStatusPanel from "@/@core/components/table-aggrid/status-panel/GridFeaturesStatusPanel";

const LOCAL_STORAGE_KEY = "tableTaskData";

function createNewRowData() {
  const id = uuidv4();
  return {
    id: "Id_" + id,
    name: "name_" + id,
  };
}

function printResult(res: RowNodeTransaction) {
  console.log("---------------------------------------");
  if (res.add) {
    res.add.forEach((rowNode) => {
      console.log("Added Row Node", rowNode);
    });
  }
  if (res.remove) {
    res.remove.forEach((rowNode) => {
      console.log("Removed Row Node", rowNode);
    });
  }
  if (res.update) {
    res.update.forEach((rowNode) => {
      console.log("Updated Row Node", rowNode);
    });
  }
}

const TableTask = () => {
  // 1) Load initial row data from local storage
  const [rowData, setRowData] = useState<any[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [colDefs] = useState<ColDef[]>(DEFAULT_COL_DEFS);
  const gridRef = useRef<AgGridReact>(null);

  const rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };

  // 2) Helper to apply a transaction and sync updated data back to React state
  const applyTransactionAndStore = useCallback((tx: any) => {
    if (!gridRef.current) return;
    const res = gridRef.current.api.applyTransaction(tx)!;
    printResult(res);

    const newData: any[] = [];
    gridRef.current.api.forEachNode((node) => {
      newData.push(node.data);
    });
    setRowData(newData);
  }, []);

  const getRowData = useCallback(() => {
    if (!gridRef.current) return;
    const rowDataList: any[] = [];
    gridRef.current.api.forEachNode((node) => {
      rowDataList.push(node.data);
    });
    console.log("Row Data:");
    console.table(rowDataList);
  }, []);

  const clearData = useCallback(() => {
    // Remove all current rows
    applyTransactionAndStore({ remove: rowData });
  }, [applyTransactionAndStore, rowData]);

  const addItems = useCallback(
    (addIndex?: number) => {
      const newItems = [createNewRowData()];
      applyTransactionAndStore({ add: newItems, addIndex });
    },
    [applyTransactionAndStore]
  );

  const updateItems = useCallback(() => {
    if (!gridRef.current) return;
    // update the first 2 items
    const itemsToUpdate: any[] = [];
    gridRef.current.api.forEachNodeAfterFilterAndSort((rowNode, index) => {
      if (index < 2) {
        const data = rowNode.data;
        data.price = Math.floor(Math.random() * 20000 + 20000);
        itemsToUpdate.push(data);
      }
    });
    applyTransactionAndStore({ update: itemsToUpdate });
  }, [applyTransactionAndStore]);

  const onRemoveSelected = useCallback(() => {
    if (!gridRef.current) return;
    const selectedData = gridRef.current.api.getSelectedRows();
    applyTransactionAndStore({ remove: selectedData });
  }, [applyTransactionAndStore]);

  // 3) Update local storage after row drag
  const handleDragEnd = useCallback(() => {
    if (!gridRef.current) return;
    const newData: any[] = [];
    gridRef.current.api.forEachNode((node) => {
      newData.push(node.data);
    });
    setRowData(newData); // triggers the useEffect below
  }, []);

  // 3) Whenever rowData changes, store it to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rowData));
  }, [rowData]);

  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        {
          statusPanel: SelectedStatusPanel,
          align: "left",
        },
        // {
        //   statusPanel: ScanStatusPanel,
        //   align: "left",
        // },
        {
          statusPanel: GridFeaturesStatusPanel,
          align: "left",
        },
        // { statusPanel: "agTotalAndFilteredRowCountComponent" },
        { statusPanel: "agTotalRowCountComponent" },
        // { statusPanel: "agFilteredRowCountComponent" },
        // { statusPanel: "agSelectedRowCountComponent" },
        // { statusPanel: "agAggregationComponent" },
      ],
    };
  }, []);

  return (
    <div>
      <h1>Table Task</h1>
      <div style={{ marginBottom: "4px" }}>
        <Button onClick={() => addItems()}>Add Items</Button>
        <Button onClick={() => addItems(2)}>Add Items addIndex=2</Button>
        <Button onClick={updateItems}>Update Top 2</Button>
        <Button onClick={onRemoveSelected}>Remove Selected</Button>
        <Button onClick={getRowData}>Get Row Data</Button>
        <Button onClick={clearData}>Clear Data</Button>
      </div>
      <div style={{ height: 500 }} className="relative">
        <TableAggrid
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          pagination={false}
          rowSelection={rowSelection}
          statusBar={statusBar}
          rowDragManaged
          onRowDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
};

export default TableTask;
