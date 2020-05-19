import React from "react";
import Draggable from "react-draggable";

// MATERIAL UI COMPONENTS
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@material-ui/core";

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

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    setDialog(false);
  }

  return (
    <div id="dialogSalvarRelatorios">
      <Dialog
        open={dialog}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        color="secondary"
      >
        {props.title && (
          <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
            color="inherit"
          >
            {props.title}
          </DialogTitle>
        )}
        {props.content && <DialogContent>{props.content}</DialogContent>}
        <DialogActions>
          <Button
            onClick={handleRightButton}
            variant="outlined"
            color="secondary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
