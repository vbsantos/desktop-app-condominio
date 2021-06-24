import React from "react";
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

export default function DraggableDialog(props) {
  const condominio = props.condominio;

  const isOpen = props.isOpen;
  const closeDialog = props.close;

  const despesa = props.despesa;
  const despesa2 = props.despesa2;
  const valores = props.valores;

  const closeForm = props.closeForm;
  const openAlert = props.openAlert;

  const getConsumo = (paganteId) =>
    condominio["Pagantes"].find((pagante) => pagante.id === paganteId)
      .leituraAgua;

  // Function that runs when the dialog is suposed to close
  function handleLeftButton() {
    closeDialog();
  }

  function separaValores(valores) {
    const valor_unidade_comercial = [];
    const valores_sem_unidade_comercial = valores.filter((valor) => {
      const pagante = condominio["Pagantes"].find(
        (pagante) => pagante.id === valor.paganteId
      );
      if (pagante.unidadeComercial) {
        valor_unidade_comercial.push(valor);
        return false;
      }
      return true;
    });
    return [valores_sem_unidade_comercial, valor_unidade_comercial];
  }

  async function saveFixedValores(updated_valor_total, updated_valores) {
    const updated_valor_total2 =
      despesa.agua + despesa2.agua - updated_valor_total;
    if (despesa.id === "") {
      const response = await window.ipcRenderer.invoke("despesas", {
        method: "create",
        content: isPrimary(despesa)
          ? { ...despesa, valor: updated_valor_total }
          : {
              ...despesa,
              valor: updated_valor_total2,
            },
      });
      console.warn("Despesa Cadastrada:", response);
      const response2 = await window.ipcRenderer.invoke("despesas", {
        method: "create",
        content: isPrimary(despesa2)
          ? { ...despesa2, valor: updated_valor_total }
          : {
              ...despesa2,
              valor: updated_valor_total2,
            },
      });
      console.warn("Despesa Cadastrada:", response2);
      const neoValores = updated_valores.map((valor) => {
        return {
          despesaId: response.id,
          paganteId: valor.paganteId,
          precoAgua: valor.precoAgua,
          agua: valor.agua,
          valor: valor.valor,
        };
      });
      if (updated_valores.length > 0) {
        const response2 = await window.ipcRenderer.invoke("valores", {
          method: "bulkCreate",
          content: neoValores,
        });
        console.warn("Valores Cadastrados:", response2);
      }
    } else {
      const response = await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: isPrimary(despesa)
          ? { ...despesa, valor: updated_valor_total }
          : { ...despesa, valor: updated_valor_total2 },
      });
      const response2 = await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: isPrimary(despesa2)
          ? { ...despesa2, valor: updated_valor_total }
          : { ...despesa2, valor: updated_valor_total2 },
      });
      console.warn("Despesa Editada:", response);
      console.warn("Despesa Editada:", response2);
      if (updated_valores.length > 0) {
        if (updated_valores[0].id !== "") {
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkUpdate",
            content: updated_valores,
          });
          console.warn("Valores Editados:", response2);
        } else {
          const response2 = await window.ipcRenderer.invoke("valores", {
            method: "bulkCreate",
            content: updated_valores,
          });
          console.warn("Valores Cadastrados:", response2);
        }
      }
    }

    closeForm(); // fecha formulário
  }

  async function fixValores() {
    // Separa o "valor" que será pago pela unidade comercial
    const [valores_residenciais, valores_comerciais] = separaValores(valores);

    // Recalcula % e diminui preco da água exatamente quanto precisa

    // RESIDENCIAL
    const valorResidencialMaximo = despesa.agua;
    const valorResidencialAtual = valores_residenciais.reduce(
      (acc, valor) => acc + valor.valor,
      0
    );
    let updated_valores_residenciais = [];
    if (valorResidencialMaximo < valorResidencialAtual) {
      const modificadorResidencial =
        valorResidencialMaximo / valorResidencialAtual;
      updated_valores_residenciais = valores_residenciais.map((valor) => {
        const consumo_anterior = getConsumo(valor.paganteId);
        const temp = valor.precoAgua * modificadorResidencial;
        valor.precoAgua = Math.round(temp * 100) / 100;
        valor.valor = valor.precoAgua * (valor.agua - consumo_anterior);
        return valor;
      });
    }

    // COMERCIAL
    const valorComercialMaximo = despesa2.agua;
    const valorComercialAtual = valores_comerciais.reduce(
      (acc, valor) => acc + valor.valor,
      0
    );
    let updated_valores_comerciais = [];
    if (valorComercialMaximo < valorComercialAtual) {
      const modificadorComercial = valorComercialMaximo / valorComercialAtual;
      updated_valores_comerciais = valores_comerciais.map((valor) => {
        const consumo_anterior = getConsumo(valor.paganteId);
        const temp = valor.precoAgua * modificadorComercial;
        valor.precoAgua = Math.round(temp * 100) / 100;
        valor.valor = valor.precoAgua * (valor.agua - consumo_anterior);
        return valor;
      });
    }

    // FINALIZA
    const valores_residenciais_invalidos =
      updated_valores_residenciais.length > 0 &&
      updated_valores_residenciais[0].valor < 0;
    const valores_comerciais_invalidos =
      updated_valores_comerciais.length > 0 &&
      updated_valores_comerciais[0].valor < 0;
    if (valores_residenciais_invalidos || valores_comerciais_invalidos) {
      // avisar que não foi possível alterar valores corretamente
      openAlert();
    } else {
      const updated_valores = [];

      if (updated_valores_residenciais.length != 0) {
        updated_valores_residenciais.forEach((element) => {
          updated_valores.push(element);
        });
      } else {
        valores_residenciais.forEach((element) => {
          updated_valores.push(element);
        });
      }

      if (updated_valores_comerciais.length != 0) {
        updated_valores_comerciais.forEach((element) => {
          updated_valores.push(element);
        });
      } else {
        valores_comerciais.forEach((element) => {
          updated_valores.push(element);
        });
      }
      const updated_valor_total = updated_valores.reduce(
        (acc, valor) => acc + valor.valor,
        0
      );
      // salvar valores alterados corretamente
      await saveFixedValores(updated_valor_total, updated_valores);
    }
  }

  // Function that runs when you click the right button
  async function handleConfirmFix() {
    await fixValores();
    closeDialog();
  }

  return (
    <div id="dialogConfirmar">
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        color="secondary"
      >
        {props.title && (
          <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
            color="inherit"
          >
            {props.title}
          </DialogTitle>
        )}
        {props.content && <DialogContent>{props.content}</DialogContent>}
        <DialogActions>
          <Button
            onClick={handleLeftButton}
            variant="outlined"
            color="secondary"
          >
            NÃO
          </Button>
          <Button
            onClick={handleConfirmFix}
            variant="contained"
            color="primary"
          >
            SIM
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
