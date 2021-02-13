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
  const { beneficiario } = props;

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    const response = await window.ipcRenderer.invoke("beneficiarios", {
      method: "delete",
      content: { id: beneficiario.id },
    });
    response === 1
      ? console.warn(`Beneficiário excluido: [id=${beneficiario.id}]`)
      : console.warn(`Falha ao excluir Beneficiário: [id=${beneficiario.id}]`);
    setDialog(false);
  }

  return (
    <div id="dialogDeletarBeneficiario">
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
          Deseja excluir <strong>{beneficiario.nome}</strong>?
        </DialogTitle>
        <DialogContent>
          {`A exclusão desse administrador acarretará na exclusão de todos os condomínios cadastrados por ele e não poderá ser desfeita.`}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            FECHAR
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
