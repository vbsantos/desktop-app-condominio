import React from "react";
import Draggable from "react-draggable";

// MATERIAL UI COMPONENTS
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper
} from "@material-ui/core";

// MATERIAL UI ICONS
import { DeleteOutlined } from "@material-ui/icons";

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
  const { despesa } = props;

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    const response = await window.ipcRenderer.invoke("despesas", {
      method: "delete",
      content: { id: despesa.id }
    });
    response === 1
      ? console.warn(`Despesa [${despesa.id}] removida`)
      : console.warn(`Falha ao remover Despesa [${despesa.id}]`);
    setDialog(false);
  }

  return (
    <div id="dialogDeletarConta">
      <Dialog
        open={dialog}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          color="inherit"
        >
          Tem certeza que deseja remover a despesa{" "}
          <strong>{despesa.nome}</strong>?
        </DialogTitle>
        <DialogContent>Essa ação não poderá ser desfeita.</DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="secondary"
          >
            <DeleteOutlined />
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
