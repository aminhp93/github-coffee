import { useState, useRef } from "react";
import type { ColDef } from "ag-grid-community";

import { TableAggrid } from "@/@core/components/table-aggrid";
import { DEFAULT_COL_DEFS } from "./utils";
import { TEST_DATA } from "./constants";
import { AgGridReact } from "ag-grid-react";

const TableTask = () => {
  const [colDefs] = useState<ColDef[]>(DEFAULT_COL_DEFS);
  const gridRef = useRef<AgGridReact>(null);
  return (
    <div>
      <h1>Table Task</h1>
      <div
        style={{
          height: 500,
        }}
        className="relative"
      >
        <TableAggrid
          ref={gridRef}
          rowData={TEST_DATA.list}
          columnDefs={colDefs}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default TableTask;
