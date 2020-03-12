import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Button } from "@material-ui/core";

// MATERIAL UI ICONS
import { PlusOne } from "@material-ui/icons";

// CSS
import "./style.css";

// DIALOGS
import DialogConta from "../../dialogs/conta";
import DialogExcluirConta from "../../dialogs/deletarConta";

// REPORTS
import RelatorioCondominio from "../../reports/relatorioCondominio";

export default function RegistrarContas(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Store the Contas by Categoria
  const [categorias, setCategorias] = useState([]);

  // Store the total value
  const [total, setTotal] = useState(0);

  // ID of the selected Conta
  const [selectedConta, setSelectedConta] = useState({ id: -1 });

  // Boolean for Edit Dialog
  const [dialogEditContaForm, setDialogEditContaForm] = useState(false);

  // Boolean for Register Dialog
  const [dialogRegisterContaForm, setDialogRegisterContaForm] = useState(false);

  // Boolean for Delete Dialog
  const [dialogDeleteConta, setDialogDeleteConta] = useState(false);

  console.log("Entrou em RegistrarContas\nFootbar:", footbar, "\nData:", data);

  // This function runs only when the component is monted
  useEffect(() => {
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR"
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: "Registrar Nova Despesa"
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "Finalizar"
        }
      ],
      action: -1
    });
    return () => console.log("RegistrarContas - Encerrou");
  }, []);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("RegistrarContas - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/EscolherCondominio");
        break;
      case 1:
        console.log("RegistrarContas - Botão do Centro");
        setFootbar({ ...footbar, action: -1 });
        setDialogRegisterContaForm(true);
        break;
      case 2:
        console.log("RegistrarContas - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        navigate("/"); // vai pra tela de rateamento de contas
        break;
    }
  }, [footbar.action]);

  // This function runs only when the all dialogs are closed
  useEffect(() => {
    data.beneficiario.id || navigate("/");
    const allDialogsClosed = !(
      dialogRegisterContaForm ||
      dialogDeleteConta ||
      dialogEditContaForm
    );
    if (allDialogsClosed) {
      async function getEverything() {
        console.time("getEverything");
        const allNestedBeneficiario = await window.ipcRenderer.invoke(
          "beneficiarios",
          {
            method: "showNested",
            content: { id: data.beneficiario.id }
          }
        );
        const allNestedCondominio = allNestedBeneficiario["Condominios"].filter(
          condominio => condominio.id === data.allNestedCondominio.id
        )[0];
        setData({
          ...data,
          allNestedBeneficiario,
          allNestedCondominio
        });
        console.timeEnd("getEverything");
      }
      getEverything();
    }
  }, [dialogRegisterContaForm, dialogDeleteConta, dialogEditContaForm]);

  // This function runs only when something change in Contas
  useEffect(() => {
    const allCategorias = data.allNestedCondominio["Despesas"].map(
      conta => conta.categoria
    );
    setCategorias(
      allCategorias.filter((a, b) => allCategorias.indexOf(a) === b)
    );
    setTotal(
      data.allNestedCondominio["Despesas"].reduce((acc, conta) => {
        return acc + Number(conta.valor);
      }, 0)
    );
  }, [data.allNestedCondominio["Despesas"]]);

  return (
    <>
      {dialogRegisterContaForm && (
        <DialogConta
          open={[dialogRegisterContaForm, setDialogRegisterContaForm]}
          delete={[dialogDeleteConta, setDialogDeleteConta]}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogEditContaForm && (
        <DialogConta
          open={[dialogEditContaForm, setDialogEditContaForm]}
          delete={[dialogDeleteConta, setDialogDeleteConta]}
          condominio={data.allNestedCondominio}
          conta={
            data.allNestedCondominio["Despesas"].filter(
              conta => conta.id === selectedConta.id
            )[0]
          }
        />
      )}
      {dialogDeleteConta && (
        <DialogExcluirConta
          open={[dialogDeleteConta, setDialogDeleteConta]}
          conta={
            data.allNestedCondominio["Despesas"].filter(
              conta => conta.id === selectedConta.id
            )[0]
          }
        />
      )}
      <h1 className="PageTitle">Registro de Despesas</h1>
      <RelatorioCondominio
        pdf={false}
        contas={data.allNestedCondominio["Despesas"]}
        setSelected={setSelectedConta}
        editDialog={[dialogEditContaForm, setDialogEditContaForm]}
        categorias={[categorias, setCategorias]}
        valorTotal={[total, setTotal]}
      />
    </>
  );
}
