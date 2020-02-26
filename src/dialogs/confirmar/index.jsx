import React, { useState, useRef } from "react";
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
      content: { id: condominio.id }
    });
    response === 1
      ? console.warn(`Condomínio [id=${condominio.id}] excluido`)
      : console.warn(`Falha ao excluir condomínio [id=${condominio.id}]`);
    setDialog(false);
  }

  return (
    <div id="dialogRegistrarBeneficiario">
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
          Tem certeza que deseja excluir {condominio.nome}?
        </DialogTitle>
        <DialogContent>
          {condominio["Pagantes"].length > 0
            ? `A exclusão desse condomínio acarretará na exclusão de ${condominio["Pagantes"].length} moradores e não poderá ser desfeita.`
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
            variant="outlined"
            color="secondary"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
