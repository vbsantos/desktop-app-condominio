import React from "react";
import Draggable from "react-draggable";

// MATERIAL UI COMPONENTS
import { Dialog, DialogContent, DialogTitle, Paper } from "@material-ui/core";

// MATERIAL UI COMPONENTS
import CircularProgress from "@material-ui/core/CircularProgress";

// CSS
import "./style.css";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  const [dialog, setDialog] = props.open;
  return (
    <div id="dialogCarregando">
      <Dialog
        open={dialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          color="inherit"
        >
          {props.title}
        </DialogTitle>
        <DialogContent>
          <CircularProgress color="secondary" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
