import React, { useState } from "react";
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

// MATERIAL UI ICONS
import { GetApp as SystemUpdate } from "@material-ui/icons";

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
  const [buttonStatus, setButtonStatus] = useState(true);
  const [dialog, setDialog] = props.open;

  // function that runs when the dialog is suposed to close
  function handleClose() {
    console.warn("handleClose");
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    setButtonStatus(false);
    console.warn("handleRightButton");
    const res = await window.ipcRenderer.invoke("updates", {
      method: "download",
      content: null,
    });
    console.warn("handleRightButton - res", res);
    const updateEvents = await window.ipcRenderer.invoke("updates", {
      method: "events",
      content: null,
    });
    updateEvents.on("checking-for-update", () => {
      console.warn("Checking for update...");
    });
    updateEvents.on("update-available", (info) => {
      console.warn("Update available.");
    });
    updateEvents.on("update-not-available", (info) => {
      console.warn("Update not available.");
    });
    updateEvents.on("error", (err) => {
      console.warn("Error in auto-updater. " + err);
    });
    updateEvents.on("download-progress", (progressObj) => {
      let log_message = "Download speed: " + progressObj.bytesPerSecond;
      log_message = log_message + " - Downloaded " + progressObj.percent + "%";
      log_message =
        log_message +
        " (" +
        progressObj.transferred +
        "/" +
        progressObj.total +
        ")";
      console.warn(log_message);
    });
    updateEvents.on("update-downloaded", (info) => {
      console.warn("Update downloaded");
    });
    //  setDialog(false);
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
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
            disabled={buttonStatus}
          >
            <SystemUpdate />
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
