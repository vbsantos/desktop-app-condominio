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
import FormDespesa from "../../forms/despesa";

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

  // despesa must belong to a condominio
  const { condominio } = props;

  // Opens or Create a Despesa
  const [despesa, setDespesa] = useState(
    props.despesa || {
      id: "",
      nome: "",
      categoria: "",
      valor: "",
      parcelaAtual: "",
      numParcelas: "",
      rateioAutomatico: true,
      permanente: true,
      aguaIndividual: false,
      condominioId: condominio.id,
      Valores: []
    }
  );

  const [valores, setValores] = useState(
    props.despesa ? props.despesa["Valores"] : []
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
        content: despesa
      });
      const neoValores = valores.map(valor => {
        return {
          despesaId: response.id,
          paganteId: valor.paganteId,
          valor: valor.valor
        };
      });
      console.log("CREATE NEO VALORES:", neoValores);
      if (valores.length > 0) {
        const response2 = await window.ipcRenderer.invoke("valores", {
          method: "bulkCreate",
          content: neoValores
        });
        console.log("Valores Cadastrados:", response2);
      }
      console.log("Despesa Cadastrada:", response);
    } else {
      // console.log("EDIT NEO VALORES:", valores);
      const response = await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: despesa
      });
      if (valores.length > 0) {
        if (valores[0].id !== "") {
          // console.log("JUST AN UPDATE:", valores);
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkUpdate",
            content: valores
          });
          console.log("Valores Editados:", response2);
        } else {
          // console.log("IT IS A CREATION:", valores);
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkCreate",
            content: valores
          });
          console.log("Valores Cadastrados:", response2);
        }
      }
      console.log("Despesa Editada:", response);
    }

    setDialog(false);
  }

  return (
    <div id="dialogRegistrarDespesas">
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
          {despesa.id === "" ? "Cadastrar Nova Despesa" : "Editar Despesa"}
        </DialogTitle>
        <DialogContent>
          <FormDespesa
            condominio={condominio}
            despesa={[despesa, setDespesa]}
            valores={[valores, setValores]}
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
            {despesa.id === "" ? "Registrar" : "Editar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
