/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import type { CustomStatusPanelProps } from "ag-grid-react";
import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";

const SelectedStatusPanel = (props: CustomStatusPanelProps) => {
  const [selectedRows, setSelectedRows] = useState<any>([]);

  useEffect(() => {
    const onRowSelectionChanged = () => {
      setSelectedRows(props.api.getSelectedRows()); // Update count based on selected rows
    };

    props.api.addEventListener("rowSelected", onRowSelectionChanged); // Listen for row selection changes

    // Get the initial count
    onRowSelectionChanged();

    return () => {
      props.api.removeEventListener("rowSelected", onRowSelectionChanged); // Clean up the event listener
    };
  }, [props.api]);

  const handleUnselect = useCallback(() => {
    props.api.deselectAll();
  }, [props.api]);

  return (
    <div className="flex h-10 items-center mx-1">
      <Button
        size="small"
        variant="contained"
        endIcon={<Close />}
        disabled={selectedRows.length === 0}
        onClick={handleUnselect}
      >
        {`Selected: ${selectedRows.length}`}
      </Button>
    </div>
  );
};

export default SelectedStatusPanel;
