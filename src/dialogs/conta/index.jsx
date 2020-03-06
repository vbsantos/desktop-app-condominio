import React, { useState } from "react";
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

// FORM COMPONENTS
import FormConta from "../../forms/conta";

// CSS
import "./style.css";

// MATERIAL UI ICONS
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

  const [conta, setConta] = useState(
    props.conta || {
      id: "",
      nome: "",
      descricao: "",
      valor: "",
      tipo: ""
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
    console.log("Conta Registrada");
    setDialog(false);
  }

  return (
    <div id="dialogRegistrarConta">
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
          Registrar Nova Despesa
        </DialogTitle>
        <DialogContent>
          <FormConta
            conta={[conta, setConta]}
            completed={[formCompleted, setFormCompleted]}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          {"" === "" && (
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
              disabled={true === ""}
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
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
