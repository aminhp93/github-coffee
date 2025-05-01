"use client";
import React, { forwardRef, RefObject } from "react";
import {
  AllCommunityModule,
  ModuleRegistry,
  CellSpanModule,
  ClientSideRowModelModule,
  PinnedRowModule,
  RowDragModule,
  RowSelectionModule,
  CsvExportModule,
} from "ag-grid-community";

import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowNumbersModule,
  StatusBarModule,
  MasterDetailModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
} from "ag-grid-enterprise";
import type { AgGridReactProps } from "ag-grid-react";
import { AgGridReact } from "ag-grid-react";
import Box from "@mui/material/Box";
import { styled } from "@/@core/theme";
import { DEFAULT_PROPS } from "./config";

const StyledBox = styled(Box)(() => ({
  width: "100%",
  height: "calc(100% - 50px)",
}));

ModuleRegistry.registerModules([
  AllCommunityModule,
  CellSpanModule,
  ClientSideRowModelModule,
  ClipboardModule,
  PinnedRowModule,
  RowDragModule,
  RowSelectionModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowNumbersModule,
  StatusBarModule,
  MasterDetailModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
]);

const TableAggrid = forwardRef<AgGridReact | null, AgGridReactProps>(
  (props, ref) => {
    return (
      <StyledBox>
        <AgGridReact
          ref={ref as RefObject<AgGridReact>} // Properly typed ref
          {...DEFAULT_PROPS}
          {...props} // Spread props for AgGridReact
        />
      </StyledBox>
    );
  }
);

// Set the display name for the component
TableAggrid.displayName = "TableAggrid";

export { TableAggrid };
