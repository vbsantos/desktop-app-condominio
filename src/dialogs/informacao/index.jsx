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
import FormInformacao from "../../forms/informacao";

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

  // despesa must belong to a condominio
  const { condominio } = props;

  // Opens or Create a Despesa
  const [despesa, setDespesa] = useState(
    props.despesa || {
      id: "",
      nome: "",
      categoria: "",
      valor: "",
      agua: "",
      aguaIndividual: false,
      parcelaAtual: null,
      numParcelas: null,
      rateioAutomatico: false,
      permanente: true,
      fundoReserva: false,
      condominioId: condominio.id,
      informacao: true,
      ativa: true,
      Valores: [],
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
    if (despesa.id === "") {
      const response = await window.ipcRenderer.invoke("despesas", {
        method: "create",
        content: despesa,
      });
      console.warn("Despesa Cadastrada:", response);
    } else {
      const response = await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: despesa,
      });
      console.warn("Despesa Editada:", response);
    }

    setDialog(false);
  }

  return (
    <div id="dialogRegistrarInformacao">
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
          {despesa.id === "" ? "Registrar Informação" : "Editar Informação"}
        </DialogTitle>
        <DialogContent>
          <FormInformacao
            condominio={condominio}
            despesa={[despesa, setDespesa]}
            completed={[formCompleted, setFormCompleted]}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          {despesa.id !== "" && (
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
            >
              <DeleteOutlined />
              <p className="btn-text-ajusted">EXCLUIR</p>
            </Button>
          )}
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
            disabled={!formCompleted}
          >
            <CreateOutlined />
            <p className="btn-text-ajusted">
              {despesa.id === "" ? "Registrar" : "Salvar"}
            </p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
