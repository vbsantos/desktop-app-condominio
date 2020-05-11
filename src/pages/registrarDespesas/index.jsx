import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// CSS
import "./style.css";

// DIALOGS
import DialogDespesa from "../../dialogs/despesa";
import DialogExcluirDespesa from "../../dialogs/deletarDespesa";

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

  // Boolean for Edit Dialog
  const [dialogEditDespesaForm, setDialogEditDespesaForm] = useState(false);

  // Boolean for Register Dialog
  const [dialogRegisterDespesaForm, setDialogRegisterDespesaForm] = useState(
    false
  );

  // Boolean for Delete Dialog
  const [dialogDeleteDespesa, setDialogDeleteDespesa] = useState(false);

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
        setDialogRegisterDespesaForm(true);
        break;
      case 2:
        console.log("RegistrarDespesas - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        //getPaganteInfo();
        // FIXME GERA RELATÓRIOS MAS NÃO SALVA AINDA, SÓ SALVA DEPOIS DE IMPRIMIR/CONFIRMAR NA PRÓXIMA TELA
        // TODO vai pra página de visualização de todos os relatórios e dá a opção de imprimir
        console.log("reportRef.current:", reportRef.current);
        // navigate("/VisualizarRelatoriosGerados");
        break;
    }
  }, [footbar.action]);

  // This function runs only when the all dialogs are closed
  useEffect(() => {
    data.beneficiario.id || navigate("/");
    const allDialogsClosed = !(
      dialogRegisterDespesaForm ||
      dialogDeleteDespesa ||
      dialogEditDespesaForm
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
  }, [dialogRegisterDespesaForm, dialogDeleteDespesa, dialogEditDespesaForm]);

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

  return (
    <>
      {dialogRegisterDespesaForm && (
        <DialogDespesa
          open={[dialogRegisterDespesaForm, setDialogRegisterDespesaForm]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogEditDespesaForm && (
        <DialogDespesa
          open={[dialogEditDespesaForm, setDialogEditDespesaForm]}
          delete={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          condominio={data.allNestedCondominio}
          despesa={
            data.allNestedCondominio["Despesas"].filter(
              (despesa) => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}
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
        editDialog={[dialogEditDespesaForm, setDialogEditDespesaForm]}
        categorias={[categorias, setCategorias]}
        valorTotal={[total, setTotal]}
        valorFundoReserva={[percentage, setPercentage]}
      />
    </>
  );
}
