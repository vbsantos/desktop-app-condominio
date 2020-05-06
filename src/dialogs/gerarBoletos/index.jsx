import React, { useState } from "react";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

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
import FormBoleto from "../../forms/boleto";

// CSS
import "./style.css";

// MATERIAL UI ICONS
import { AssignmentOutlined } from "@material-ui/icons";

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

  // app data
  const [data, setData] = props.data;

  // The categories setted during Despesa registration
  const { categorias } = props;

  // All data from this condominio
  const { condominio } = props;

  // Both tokens needed to access the API
  const [accessToken, accountToken] = props.tokens;

  // Sum of all despesas
  const [total] = props.valorTotal;

  // Percentage and value of fundoReserva
  const [percentage] = props.valorFundoReserva;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // True when the form isso all filled
  const [formCompleted, setFormCompleted] = useState(false);

  // Holds boleto field values
  const [boleto, setBoleto] = useState({
    id: "",
    emissao: "",
    vencimento: "",
    documento: "",
    titulo: "",
    numero: "",
    valor: "",
    paganteId: "",
  });

  // This function turns the GeneralReport data into a string
  const makeGeneralReportJSON = (categorias, despesas) => {
    const generalReport = categorias.map((categoria) => {
      const despesasByCategory = despesas.filter(
        (despesa) => despesa.categoria === categoria
      );
      return {
        table: true,
        name: categoria,
        data: [...despesasByCategory],
      };
    });
    generalReport.push({
      table: false,
      name: "fundoReserva",
      data: percentage[1].toFixed(2),
    });
    generalReport.push({
      table: false,
      name: "total",
      data: (total + percentage[1]).toFixed(2),
    });
    console.warn("Relatório Geral:", generalReport);
    const generalReportJSON = JSON.stringify(generalReport);
    return generalReportJSON;
  };

  // This function turns the IndividualReport data into a string
  const makeIndividualReportJSON = (categorias, despesas, pagantes) => {
    const individualReportsJSON = pagantes.map((pagante) => {
      let totalIndividual = 0;
      const individualReport = categorias.map((categoria) => {
        const despesasByCategory = despesas
          .filter((despesa) => despesa.categoria === categoria)
          .map((despesa) => {
            const valor = despesa.rateioAutomatico
              ? Number(despesa.valor * pagante.fracao)
              : Number(
                  despesa["Valores"].filter(
                    (valor) => valor.paganteId === pagante.id
                  )[0].valor
                );
            totalIndividual += valor;
            return {
              ...despesa,
              valor: valor.toFixed(2),
            };
          });
        // const despesasByCategoryEssencial = despesasByCategory.map(
        //   despesa => delete despesa["Valores"]
        // );
        return {
          table: true,
          name: categoria,
          data: [...despesasByCategory],
        };
      });
      const fundoReservaIndividual = (percentage[0] / 100) * totalIndividual;
      individualReport.push({
        table: false,
        name: "fundoReserva",
        data: fundoReservaIndividual.toFixed(2),
      });
      individualReport.push({
        table: false,
        name: "total",
        data: (totalIndividual + fundoReservaIndividual).toFixed(2),
      });
      console.warn("Relatório Individual:", individualReport);
      return {
        paganteId: pagante.id,
        report: JSON.stringify(individualReport), //FIXME: acho que aqui da pra fazer ele retornar o objeto, pra poder utilizar no momento de pegar o valor "total"
      };
    });
    return individualReportsJSON;
  };

  // function that runs when the dialog is suposed to close
  function handleClose() {
    setDialog(false);
  }

  // TODO: This funcions turns a React Component into a PDF
  // const getComponentPrint = (ref) => {
  //   if (ref.current) {
  //     html2canvas(ref.current).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       //salva o base64 em uma variável que vai pro backend
  //       if (data.reports.generalReport) {
  //         window.ipcRenderer.invoke("files", {
  //           method: "generateGeneralReport",
  //           content: imgData,
  //         });
  //       } else {
  //         window.ipcRenderer.invoke("files", {
  //           method: "generateIndividualReport",
  //           content: imgData,
  //         });
  //       }
  //     });
  //     return true;
  //   }
  //   return false;
  // };

  // function that runs when you click the right button
  async function handleRightButton() {
    // CRIA RELATORIO GERAL
    const relatorioGeral = await makeGeneralReportJSON(
      categorias,
      condominio["Despesas"]
    );
    // TODO REMOVER
    console.groupCollapsed("RG");
    console.log(relatorioGeral);
    console.groupEnd("RG");

    // TODO ARMAZENAR RELATÓRIOS NO DATA PARA USO POSTERIOR
    // GERA RELATORIO GERAL
    await window.ipcRenderer.invoke("generalReports", {
      //FIXME e se eu só fizesse isso na proxima tela junto aos boletos?
      method: "create",
      content: {
        report: relatorioGeral,
        condominioId: condominio.id,
      },
    });

    // CRIA RELATORIOS INDIVIDUAIS
    const relatoriosIndividuais = await makeIndividualReportJSON(
      categorias,
      condominio["Despesas"],
      condominio["Pagantes"]
    );
    // TODO REMOVER
    console.groupCollapsed("RIs");
    console.log(relatoriosIndividuais);
    console.groupEnd("RIs");

    // TODO ARMAZENAR RELATÓRIOS NO DATA PARA USO POSTERIOR
    // GERA RELATORIOS INDIVIDUAIS
    relatoriosIndividuais.forEach((individualReport) => {
      window.ipcRenderer.invoke("individualReports", {
        //FIXME e se eu só fizesse isso na proxima tela junto aos boletos?
        method: "create",
        content: { ...individualReport },
      });
    });

    // CRIA ESTRUTURA COM RELATORIOS EM JSON
    const lastReports = {
      rg: relatorioGeral,
      ris: relatoriosIndividuais,
    };

    // CRIA ESTRUTURA PARA GERAR BOLETOS
    const boletos = {
      accessToken,
      data: {
        // [FIXO] BENEFICIARIO
        accountToken: accountToken,
        // [FIXO] BOLETO
        emissao: boleto.emissao,
        vencimento: boleto.vencimento,
        documento: boleto.documento,
        titulo: boleto.titulo,
        // [FIXO] CONDOMINIO -> ENDERECO
        cep: condominio.cep,
        uf: condominio.uf,
        localidade: condominio.localidade,
        bairro: condominio.bairro,
        logradouro: condominio.logradouro,
        numero: condominio.numero,
        paganteData: data.pagantes, //array com todas as informações que variam do pagante
        relatorioGeralBase64: "", //FIXME
      },
    };

    // TODO REMOVER
    console.groupCollapsed("BOLETOS");
    console.log(boletos);
    console.groupEnd("BOLETOS");

    setData({
      ...data,
      boletos,
      lastReports,
    });
    setDialog(false);
    navigate("/VisualizarRelatoriosGerados");
  }

  return (
    <div id="dialogGerarRelatorio">
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
          Confirmar despesas e gerar boletos?
        </DialogTitle>
        <DialogContent>
          <FormBoleto
            boleto={[boleto, setBoleto]}
            completed={[formCompleted, setFormCompleted]}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            color="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRightButton}
            variant="contained"
            color="primary"
            disabled={!formCompleted}
          >
            <AssignmentOutlined />
            Gerar Boletos
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
