import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// CSS
import "./style.css";

// DIALOGS
import DialogExcluirDespesa from "../../dialogs/deletarDespesa";
import DialogEscolherDespesa from "../../dialogs/escolherDespesa";
import DialogDespesaFixa from "../../dialogs/despesaFixa";
import DialogDespesaParcelada from "../../dialogs/despesaParcelada";
import DialogDespesaAgua from "../../dialogs/despesaAgua";
import DialogDespesaFundoReserva from "../../dialogs/despesaFundoReserva";
import DialogAlerta from "../../dialogs/alerta";

// REPORTS
import RelatorioCondominioRegistrar from "../../reports/relatorioRegistrar";

export default function RegistrarDespesas(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Store the Despesas by Categoria
  const [categorias, setCategorias] = useState([]);

  // Store the total value
  const [total, setTotal] = useState(0);

  // Store the fundoReserva percentage and value
  const [percentage, setPercentage] = useState([0, 0]);

  // ID of the selected Despesa
  const [selectedDespesa, setSelectedDespesa] = useState({ id: -1 });

  // Boolean for Choose Dialog
  const [dialogEscolherDespesa, setDialogEscolherDespesa] = useState(false);

  // CADASTRAR DESPESA
  // Boolean for Despesa Fixa Dialog
  const [dialogDespesaFixa, setDialogDespesaFixa] = useState(false);
  // Boolean for Despesa Parcelada Dialog
  const [dialogDespesaParcelada, setDialogDespesaParcelada] = useState(false);
  // Boolean for Despesa Agua Dialog
  const [dialogDespesaAgua, setDialogDespesaAgua] = useState(false);
  // Boolean for Fundo Reserva Dialog
  const [dialogDespesaFundoReserva, setDialogDespesaFundoReserva] = useState(
    false
  );

  // EDITAR DESPESA
  // Boolean for Despesa Fixa Dialog
  const [dialogEditDespesaFixa, setDialogEditDespesaFixa] = useState(false);
  // Boolean for Despesa Parcelada Dialog
  const [dialogEditDespesaParcelada, setDialogEditDespesaParcelada] = useState(
    false
  );
  // Boolean for Despesa Agua Dialog
  const [dialogEditDespesaAgua, setDialogEditDespesaAgua] = useState(false);
  // Boolean for Fundo Reserva Dialog
  const [
    dialogEditDespesaFundoReserva,
    setDialogEditDespesaFundoReserva,
  ] = useState(false);

  // Boolean for Delete Dialog
  const [dialogDeleteDespesa, setDialogDeleteDespesa] = useState(false);

  // Boolean for Alert Dialog
  const [dialogAlert, setDialogAlert] = useState(false);

  console.groupCollapsed("RegistrarDespesas: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("RegistrarDespesas: System data");

  // This function runs only when the component is monted
  useEffect(() => {
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR",
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: "Registrar Nova Despesa",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: true,
          value: "Gerar Relatórios",
        },
      ],
      action: -1,
    });
    return () => console.log("RegistrarDespesas - Encerrou");
  }, []);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("RegistrarDespesas - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/EscolherCondominio");
        break;
      case 1:
        console.log("RegistrarDespesas - Botão do Centro");
        setFootbar({ ...footbar, action: -1 });
        setDialogEscolherDespesa(true);
        break;
      case 2:
        console.log("RegistrarDespesas - Botão da direita");
        setFootbar({ ...footbar, action: -1 });

        (async () => {
          const despesas = data.allNestedCondominio["Despesas"];
          if (despesas.length > 0) {
            await putReportsOnLastReports(categorias, data.allNestedCondominio);
            navigate("/VisualizarRelatoriosGerados");
          } else {
            setDialogAlert(true);
          }
        })();

        break;
    }
  }, [footbar.action]);

  // This function runs only when the dialogs are closed
  useEffect(() => {
    data.beneficiario.id || navigate("/");
    const allDialogsClosed = !(
      dialogDespesaFixa ||
      dialogDespesaParcelada ||
      dialogDespesaAgua ||
      dialogDespesaFundoReserva ||
      dialogEditDespesaFixa ||
      dialogEditDespesaParcelada ||
      dialogEditDespesaAgua ||
      dialogEditDespesaFundoReserva ||
      dialogDeleteDespesa
    );
    if (allDialogsClosed) {
      async function getEverything() {
        console.time("Get all data from database");
        const allNestedBeneficiario = await window.ipcRenderer.invoke(
          "beneficiarios",
          {
            method: "showNested",
            content: { id: data.beneficiario.id },
          }
        );
        const allNestedCondominio = allNestedBeneficiario["Condominios"].filter(
          (condominio) => condominio.id === data.allNestedCondominio.id
        )[0];
        setData({
          ...data,
          allNestedBeneficiario,
          allNestedCondominio,
        });
        console.timeEnd("Get all data from database");
      }
      getEverything();
    }
  }, [
    dialogDespesaFixa,
    dialogDespesaParcelada,
    dialogDespesaAgua,
    dialogDespesaFundoReserva,
    dialogEditDespesaFixa,
    dialogEditDespesaParcelada,
    dialogEditDespesaAgua,
    dialogEditDespesaFundoReserva,
    dialogDeleteDespesa,
  ]);

  // This function runs only when something change in Despesas
  useEffect(() => {
    let total = 0;
    let allCategorias = [];
    let porcentagem = 0;

    for (const despesa of data.allNestedCondominio["Despesas"]) {
      if (!despesa.fundoReserva) {
        total += Number(despesa.valor);
        allCategorias.push(despesa.categoria);
      } else {
        porcentagem = Number(despesa.valor);
      }
    }
    setTotal(total);
    setPercentage([porcentagem, (porcentagem / 100) * total]);
    // remove duplicates
    setCategorias([...new Set(allCategorias)]);

    console.groupCollapsed("Dados das Despesas");
    console.log("allCategorias", allCategorias);
    console.log("categorias", categorias);
    console.log("total", total);
    console.log("percentage", percentage);
    console.groupEnd("Dados das Despesas");
  }, [data.allNestedCondominio["Despesas"]]);

  // Stores the general report reference
  const reportRef = useRef(null);

  // This function turns the GeneralReport data into a string
  const makeGeneralReportJSON = async (categorias, despesas) => {
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
    if (percentage[0] !== 0) {
      generalReport.push({
        table: false,
        name: "fundoReserva",
        data: percentage[1].toFixed(2),
      });
    }
    generalReport.push({
      table: false,
      name: "total",
      data: (total + percentage[1]).toFixed(2),
    });
    generalReport.push({
      table: false,
      name: "info",
      data: {
        nameCondominio: data.allNestedCondominio.nome,
        nameAdministrador: data.allNestedBeneficiario.nome,
      },
    });
    const generalReportJSON = JSON.stringify(generalReport);
    return generalReportJSON;
  };

  // This function turns the IndividualReport data into a string
  const makeIndividualReportJSON = async (categorias, despesas, pagantes) => {
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
        return {
          table: true,
          name: categoria,
          data: [...despesasByCategory],
        };
      });
      const fundoReservaIndividual = (percentage[0] / 100) * totalIndividual;
      if (percentage[0] !== 0) {
        individualReport.push({
          table: false,
          name: "fundoReserva",
          data: fundoReservaIndividual.toFixed(2),
        });
      }
      individualReport.push({
        table: false,
        name: "total",
        data: (totalIndividual + fundoReservaIndividual).toFixed(2),
      });
      const despesaAgua = despesas.find(
        (despesa) => despesa.aguaIndividual === true
      );
      const valorAgua = despesaAgua
        ? despesaAgua["Valores"].find(
            (despesa) => despesa.paganteId === pagante.id
          )
        : null;
      individualReport.push({
        table: false,
        name: "info",
        data: {
          complementoPagante: pagante.complemento,
          nomePagante: pagante.nome,
          aguaAnterior: pagante.leituraAgua,
          aguaAtual: despesaAgua ? valorAgua.agua : null,
          aguaConsumo: despesaAgua
            ? Number(valorAgua.agua) - Number(pagante.leituraAgua)
            : null,
          aguaValorUnitario: despesaAgua ? valorAgua.precoAgua : null,
        },
      });
      // console.warn("Relatório Individual:", individualReport);
      return {
        paganteId: pagante.id,
        report: JSON.stringify(individualReport),
      };
    });
    return individualReportsJSON;
  };

  async function putReportsOnLastReports(categorias, condominio) {
    const relatorioGeral = await makeGeneralReportJSON(
      categorias,
      condominio["Despesas"]
    );
    console.groupCollapsed("RG");
    console.log(relatorioGeral);
    console.groupEnd("RG");

    const relatoriosIndividuais = await makeIndividualReportJSON(
      categorias,
      condominio["Despesas"],
      condominio["Pagantes"]
    );
    console.groupCollapsed("RIs");
    console.log(relatoriosIndividuais);
    console.groupEnd("RIs");

    const lastReports = {
      rg: relatorioGeral,
      ris: relatoriosIndividuais,
    };

    setData({ ...data, lastReports });
  }

  return (
    <>
      {/* ALERTA */}
      {dialogAlert && (
        <DialogAlerta
          open={[dialogAlert, setDialogAlert]}
          title="Não há despesas cadastradas"
          // content="Para cadastrar novos Moradores é necessário deletar as despesas (com rateio manual) já cadastradas."
        />
      )}
      {/* ESCOLHER O TIPO DE DESPESA */}
      {dialogEscolherDespesa && (
        <DialogEscolherDespesa
          open={[dialogEscolherDespesa, setDialogEscolherDespesa]}
          despesaFixa={[dialogDespesaFixa, setDialogDespesaFixa]}
          despesaParcelada={[dialogDespesaParcelada, setDialogDespesaParcelada]}
          despesaAgua={[dialogDespesaAgua, setDialogDespesaAgua]}
          despesaFundoReserva={[
            dialogDespesaFundoReserva,
            setDialogDespesaFundoReserva,
          ]}
        />
      )}

      {/* CADASTRA A DESPESA */}
      {dialogDespesaFixa && (
        <DialogDespesaFixa
          open={[dialogDespesaFixa, setDialogDespesaFixa]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogDespesaParcelada && (
        <DialogDespesaParcelada
          open={[dialogDespesaParcelada, setDialogDespesaParcelada]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogDespesaAgua && (
        <DialogDespesaAgua
          open={[dialogDespesaAgua, setDialogDespesaAgua]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogDespesaFundoReserva && (
        <DialogDespesaFundoReserva
          open={[dialogDespesaFundoReserva, setDialogDespesaFundoReserva]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
        />
      )}

      {/* EDITA A DESPESA */}
      {dialogEditDespesaFixa && (
        <DialogDespesaFixa
          open={[dialogEditDespesaFixa, setDialogEditDespesaFixa]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={
            data.allNestedCondominio["Despesas"].filter(
              (despesa) => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}
      {dialogEditDespesaParcelada && (
        <DialogDespesaParcelada
          open={[dialogEditDespesaParcelada, setDialogEditDespesaParcelada]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={
            data.allNestedCondominio["Despesas"].filter(
              (despesa) => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}
      {dialogEditDespesaAgua && (
        <DialogDespesaAgua
          open={[dialogEditDespesaAgua, setDialogEditDespesaAgua]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={
            data.allNestedCondominio["Despesas"].filter(
              (despesa) => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}
      {dialogEditDespesaFundoReserva && (
        <DialogDespesaFundoReserva
          open={[
            dialogEditDespesaFundoReserva,
            setDialogEditDespesaFundoReserva,
          ]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={
            data.allNestedCondominio["Despesas"].filter(
              (despesa) => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}

      {/* DELETA A DESPESA */}
      {dialogDeleteDespesa && (
        <DialogExcluirDespesa
          open={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          despesa={
            data.allNestedCondominio["Despesas"].filter(
              (despesa) => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}

      <h1 className="PageTitle">Registro de Despesas</h1>
      <RelatorioCondominioRegistrar
        reportRef={reportRef}
        despesas={data.allNestedCondominio["Despesas"]}
        setSelected={setSelectedDespesa}
        dialogEditDespesaFixa={[
          dialogEditDespesaFixa,
          setDialogEditDespesaFixa,
        ]}
        dialogEditDespesaParcelada={[
          dialogEditDespesaParcelada,
          setDialogEditDespesaParcelada,
        ]}
        dialogEditDespesaAgua={[
          dialogEditDespesaAgua,
          setDialogEditDespesaAgua,
        ]}
        dialogEditDespesaFundoReserva={[
          dialogEditDespesaFundoReserva,
          setDialogEditDespesaFundoReserva,
        ]}
        categorias={[categorias, setCategorias]}
        valorTotal={[total, setTotal]}
        valorFundoReserva={[percentage, setPercentage]}
      />
    </>
  );
}
