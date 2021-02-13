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
import FormDespesaParcelada from "../../forms/despesaParcelada";

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
      agua: "",
      aguaIndividual: false,
      rateioAutomatico: true,
      permanente: false,
      fundoReserva: false,
      condominioId: condominio.id,
      informacao: false,
      ativa: true,
      Valores: [],
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

  const getUpdatedValores = (valores, response = null) => {
    return valores.map((valor) => {
      return {
        despesaId: response ? response.id : valor.despesaId,
        paganteId: valor.paganteId,
        precoAgua: valor.precoAgua,
        agua: valor.agua,
        valor: valor.valor,
      };
    });
  };

  // function that runs when you click the right button
  async function handleRightButton() {
    if (despesa.id === "") {
      let response;
      if (despesa.fundoReserva) {
        const fundoReservaId = condominio["Despesas"].find(
          (despesa) => despesa.fundoReserva
        );
        if (fundoReservaId) {
          //if it already exists update
          despesa.id = fundoReservaId.id;
          response = await window.ipcRenderer.invoke("despesas", {
            method: "update",
            content: despesa,
          });
          console.warn("Despesa Editada:", response);
        } else {
          // if it doesn't exists create
          response = await window.ipcRenderer.invoke("despesas", {
            method: "create",
            content: despesa,
          });
          console.warn("Despesa Cadastrada:", response);
        }
      } else {
        // if it isn't fundoReserva create
        response = await window.ipcRenderer.invoke("despesas", {
          method: "create",
          content: despesa,
        });
        console.warn("Despesa Cadastrada:", response);
      }
      const neoValores = getUpdatedValores(valores, response);
      // console.warn("CREATE NEO VALORES:", neoValores);
      if (valores.length > 0) {
        const response2 = await window.ipcRenderer.invoke("valores", {
          method: "bulkCreate",
          content: neoValores,
        });
        console.warn("Valores Cadastrados:", response2);
      }
    } else {
      // console.warn("EDIT NEO VALORES:", valores);
      const response = await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: despesa,
      });
      if (valores.length > 0) {
        if (valores[0].id !== "") {
          // console.warn("JUST AN UPDATE:", valores);
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkUpdate",
            content: valores,
          });
          console.warn("Valores Editados:", response2);
        } else {
          // console.warn("IT IS A CREATION:", valores);
          const neoValores = getUpdatedValores(valores);
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkCreate",
            content: neoValores,
          });
          console.warn("Valores Cadastrados:", response2);
        }
      }
      console.warn("Despesa Editada:", response);
    }

    setDialog(false);
  }

  return (
    <div id="dialogRegistrarDespesaParcelada">
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
          {despesa.id === ""
            ? "Registrar Despesa Parcelada"
            : "Editar Despesa Parcelada"}
        </DialogTitle>
        <DialogContent>
          <FormDespesaParcelada
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
