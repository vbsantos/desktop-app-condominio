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
import Confirmar from "../../dialogs/confirmar";
import Alerta from "../../dialogs/alerta";

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

  // Modal Confirmar
  const [openFixModal, setOpenFixModal] = useState(false);

  // Modal Alertar
  const [openAlertModal, setOpenAlertModal] = useState(false);

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
        ativa: true,
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
          ativa: true,
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

  async function cadastrarDespesas() {
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
      if (valores.length > 0) {
        const response2 = await window.ipcRenderer.invoke("valores", {
          method: "bulkCreate",
          content: neoValores,
        });
        console.warn("Valores Cadastrados:", response2);
      }
    } else {
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
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkUpdate",
            content: valores,
          });
          console.warn("Valores Editados:", response2);
        } else {
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

  // function that runs when you click the right button
  async function handleRightButton() {
    if (despesa2.valor < 0 || despesa.valor < 0) {
      setOpenFixModal(true);
    } else {
      await cadastrarDespesas();
    }
  }

  return (
    <div id="dialogRegistrarDespesaAgua">
      {/* MODAL PARA DIZER QUE NÃO FOI POSSIVE ALTERAR */}
      <Alerta
        open={[openAlertModal, setOpenAlertModal]}
        title={"Falha ao alterar o preço unitário da água"}
        content={
          "Não foi possível realizar a alteração, possivelmente a despesa contém valores incorretos."
        }
      />

      {/* MODAL PARA CONFIRMAR ALTERAÇÃO */}
      <Confirmar
        isOpen={openFixModal}
        close={() => setOpenFixModal(false)}
        closeForm={() => setDialog(false)}
        openAlert={() => setOpenAlertModal(true)}
        condominio={condominio}
        despesa={despesa}
        despesa2={despesa2}
        valores={valores}
        title={"Essa despesa gerou valores negativos"}
        content={
          "Deseja que o sistema diminua do preço unitário da água afim de corrigir os valores?"
        }
      />

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
            ? "Incluir Despesa de Consumo de Água"
            : "Alterar Despesa de Consumo de Água"}
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
            FECHAR
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
              {despesa.id === "" ? "Incluir" : "Salvar"}
            </p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
