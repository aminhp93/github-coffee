import { useRef, useState, useMemo } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { TableAggrid } from "@/@core/components/table-aggrid";
import { AgGridReact } from "ag-grid-react";
import SelectedStatusPanel from "@/@core/components/table-aggrid/status-panel/SelectedStatusPanel";
import GridFeaturesStatusPanel from "@/@core/components/table-aggrid/status-panel/GridFeaturesStatusPanel";
import { StatusPanelDef, RowSelectionOptions } from "ag-grid-community";

const ListItemWrapper = ({
  children,
  listItems,
}: {
  children?: React.ReactNode;
  listItems: any[];
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const [disabledAddRow, setDisabledAddRow] = useState(false);

  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        {
          statusPanel: SelectedStatusPanel,
          align: "left",
        },

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

  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
      // checkboxes: false,
      // headerCheckbox: false,
      // enableClickSelection: true,
    };
  }, []);

  const addNewRow = () => {
    // add new empty row
    // disable add row
    if (gridRef.current) {
      const newItem = {
        id: "",
        content: "",
        start: "",
      };
      gridRef.current.api.applyTransaction({ add: [newItem] });
    }
    setDisabledAddRow(true);
  };

  const handleCellValueChanged = (event: any) => {
    console.log("Cell value changed:", event);
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>List Item</Button>
      {children}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <div
          style={{
            height: "100%",
            width: "800px",
          }}
        >
          <TableAggrid
            ref={gridRef}
            columnDefs={[
              { field: "id" },
              { field: "content" },
              { field: "start" },
              {
                field: "actions",
                cellRenderer: (params: any) => {
                  // only show if not id
                  if (params.data.id === "") {
                    return (
                      //    add button to validate before add new row
                      <Button
                        onClick={() => {
                          console.log("validate before add new row", params);
                          if (!params.data.content || !params.data.start) {
                            alert("Invalid content or start date");
                            return;
                          }

                          setDisabledAddRow(false);
                        }}
                        variant="contained"
                        color="error"
                      >
                        Add
                      </Button>
                      //    add button to validate before add new row
                    );
                  }
                  return null;
                },
              },
            ]}
            defaultColDef={{
              editable: true,
            }}
            onCellValueChanged={handleCellValueChanged} // Handle cell edits
            rowData={listItems}
            statusBar={statusBar}
            rowSelection={rowSelection}
          />
          <Button disabled={disabledAddRow} onClick={addNewRow}>
            {`Add new row`}
          </Button>
          <Button>{`[WIP} Delete selected row `}</Button>
        </div>
      </Drawer>
    </div>
  );
};
export { ListItemWrapper };
