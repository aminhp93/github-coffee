/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { CustomStatusPanelProps } from "ag-grid-react";
import Popover from "@mui/material/Popover";
import { Button, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import {
  DEFAULT_PROPS,
  DEFAULT_SIDE_BAR,
} from "@/@core/components/table-aggrid/config";

const getDefaultGridFeatures = (data: any) => {
  const result: any = {};
  Object.keys(DEFAULT_PROPS).forEach((i) => {
    result[i] = data.api.getGridOption(i);
  });
  return result;
};

const GridFeaturesStatusPanel = (props: CustomStatusPanelProps) => {
  const [gridFeatures, setGridFeatures] = useState<any>(
    getDefaultGridFeatures(props)
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="flex h-10 items-center mx-1">
      <Button
        size="small"
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        {`Grid Features`}
      </Button>

      <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Advanced filter"
            disabled
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Cell Selection Header Highlight"
            disabled
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Column Groups"
            disabled
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.columnHoverHighlight}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    columnHoverHighlight: event.target.checked,
                  });

                  props.api.setGridOption(
                    "columnHoverHighlight",
                    event.target.checked
                  );
                }}
              />
            }
            label="Column Hover"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.defaultColDef.resizable}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    defaultColDef: {
                      ...gridFeatures.defaultColDef,
                      resizable: event.target.checked,
                    },
                  });

                  props.api.setGridOption("defaultColDef", {
                    ...gridFeatures.defaultColDef,
                    resizable: event.target.checked,
                  });
                }}
              />
            }
            label="Column Resizing"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.sideBar !== undefined}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    sideBar: event.target.checked
                      ? DEFAULT_SIDE_BAR
                      : (undefined as any),
                  });

                  props.api.setGridOption(
                    "sideBar",
                    event.target.checked ? DEFAULT_SIDE_BAR : undefined
                  );
                }}
              />
            }
            label="Columns Tool Panel"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Floating Filters"
            disabled
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.pagination}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    pagination: event.target.checked,
                  });

                  props.api.setGridOption("pagination", event.target.checked);
                }}
              />
            }
            label="Pagination"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.enableRtl}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    enableRtl: event.target.checked,
                  });

                  // props.api.setGridOption("enableRtl", event.target.checked);
                }}
              />
            }
            disabled
            label="Right To Left"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.rowDragManaged}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    pagination: false,
                    rowDragManaged: event.target.checked,
                  });

                  // setColDefs(
                  //   DEFAULT_COL_DEFS.map((colDef, index) => {
                  //     if (index === 0) {
                  //       return {
                  //         ...colDef,
                  //         rowDrag: event.target.checked,
                  //       };
                  //     }
                  //     return colDef;
                  //   })
                  // );

                  props.api.updateGridOptions({
                    pagination: false,
                    rowDragManaged: event.target.checked,
                    columnDefs: props.api
                      .getColumnDefs()
                      ?.map((colDef, index) => {
                        if (index === 0) {
                          return {
                            ...colDef,
                            rowDrag: event.target.checked,
                          };
                        }
                        return colDef;
                      }),
                  });
                }}
              />
            }
            label="Row Drag"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Row Grouping"
            disabled
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.rowNumbers}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    rowNumbers: event.target.checked,
                  });

                  props.api.setGridOption("rowNumbers", event.target.checked);
                }}
              />
            }
            label="Row Numbers"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.rowSelection}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    rowSelection: event.target.checked
                      ? {
                          mode: "multiRow",
                        }
                      : (undefined as any),
                  });

                  props.api.setGridOption(
                    "rowSelection",
                    event.target.checked
                      ? {
                          mode: "multiRow",
                        }
                      : undefined
                  );
                }}
              />
            }
            label="Row Selection"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Show Integrated Chart Popup"
            disabled
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.statusBar !== undefined}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    statusBar: event.target.checked
                      ? DEFAULT_PROPS.statusBar
                      : (undefined as any),
                  });

                  props.api.setGridOption(
                    "statusBar",
                    event.target.checked ? DEFAULT_PROPS.statusBar : undefined
                  );
                }}
              />
            }
            label="Status Bar"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gridFeatures.suppressMenuHide}
                onChange={(event) => {
                  setGridFeatures({
                    ...gridFeatures,
                    suppressMenuHide: event.target.checked,
                  });

                  props.api.setGridOption(
                    "suppressMenuHide",
                    event.target.checked
                  );
                }}
              />
            }
            label="suppressMenuHide"
          />
        </FormGroup>
      </Popover>
    </div>
  );
};

export default GridFeaturesStatusPanel;
