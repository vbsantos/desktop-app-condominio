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
import DialogEscolherData from "../../dialogs/escolherData";

// REPORTS
import RelatorioCondominioRegistrar from "../../reports/relatorioRegistrar";

// FUNCTIONS
function comparar(despesa1, despesa2) {
  return despesa1.id - despesa2.id;
}

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

  // Boolean for Escolher Data Dialog
  const [dialogEscolherData, setDialogEscolherData] = useState(false);

  // Boolean if date is picked
  const [datePicked, setDatePicked] = useState(false);

  // REVIEW Stores values for the anual report
  const reportsTotais = {
    rgValue: 0,
    rrValue: 0,
    rfrValue: 0,
    raValue: 0,
    rfrValues: [],
  };

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
          value: "RETORNAR",
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: "Incluir Despesa",
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

        const despesas = data.allNestedCondominio["Despesas"].filter(
          (despesa) => despesa.ativa && !despesa.informacao
        );
        if (despesas.length > 0) {
          setDialogEscolherData(true);
        } else {
          setDialogAlertDespesas(true);
        }

        break;
    }
  }, [footbar.action]);

  // This function runs only when the dialogs are closed
  useEffect(() => {
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
      dialogDeleteDespesa ||
      dialogEscolherData
    );
    if (allDialogsClosed) {
      if (datePicked) {
        (async () => {
          await putReportsOnLastReports(data.allNestedCondominio);
          navigate("/VisualizarRelatoriosGerados");
        })();
      } else {
        async function getEverything() {
          console.time("Get all data from database");
          const allNestedBeneficiario = await window.ipcRenderer.invoke(
            "beneficiarios",
            {
              method: "showNested",
              content: { id: data.beneficiario.id },
            }
          );

          if (!allNestedBeneficiario["Condominios"]) {
            navigate("/");
            return;
          }

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
    dialogEscolherData,
  ]);

  // This function runs only when something change in Despesas
  useEffect(() => {
    let total = 0;
    let allCategorias = [];
    let porcentagem = 0;
    const infos = [];

    if (!data.allNestedCondominio["Despesas"]) {
      navigate("/");
      return;
    }

    for (const despesa of data.allNestedCondominio["Despesas"]) {
      if (despesa.fundoReserva) {
        porcentagem = Number(despesa.valor);
      } else if (despesa.informacao) {
        infos.push({
          id: despesa.id,
          text: despesa.nome,
          ativa: despesa.ativa,
        });
      } else {
        if (despesa.ativa) {
          total += Number(despesa.valor);
        }
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

  // REVIEW gr
  // This function turns the GeneralReport data into a string
  const makeGeneralReportJSON = async (
    categorias,
    despesas,
    existFundoReserva
  ) => {
    const generalReport = categorias
      .filter((categoria) => categoria !== "")
      .map((categoria) => {
        const despesasByCategory = despesas.filter(
          (despesa) => despesa.categoria === categoria
        );
        return {
          table: true,
          name: categoria,
          data: [...despesasByCategory],
        };
      });
    if (existFundoReserva) {
      generalReport.push({
        table: false,
        name: `Fundo Reserva - ${percentage[0]}%`,
        data: {
          id: despesas.find((despesa) => despesa.fundoReserva).id,
          value: percentage[1],
        },
      });
    }
    if (informacoes.length > 0) {
      generalReport.push({
        table: false,
        name: "informacoes",
        data: informacoes.filter((informacao) => informacao.ativa),
      });
    }
    const total_total = existFundoReserva ? total + percentage[1] : total;
    reportsTotais.rgValue = total_total;
    generalReport.push({
      table: false,
      name: "total",
      data: total_total,
    });
    generalReport.push({
      table: false,
      name: "info",
      data: {
        nomeCondominio: data.allNestedCondominio.nome,
        enderecoCondominio: data.allNestedCondominio.endereco,
        nomeAdministrador: data.allNestedBeneficiario.nome,
        emailAdministrador: data.allNestedBeneficiario.email,
        telefoneAdministrar: data.allNestedBeneficiario.telefone,
        reportDate: data.reportDate,
      },
    });
    const generalReportJSON = JSON.stringify(generalReport);
    return generalReportJSON;
  };

  // REVIEW ir
  // This function turns the IndividualReport data into a string
  const makeIndividualReportJSON = async (
    categorias,
    despesas,
    pagantes,
    existFundoReserva
  ) => {
    const individualReportsJSON = pagantes.map((pagante) => {
      let totalIndividual = 0;
      const individualReport = categorias
        .filter((categoria) => categoria !== "")
        .map((categoria) => {
          const despesasByCategory = despesas
            .filter((despesa) => despesa.categoria === categoria)
            .map((despesa) => {
              const valor = despesa.rateioAutomatico
                ? despesa.valor * pagante.fracao // valor final condômino
                : Number(
                    despesa["Valores"].find(
                      (valor) => valor.paganteId === pagante.id
                    ).valor
                  );
              totalIndividual += valor;
              // console.warn(`[${pagante.complemento}] valor:`, valor);
              return {
                ...despesa,
                valor: valor,
              };
            });
          return {
            table: true,
            name: categoria,
            data: [...despesasByCategory],
          };
        });
      // const fundoReservaIndividual = (percentage[0] / 100) * totalIndividual;
      const fundoReservaIndividual = percentage[1] * pagante.fracao;
      if (existFundoReserva) {
        individualReport.push({
          table: false,
          name: `Fundo Reserva - ${percentage[0]}%`,
          data: {
            id: despesas.find((despesa) => despesa.fundoReserva).id,
            value: fundoReservaIndividual.toFixed(2),
          },
        });
      }
      individualReport.push({
        table: false,
        name: "total",
        data: { value: (totalIndividual + fundoReservaIndividual).toFixed(2) },
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
          reportDate: data.reportDate,
          nomeCondominio: data.allNestedCondominio.nome,
          enderecoCondominio: data.allNestedCondominio.endereco,
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

  // REVIEW wr
  // This function turns the WaterReport data into a string
  const makeWaterReportJSON = async (condominio, pagantes, despesas) => {
    const despesaAgua = despesas.filter((despesa) => despesa.aguaIndividual);
    const despesaAguaPrimaria = despesaAgua.find(
      (despesa) => !despesa.rateioAutomatico
    );
    const despesaAguaSecundaria = despesaAgua.find(
      (despesa) => despesa.rateioAutomatico
    );
    const totalIndividual = Number(despesaAguaPrimaria.valor); // soma de todos os pagantes (R$)
    const totalComum = Number(despesaAguaSecundaria.valor); // diferença entre geral e pagantes (R$)
    const total = Number(totalIndividual) + Number(totalComum); // geral (R$)
    reportsTotais.raValue = total;
    const valoresIndividuais = despesaAguaPrimaria["Valores"]; // valores individuais da despesa de água primária
    const paganteResidencialId = pagantes.find(
      (pagante) => !pagante.unidadeComercial
    ).id;
    const precoAgua = valoresIndividuais.find(
      (valor) => valor.paganteId == paganteResidencialId
    ).precoAgua; // valor do metro cubico da agua

    let totalAnteriorIndividual = 0; // (m³)
    let totalAtualIndividual = 0; // (m³)
    let totalConsumoIndividual = 0; // (m³)

    const waterReport = [];

    waterReport.push({
      table: true,
      name: "aguaIndividual",
      data: valoresIndividuais
        .sort(comparar) // ORDENA POR ID
        .map((individual) => {
          const pagante = pagantes.find(
            (pagante) => pagante.id === individual.paganteId
          );

          const consumo = Number(individual.agua) - Number(pagante.leituraAgua);

          totalAnteriorIndividual += Number(pagante.leituraAgua);
          totalAtualIndividual += Number(individual.agua);
          totalConsumoIndividual += consumo;

          return {
            unidade: pagante.complemento,
            anterior: Number(pagante.leituraAgua),
            atual: Number(individual.agua),
            consumo,
            valor: Number(individual.valor),
          };
        }),
    });

    waterReport.push({
      table: true,
      name: "aguaComum",
      data: {
        unidade: "Condomínio",
        anterior: Number(condominio.leituraAgua),
        atual: Number(despesaAguaSecundaria.agua),
        consumo:
          Number(despesaAguaSecundaria.agua) - Number(condominio.leituraAgua),
        valor: Number(totalComum),
      },
    });

    waterReport.push({
      table: false,
      name: "info",
      data: {
        precoAgua, // (R$)
        totalAnteriorIndividual, // (m³)
        totalAtualIndividual, // (m³)
        totalConsumoIndividual, // (m³)
        totalIndividual, // (R$)
        total, // (R$)
        nomeCondominio: condominio.nome,
        enderecoCondominio: condominio.endereco,
        nomeAdministrador: data.allNestedBeneficiario.nome,
        emailAdministrador: data.allNestedBeneficiario.email,
        telefoneAdministrar: data.allNestedBeneficiario.telefone,
        reportDate: data.reportDate,
      },
    });

    const waterReportJSON = JSON.stringify(waterReport);
    return waterReportJSON;
  };

  // REVIEW ar
  // This function turns the ApportionmentReport data into a string
  const makeApportionmentReportJSON = async (
    condominio,
    pagantes,
    despesas
  ) => {
    const tabela1 = pagantes.map((pagante) => {
      const id = pagante.id;
      const unidade = pagante.complemento;
      const fracao = pagante.fracao;
      const valores = [];
      let totalPagante = 0;
      despesas
        .filter((despesa) => !despesa.informacao)
        .forEach((despesa) => {
          // console.warn("Valores:", despesa["Valores"]);
          const rateioAuto = despesa.rateioAutomatico;
          const fundoReserva = despesa.fundoReserva;
          if (!fundoReserva) {
            let valor = 0;
            if (rateioAuto) {
              valor = Number(despesa.valor) * Number(fracao);
            } else {
              valor = Number(
                despesa["Valores"].find((valor) => valor.paganteId === id).valor
              );
            }
            totalPagante += valor;
            // console.warn("Despesa", {id: despesa.id,nome: despesa.nome,valor,id,unidade,valores,totalPagante,});
            valores.push({
              id: despesa.id,
              nome: despesa.nome,
              valor,
            });
          }
        });
      // console.warn(`[${unidade}] totalPagante`, totalPagante);
      return {
        id,
        unidade,
        fracao,
        valores,
        total: totalPagante,
      };
    });

    const despesaFundoReserva = despesas.find(
      (despesa) => despesa.fundoReserva
    );
    if (despesaFundoReserva) {
      tabela1.forEach((pagante) => {
        // const fundoReservaIndividual = pagante.total * (percentage[0] / 100);
        const fundoReservaIndividual = percentage[1] * pagante.fracao;
        pagante.total += fundoReservaIndividual;
        pagante.valores.push({
          id: despesaFundoReserva.id,
          nome: despesaFundoReserva.nome,
          valor: fundoReservaIndividual,
        });
      });
    }

    const apportionmentReport = [];
    apportionmentReport.push({
      table: true,
      name: "despesasIndividuais",
      data: tabela1,
    });

    // Total de cada despesa
    const totais = [];
    despesas.forEach((despesa) => {
      const rateioAuto = despesa.rateioAutomatico;
      const fundoReserva = despesa.fundoReserva;
      if (!fundoReserva) {
        let total = 0;
        if (rateioAuto) {
          total = Number(despesa.valor);
        } else {
          total = Number(despesa.valor);
        }
        totais.push(total);
      }
    });
    if (despesaFundoReserva) {
      totais.push(percentage[1]);
    }

    const total_total = despesaFundoReserva ? total + percentage[1] : total;
    reportsTotais.rrValue = total_total;

    apportionmentReport.push({
      table: false,
      name: "info",
      data: {
        totais,
        total: total_total,
        nomeCondominio: condominio.nome,
        enderecoCondominio: condominio.endereco,
        nomeAdministrador: data.allNestedBeneficiario.nome,
        emailAdministrador: data.allNestedBeneficiario.email,
        telefoneAdministrar: data.allNestedBeneficiario.telefone,
        reportDate: data.reportDate,
      },
    });

    const apportionmentReportJSON = JSON.stringify(apportionmentReport);
    return apportionmentReportJSON;
  };

  // REVIEW rfr
  const makeReserveFundReportJSON = (pagantes) => {
    const reserveFundReport = [];

    let totalFundoReserva = 0;

    const tabelaPrincipal = pagantes.map((pagante) => {
      const fundoReservaIndividual = percentage[1] * pagante.fracao;
      totalFundoReserva += fundoReservaIndividual;
      return {
        unidade: pagante.complemento,
        box: pagante.box,
        nome: pagante.nome,
        fracao: pagante.fracao,
        valor: fundoReservaIndividual,
      };
    });

    reserveFundReport.push({
      table: true,
      name: `Fundo Reserva - ${percentage[0]}%`,
      data: tabelaPrincipal,
    });

    reserveFundReport.push({
      table: false,
      name: "info",
      data: {
        totalFundoReserva, // (R$) fundo reserva do condomínimo desse mês
        nomeCondominio: data.allNestedCondominio.nome,
        enderecoCondominio: data.allNestedCondominio.endereco,
        reportDate: data.reportDate,
      },
    });

    reportsTotais.rfrValue = totalFundoReserva;

    reportsTotais.rfrValues = pagantes.map((pagante) => {
      return {
        unidade: pagante.complemento,
        box: pagante.box,
        fracao: pagante.fracao,
        valor: percentage[1] * pagante.fracao,
      };
    });

    const reserveFundReportJSON = JSON.stringify(reserveFundReport);
    return reserveFundReportJSON;
  };

  async function putReportsOnLastReports(condominio) {
    const despesasAtivas = condominio["Despesas"].filter(
      (despesa) => despesa.ativa && !despesa.informacao
    );
    const categoriasComDespesasAtivas = [
      ...new Set(despesasAtivas.map((despesa) => despesa.categoria)),
    ];
    const existDepesaAgua = !!despesasAtivas.find(
      (despesa) => despesa.aguaIndividual
    );
    let relatorioAgua = null;
    if (existDepesaAgua) {
      relatorioAgua = await makeWaterReportJSON(
        condominio,
        condominio["Pagantes"],
        despesasAtivas
      );
      console.groupCollapsed("RA");
      console.log(relatorioAgua);
      console.groupEnd("RA");
    }

    // get reserve fund report json
    const existFundoReserva = !!despesasAtivas.find(
      (despesa) => despesa.fundoReserva
    );
    let relatorioFundoReserva = null;
    if (existFundoReserva) {
      relatorioFundoReserva = await makeReserveFundReportJSON(
        condominio["Pagantes"]
      );
      console.groupCollapsed("RFR");
      console.log(relatorioFundoReserva);
      console.groupEnd("RFR");
    }

    // get apportionment report json
    const relatorioRateio = await makeApportionmentReportJSON(
      condominio,
      condominio["Pagantes"],
      despesasAtivas
    );
    console.groupCollapsed("RR");
    console.log(relatorioRateio);
    console.groupEnd("RR");

    const relatorioGeral = await makeGeneralReportJSON(
      categoriasComDespesasAtivas,
      despesasAtivas,
      existFundoReserva
    );
    console.groupCollapsed("RG");
    console.log(relatorioGeral);
    console.groupEnd("RG");

    const relatoriosIndividuais = await makeIndividualReportJSON(
      categoriasComDespesasAtivas,
      despesasAtivas,
      condominio["Pagantes"],
      existFundoReserva
    );
    console.groupCollapsed("RIs");
    console.log(relatoriosIndividuais);
    console.groupEnd("RIs");

    // REVIEW lastReports
    const lastReports = {
      rr: relatorioRateio,
      ra: relatorioAgua,
      rfr: relatorioFundoReserva,
      rg: relatorioGeral,
      ris: relatoriosIndividuais,
      month: data.reportDate.competencia,
      ...reportsTotais,
    };

    setData({ ...data, lastReports });
  }

  return (
    <div id="RegistrarDespesas">
      {/* ALERTA */}
      {dialogAlertDespesas && (
        <DialogAlerta
          open={[dialogAlertDespesas, setDialogAlertDespesas]}
          title="Não há despesas ativas"
        />
      )}
      {/* ESCOLHER DATA DO RELATÓRIO */}
      {dialogEscolherData && (
        <DialogEscolherData
          open={[dialogEscolherData, setDialogEscolherData]}
          data={[data, setData]}
          picked={[datePicked, setDatePicked]}
        />
      )}
      {/* ESCOLHER O TIPO DE DESPESA */}
      {dialogEscolherDespesa && (
        <DialogEscolherDespesa
          despesas={data.allNestedCondominio["Despesas"]}
          open={[dialogEscolherDespesa, setDialogEscolherDespesa]}
          despesaFixa={[dialogDespesaFixa, setDialogDespesaFixa]}
          despesaParcelada={[dialogDespesaParcelada, setDialogDespesaParcelada]}
          despesaAgua={[dialogDespesaAgua, setDialogDespesaAgua]}
          despesaFundoReserva={[
            dialogDespesaFundoReserva,
            setDialogDespesaFundoReserva,
          ]}
          informacao={[dialogInformacao, setDialogInformacao]}
          setSelected={setSelectedDespesa}
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
        data={[data, setData]}
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
    </div>
  );
}
