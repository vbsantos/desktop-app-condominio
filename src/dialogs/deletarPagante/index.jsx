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

// MATERIAL UI ICONS
import { DeleteOutlined } from "@material-ui/icons";

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
  const { pagante } = props;

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    const response = await window.ipcRenderer.invoke("pagantes", {
      method: "delete",
      content: { id: pagante.id },
    });
    response === 1
      ? console.warn(`Pagante excluido: [id=${pagante.id}]`)
      : console.warn(`Falha ao excluir Pagante: [id=${pagante.id}]`);
    setDialog(false);
  }

  return (
    <div id="dialogDeletarPagante">
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
          Deseja excluir <strong>{pagante.nome}</strong>?
        </DialogTitle>
        <DialogContent>
          {`A exclusão desse Condômino acarretará na exclusão de todos os Relatórios dele e não poderá ser desfeita.`}
        </DialogContent>
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
            <p className="btn-text-ajusted">EXCLUIR</p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
