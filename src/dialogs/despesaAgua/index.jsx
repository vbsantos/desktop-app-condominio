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
import FormDespesaAgua from "../../forms/despesaAgua";

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

const isPrimary = (despesa) => {
  return !despesa.rateioAutomatico;
};

// This function finds the Despesa "B" that complements de Despesa "A"
const findDespesaB = (despesas, despesa_a) => {
  let despesa_b;
  if (despesa_a.aguaIndividual) {
    if (despesa_a.rateioAutomatico) {
      despesa_b = despesas.find(
        (despesa) => despesa.aguaIndividual && isPrimary(despesa)
      );
    } else {
      despesa_b = despesas.find(
        (despesa) => despesa.aguaIndividual && !isPrimary(despesa)
      );
    }
  }
  return despesa_b;
};

// Made to avoid duplicate
const findDespesaAgua = (despesas) => {
  const despesa = despesas.find(
    (despesa) => despesa.aguaIndividual && isPrimary(despesa)
  );
  return despesa;
};

export default function DraggableDialog(props) {
  const [dialog, setDialog] = props.open;
  const [dialogDelete, setDialogDelete] = props.delete;

  // despesa must belong to a condominio
  const { condominio } = props;

  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = useState(false);

  // Opens or Create a Despesa
  const [despesa, setDespesa] = useState(
    props.despesa ||
      findDespesaAgua(condominio["Despesas"]) || {
        id: "",
        nome: "",
        categoria: "",
        valor: "",
        parcelaAtual: null,
        numParcelas: null,
        agua: "",
        aguaIndividual: true,
        rateioAutomatico: false,
        permanente: true,
        fundoReserva: false,
        condominioId: condominio.id,
        informacao: false,
        Valores: [],
      }
  );

  // Finds or Create a Despesa
  const [despesa2, setDespesa2] = useState(
    despesa.id === ""
      ? {
          id: "",
          nome: "",
          categoria: "",
          valor: "",
          parcelaAtual: null,
          numParcelas: null,
          agua: "",
          aguaIndividual: true,
          rateioAutomatico: true,
          permanente: true,
          fundoReserva: false,
          condominioId: condominio.id,
          informacao: false,
          Valores: [],
        }
      : findDespesaB(condominio["Despesas"], despesa)
  );

  const [valores, setValores] = useState(
    despesa.id === ""
      ? [] // criação
      : isPrimary(despesa)
      ? despesa["Valores"] //edição - primary
      : despesa2["Valores"] //edição - secondary
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
    if (despesa.id === "") {
      const response = await window.ipcRenderer.invoke("despesas", {
        method: "create",
        content: despesa,
      });
      console.warn("Despesa Cadastrada:", response);
      const response2 = await window.ipcRenderer.invoke("despesas", {
        method: "create",
        content: despesa2,
      });
      console.warn("Despesa Cadastrada:", response2);
      const neoValores = valores.map((valor) => {
        return {
          despesaId: response.id,
          paganteId: valor.paganteId,
          precoAgua: valor.precoAgua,
          agua: valor.agua,
          valor: valor.valor,
        };
      });
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
      const response2 = await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: despesa2,
      });
      console.warn("Despesa Editada:", response);
      console.warn("Despesa Editada:", response2);
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
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkCreate",
            content: valores,
          });
          console.warn("Valores Cadastrados:", response2);
        }
      }
    }

    setDialog(false);
  }

  return (
    <div id="dialogRegistrarDespesaAgua">
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
            ? "Registrar Despesa de Consumo de Água"
            : "Editar Despesa de Consumo de Água"}
        </DialogTitle>
        <DialogContent>
          <FormDespesaAgua
            condominio={condominio}
            despesa={
              despesa.rateioAutomatico
                ? [despesa2, setDespesa2]
                : [despesa, setDespesa]
            }
            despesa2={
              despesa2.rateioAutomatico
                ? [despesa2, setDespesa2]
                : [despesa, setDespesa]
            }
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
            {despesa.id === "" ? "Registrar" : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
