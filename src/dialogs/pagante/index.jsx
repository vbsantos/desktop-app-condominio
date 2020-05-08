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

// FORM COMPONENTS
import FormPagante from "../../forms/pagante";

// CSS
import "./style.css";

// ICONS
import { DeleteOutlined } from "@material-ui/icons";
import { CreateOutlined } from "@material-ui/icons";

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
  const [dialogDelete, setDialogDelete] = props.delete;

  // pagante must belong to a condominio
  const { condominio } = props;

  const [pagante, setPagante] = useState(
    props.pagante || {
      id: "",
      nome: "",
      complemento: "",
      fracao: "",
      leituraAgua: "",
      condominioId: condominio.id,
    }
  );

  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = useState(false);

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // function that runs when for delete confirmation
  function handleDelete() {
    setDialogDelete(true);
    setDialog(false);
  }

  // function that runs when you click the right button
  async function handleRightButton() {
    if (pagante.id === "") {
      const response = await window.ipcRenderer.invoke("pagantes", {
        method: "create",
        content: pagante,
      });
      console.warn("Pagante Cadastrado:", response);
    } else {
      const response = await window.ipcRenderer.invoke("pagantes", {
        method: "update",
        content: pagante,
      });
      console.warn("Pagante Editado:", response);
    }
    setDialog(false);
  }

  return (
    <div id="dialogRegistrarPagante">
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
          {pagante.id === "" ? "Cadastrar Novo Pagante" : "Editar Pagante"}
        </DialogTitle>
        <DialogContent>
          <FormPagante
            condominio={condominio}
            pagante={[pagante, setPagante]}
            completed={[formCompleted, setFormCompleted]}
          />
        </DialogContent>
        <DialogActions className="dialogButtons">
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          {pagante.id !== "" && (
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
              display="false"
              disabled={pagante.id === ""}
            >
              <DeleteOutlined />
              Excluir
            </Button>
          )}
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
            disabled={!formCompleted}
          >
            <CreateOutlined />
            {pagante.id === "" ? "Cadastrar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
