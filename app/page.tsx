"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MassEditor from "./massEditor/MassEditor";
import DialogTitle from "@mui/material/DialogTitle";

const Home = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open simple dialog
      </Button>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
};

export default Home;

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth={true} maxWidth={"lg"} onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <MassEditor onClose={handleClose} />
    </Dialog>
  );
}
