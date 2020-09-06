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
  const { condominio } = props;

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    const response = await window.ipcRenderer.invoke("condominios", {
      method: "delete",
      content: { id: condominio.id },
    });
    response === 1
      ? console.warn(`Condomínio excluido: [id=${condominio.id}]`)
      : console.warn(`Falha ao excluir Condomínio: [id=${condominio.id}]`);
    setDialog(false);
  }

  return (
    <div id="dialogDeletarCondominio">
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
          Deseja excluir <strong>{condominio.nome}</strong>?
        </DialogTitle>
        <DialogContent>
          {condominio["Pagantes"].length > 0
            ? `A exclusão desse Condomínio acarretará na exclusão de ${condominio["Pagantes"].length} Condôminos e não poderá ser desfeita.`
            : "Essa ação não poderá ser desfeita."}
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
