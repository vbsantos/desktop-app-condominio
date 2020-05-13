import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// CSS
import "./style.css";

// DIALOGS
import DialogSaveReports from "../../dialogs/salvarRelatorios";
import DialogCloseSystem from "../../dialogs/fecharSistema";

// REPORTS
import RelatorioGeral from "../../reports/relatorioGeral";
import RelatorioIndividual from "../../reports/relatorioIndividual";

// COMPONENT TO PNG
import html2canvas from "html2canvas";

export default function VisualizarRelatoriosGerados(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  data.beneficiario.id || navigate("/");

  // Boolean for Save Reports Dialog
  const [dialogSaveReports, setDialogSaveReports] = useState(false);

  // Boolean for Close System Dialog
  const [dialogCloseSystem, setDialogCloseSystem] = useState(false);

  console.groupCollapsed("VisualizarRelatoriosGerados: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("VisualizarRelatoriosGerados: System data");

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
          visible: false,
          enabled: false,
          value: "",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: true,
          value: "SALVAR",
        },
      ],
      action: -1,
    });
    return () => console.log("VisualizarRelatoriosGerados - Encerrou");
  }, []);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("VisualizarRelatoriosGerados - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/RegistrarDespesas");
        break;
      case 2:
        console.log("VisualizarRelatoriosGerados - Botão da direita");
        setFootbar({ ...footbar, action: -1 });

        (async () => {
          await getReportsBase64();
          setDialogSaveReports(true);
        })();

        break;
    }
  }, [footbar.action]);

  // This function turns HTML Objects in PNG (base64)
  const htmlObjectToPng = async (htmlObject) => {
    const canvas = await html2canvas(htmlObject);
    const png = await canvas.toDataURL("image/png");
    return png;
  };

  // This function turns the html tables in an object with them base64 string
  const getReportsBase64 = async () => {
    const tablesHTML = Array.from(
      document.getElementsByClassName("reportbase64")
    );
    const tablesPng = [];
    for (const tableHTML of tablesHTML) {
      const stringBase64 = await htmlObjectToPng(tableHTML);
      tablesPng.push(stringBase64);
    }
    const base64Reports = {
      rg: tablesPng.shift(),
      ris: tablesPng,
    };
    setData({
      ...data,
      base64Reports,
    });
  };

  return (
    <>
      {dialogSaveReports && (
        <DialogSaveReports
          open={[dialogSaveReports, setDialogSaveReports]}
          closeDialog={[dialogCloseSystem, setDialogCloseSystem]}
          condominioId={data.allNestedCondominio.id}
          lastReports={data.lastReports}
          base64Reports={data.base64Reports}
        />
      )}
      {dialogCloseSystem && (
        <DialogCloseSystem open={[dialogCloseSystem, setDialogCloseSystem]} />
      )}
      <div>
        <h3 className="PageTitle">Relatório das Despesas do Condomínio</h3>
        <RelatorioGeral
          reportClass="reportbase64"
          reportRef={null}
          report={JSON.parse(data.lastReports.rg)}
        />
      </div>
      <div>
        {data.lastReports.ris.map((ri) => (
          <div key={"ri" + ri.paganteId}>
            <h3 className="PageTitle">
              {"Relatório Individual de "}
              {
                data.allNestedCondominio["Pagantes"].filter(
                  (pagante) => pagante.id === ri.paganteId
                )[0].complemento
              }
            </h3>
            <RelatorioIndividual
              reportClass="reportbase64"
              reportRef={null}
              report={JSON.parse(ri.report)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
