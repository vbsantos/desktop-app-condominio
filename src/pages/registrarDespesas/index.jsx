import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// DIALOGS
import DialogExcluirDespesa from "../../dialogs/deletarDespesa";
import DialogEscolherDespesa from "../../dialogs/escolherDespesa";
import DialogDespesaFixa from "../../dialogs/despesaFixa";
import DialogDespesaParcelada from "../../dialogs/despesaParcelada";
import DialogDespesaAgua from "../../dialogs/despesaAgua";
import DialogDespesaFundoReserva from "../../dialogs/despesaFundoReserva";
import DialogInformacao from "../../dialogs/informacao";
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

  // Store informations
  const [informacoes, setInformacoes] = useState([]);

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
  // Boolean for Informação Dialog
  const [dialogInformacao, setDialogInformacao] = useState(false);

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
  const [dialogEditInformacao, setDialogEditInformacao] = useState(false);

  // Boolean for Delete Dialog
  const [dialogDeleteDespesa, setDialogDeleteDespesa] = useState(false);

  // Boolean for Alert Dialog
  const [dialogAlertDespesas, setDialogAlertDespesas] = useState(false);

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
          value: "Registrar Despesa",
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
            setDialogAlertDespesas(true);
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
      dialogInformacao ||
      dialogEditDespesaFixa ||
      dialogEditDespesaParcelada ||
      dialogEditDespesaAgua ||
      dialogEditDespesaFundoReserva ||
      dialogEditInformacao ||
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
        const allNestedCondominio = allNestedBeneficiario["Condominios"].find(
          (condominio) => condominio.id === data.allNestedCondominio.id
        );
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
    dialogInformacao,
    dialogEditDespesaFixa,
    dialogEditDespesaParcelada,
    dialogEditDespesaAgua,
    dialogEditDespesaFundoReserva,
    dialogEditInformacao,
    dialogDeleteDespesa,
  ]);

  // This function runs only when something change in Despesas
  useEffect(() => {
    let total = 0;
    let allCategorias = [];
    let porcentagem = 0;
    const infos = [];

    for (const despesa of data.allNestedCondominio["Despesas"]) {
      if (despesa.fundoReserva) {
        porcentagem = Number(despesa.valor);
      } else if (despesa.informacao) {
        infos.push({ id: despesa.id, text: despesa.nome });
      } else {
        total += Number(despesa.valor);
        allCategorias.push(despesa.categoria);
      }
    }
    setInformacoes(infos);
    setTotal(total);
    setPercentage([porcentagem, (porcentagem / 100) * total]);
    setCategorias([...new Set(allCategorias)]);

    console.groupCollapsed("Dados das Despesas");
    console.log("allCategorias", allCategorias);
    console.log("categorias", categorias);
    console.log("total", total);
    console.log("percentage", percentage);
    console.log("informacoes", informacoes);
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
    if (informacoes.length > 0) {
      generalReport.push({
        table: false,
        name: "informacoes",
        data: informacoes,
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
              ? Math.ceil(despesa.valor * pagante.fracao * 100) / 100 // valor final condômino
              : Number(
                  despesa["Valores"].find(
                    (valor) => valor.paganteId === pagante.id
                  ).valor
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
          fracaoPagante: pagante.fracao,
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
      {dialogAlertDespesas && (
        <DialogAlerta
          open={[dialogAlertDespesas, setDialogAlertDespesas]}
          title="Não há despesas cadastradas"
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
          informacao={[dialogInformacao, setDialogInformacao]}
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

      {/* CADASTRAR INFORMAÇÃO */}
      {dialogInformacao && (
        <DialogInformacao
          open={[dialogInformacao, setDialogInformacao]}
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
          despesa={data.allNestedCondominio["Despesas"].find(
            (despesa) => despesa.id === selectedDespesa.id
          )}
        />
      )}
      {dialogEditDespesaParcelada && (
        <DialogDespesaParcelada
          open={[dialogEditDespesaParcelada, setDialogEditDespesaParcelada]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={data.allNestedCondominio["Despesas"].find(
            (despesa) => despesa.id === selectedDespesa.id
          )}
        />
      )}
      {dialogEditDespesaAgua && (
        <DialogDespesaAgua
          open={[dialogEditDespesaAgua, setDialogEditDespesaAgua]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={data.allNestedCondominio["Despesas"].find(
            (despesa) => despesa.id === selectedDespesa.id
          )}
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
          despesa={data.allNestedCondominio["Despesas"].find(
            (despesa) => despesa.id === selectedDespesa.id
          )}
        />
      )}

      {/* EDITAR INFORMAÇÃO */}
      {dialogEditInformacao && (
        <DialogInformacao
          open={[dialogEditInformacao, setDialogEditInformacao]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={data.allNestedCondominio["Despesas"].find(
            (despesa) => despesa.id === selectedDespesa.id
          )}
        />
      )}

      {/* DELETA A DESPESA */}
      {dialogDeleteDespesa && (
        <DialogExcluirDespesa
          open={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          despesa={data.allNestedCondominio["Despesas"].find(
            (despesa) => despesa.id === selectedDespesa.id
          )}
          despesas={data.allNestedCondominio["Despesas"]}
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
        dialogEditInformacao={[dialogEditInformacao, setDialogEditInformacao]}
        categorias={[categorias, setCategorias]}
        valorTotal={[total, setTotal]}
        valorFundoReserva={[percentage, setPercentage]}
        informacoes={[informacoes, setInformacoes]}
      />
    </>
  );
}
