export const DEFAULT_PROPS = {
  rowNumbers: false,
  alwaysMultiSort: true,
  pagination: true,
  paginationPageSize: 20,
  paginationPageSizeSelector: [5, 10, 20],
  rowDragManaged: false,
  masterDetail: false,
  rowHeight: 40,
  enableCellSpan: false,
  defaultColDef: {
    resizable: true,
    flex: 1,
  },
  columnHoverHighlight: false,
  enableRtl: false,
  statusBar: {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent" },
      { statusPanel: "agTotalRowCountComponent" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  },
  rowSelection: undefined,
  suppressMenuHide: false,
  sideBar: undefined,
};

export const DEFAULT_SIDE_BAR = {
  toolPanels: [
    {
      id: "columns",
      labelDefault: "Columns",
      labelKey: "columns",
      iconKey: "columns",
      toolPanel: "agColumnsToolPanel",
    },
    {
      id: "filters",
      labelDefault: "Filters",
      labelKey: "filters",
      iconKey: "filter",
      toolPanel: "agFiltersToolPanel",
    },
  ],
  defaultToolPanel: "columns",
};
