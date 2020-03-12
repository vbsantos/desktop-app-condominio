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
import FormCondominio from "../../forms/condominio";

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

  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = useState(false);

  // condominio must belong to a beneficiario
  const { beneficiario } = props;

  const [condominio, setCondominio] = useState(
    props.condominio || {
      id: "",
      nome: "",
      cep: "",
      uf: "",
      localidade: "",
      bairro: "",
      logradouro: "",
      numero: "",
      beneficiarioId: beneficiario.id
    }
  );

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
    if (condominio.id === "") {
      const response = await window.ipcRenderer.invoke("condominios", {
        method: "create",
        content: condominio
      });
      console.log("Condomínio Cadastrado:", response);
    } else {
      const response = await window.ipcRenderer.invoke("condominios", {
        method: "update",
        content: condominio
      });
      console.log("Condomínio Editado:", response);
    }

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
          {condominio.id === ""
            ? "Cadastrar Novo Condomínio"
            : "Editar Condomínio"}
        </DialogTitle>
        <DialogContent>
          <FormCondominio
            beneficiario={beneficiario}
            condominio={[condominio, setCondominio]}
            completed={[formCompleted, setFormCompleted]}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          {condominio.id !== "" && (
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
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
            {condominio.id === "" ? "Cadastrar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
