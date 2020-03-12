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
import FormBeneficiario from "../../forms/beneficiario";

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

  const [beneficiario, setBeneficiario] = useState(
    props.beneficiario || {
      id: "",
      nome: "",
      cprf: "",
      token_acesso: "",
      token_conta: "",
      cep: "",
      uf: "",
      localidade: "",
      bairro: "",
      logradouro: "",
      numero: "",
      complemento: ""
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
    if (beneficiario.id === "") {
      const response = await window.ipcRenderer.invoke("beneficiarios", {
        method: "create",
        content: beneficiario
      });
      console.log("Beneficiário Cadastrado:", response);
    } else {
      const response = await window.ipcRenderer.invoke("beneficiarios", {
        method: "update",
        content: beneficiario
      });
      console.log("Beneficiário Editado:", response);
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
          {beneficiario.id === ""
            ? "Cadastrar Novo Beneficiário"
            : "Editar Beneficiário"}
        </DialogTitle>
        <DialogContent>
          <FormBeneficiario
            beneficiario={[beneficiario, setBeneficiario]}
            completed={[formCompleted, setFormCompleted]}
          />
        </DialogContent>
        <DialogActions className="dialogButtons">
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          {beneficiario.id !== "" && (
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
            {beneficiario.id === "" ? "Cadastrar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
