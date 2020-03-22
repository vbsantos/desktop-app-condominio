import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// PDF libs
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// CSS
import "./style.css";

// DIALOGS
import DialogDespesa from "../../dialogs/despesa";
import DialogExcluirDespesa from "../../dialogs/deletarDespesa";
import DialogReportConfirm from "../../dialogs/gerarRelatorios";

// REPORTS
import RelatorioGeral from "../../reports/relatorioGeral";

export default function RegistrarDespesas(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Store the Despesas by Categoria
  const [categorias, setCategorias] = useState([]);

  // Store the total value
  const [total, setTotal] = useState(0);

  // ID of the selected Despesa
  const [selectedDespesa, setSelectedDespesa] = useState({ id: -1 });

  // Boolean for Edit Dialog
  const [dialogEditDespesaForm, setDialogEditDespesaForm] = useState(false);

  // Boolean for Register Dialog
  const [dialogRegisterDespesaForm, setDialogRegisterDespesaForm] = useState(
    false
  );

  // Boolean for Report Confirmation Dialog
  const [dialogReportConfirm, setDialogReportConfirm] = useState(false);

  // Boolean for Delete Dialog
  const [dialogDeleteDespesa, setDialogDeleteDespesa] = useState(false);

  console.log(
    "Entrou em RegistrarDespesas\nFootbar:",
    footbar,
    "\nData:",
    data
  );

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
          enabled: true,
          value: "Finalizar"
        }
      ],
      action: -1
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
        setDialogReportConfirm(true);
        break;
    }
  }, [footbar.action]);

  // This function runs only when the all dialogs are closed
  useEffect(() => {
    data.beneficiario.id || navigate("/");
    const allDialogsClosed = !(
      dialogRegisterDespesaForm ||
      dialogDeleteDespesa ||
      dialogEditDespesaForm ||
      dialogReportConfirm
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
  }, [
    dialogRegisterDespesaForm,
    dialogDeleteDespesa,
    dialogEditDespesaForm,
    dialogReportConfirm
  ]);

  // This function runs only when something change in Despesas
  useEffect(() => {
    const allCategorias = data.allNestedCondominio["Despesas"].map(
      despesa => despesa.categoria
    );
    setCategorias(
      allCategorias.filter((a, b) => allCategorias.indexOf(a) === b)
    );
    setTotal(
      data.allNestedCondominio["Despesas"].reduce((acc, despesa) => {
        return acc + Number(despesa.valor);
      }, 0)
    );
  }, [data.allNestedCondominio["Despesas"]]);

  // Stores the general report reference
  const reportRef = useRef(null);

  // This funcions turns a React Component into a PDF
  // const getPdf = ref => {
  //   if (ref.current) {
  //     html2canvas(ref.current).then(canvas => {
  //       const imgData = canvas.toDataURL("image/png");
  //       const pdf = new jsPDF();
  //       const date = new Date();
  //       const nd = data.allNestedCondominio["Despesas"].length;
  //       const nc = categorias.length;
  //       const h1 = 6; // line height
  //       const h2 = 3; // between tables height
  //       let height = nc * (2 * h1 + h2) + nd * h1 + (h1 + h2);
  //       height = height > 293 ? 293 : height;
  //       pdf.addImage(imgData, "PNG", 5, 5, 200, height); // máximo 293
  //       pdf.save(`relatorio_${date.getFullYear()}_${date.getMonth() + 1}.pdf`);
  //     });
  //     return true;
  //   }
  //   return false;
  // };

  return (
    <>
      {dialogReportConfirm && (
        <DialogReportConfirm
          open={[dialogReportConfirm, setDialogReportConfirm]}
          categorias={categorias}
          condominio={data.allNestedCondominio}
        />
      )}
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
              despesa => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}
      {dialogDeleteDespesa && (
        <DialogExcluirDespesa
          open={[dialogDeleteDespesa, setDialogDeleteDespesa]}
          despesa={
            data.allNestedCondominio["Despesas"].filter(
              despesa => despesa.id === selectedDespesa.id
            )[0]
          }
        />
      )}
      <h1 className="PageTitle">Registro de Despesas</h1>
      <RelatorioGeral
        editable={false}
        reportRef={reportRef}
        despesas={data.allNestedCondominio["Despesas"]}
        setSelected={setSelectedDespesa}
        editDialog={[dialogEditDespesaForm, setDialogEditDespesaForm]}
        categorias={[categorias, setCategorias]}
        valorTotal={[total, setTotal]}
      />
    </>
  );
}
