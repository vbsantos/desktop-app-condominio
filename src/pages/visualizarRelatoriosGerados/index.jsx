import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// CSS
import "./style.css";

// DIALOGS
import DialogSaveReports from "../../dialogs/salvarRelatorios";

// REPORTS
import RelatorioGeral from "../../reports/relatorioGeral";
import RelatorioIndividual from "../../reports/relatorioIndividual";

// TODO component to png
// FIXME isso vai pro dialog?
import html2canvas from "html2canvas";

export default function VisualizarRelatoriosGerados(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  data.beneficiario.id || navigate("/");

  // Boolean for Save Reports Dialog
  const [dialogSaveReports, setDialogSaveReports] = useState(false);

  console.groupCollapsed("VisualizarRelatoriosGerados: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("VisualizarRelatoriosGerados: System data");

  // const refs = useRef([]);

  // // This function runs only when the generated reports change
  // useEffect(() => {
  //   refs.
  // }, [data.lastReports]);

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
        setDialogSaveReports(true);
        break;
    }
  }, [footbar.action]);

  return (
    <>
      {dialogSaveReports && (
        // FIXME: enviar todos os dados necessários
        <DialogSaveReports open={[dialogSaveReports, setDialogSaveReports]} />
      )}
      <div>
        <h3 className="PageTitle">Relatório das Despesas do Condomínio</h3>
        <RelatorioGeral
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
              reportRef={null}
              report={JSON.parse(ri.report)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
