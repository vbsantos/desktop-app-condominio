import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// PAGES
import EscolherBeneficiario from "./pages/escolherBeneficiario";
import EscolherCondominio from "./pages/escolherCondominio";
import RegistrarDespesas from "./pages/registrarDespesas";
import VisualizarRelatorios from "./pages/visualizarRelatorios";
import VisualizarRelatoriosGerados from "./pages/visualizarRelatoriosGerados";

// COMPONENTS
import Footbar from "./components/footbar";

// DIALOGS
import DialogUpdate from "./dialogs/update";

// CSS
import "./style.css";

export default function MainRoutes(props) {
  const [data, setData] = useState({
    beneficiario: {},
    allNestedBeneficiario: {},
    allNestedCondominio: {},
    reports: { generalReport: false, data: [] },
    lastReports: {},
    base64Reports: {},
    systemVersion: "",
  });

  const [footbarButtons, setFootbarButtons] = useState({
    buttons: [
      {
        id: 0,
        position: "left",
        visible: true,
        enabled: true,
        value: "LEFT",
      },
      {
        id: 1,
        position: "center",
        visible: false,
        enabled: false,
        value: "CENTER",
      },
      {
        id: 2,
        position: "right",
        visible: true,
        enabled: true,
        value: "RIGHT",
      },
    ],
    action: -1,
  });

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [updateVersion, setUpdateVersion] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await window.ipcRenderer.invoke("updates", {
          method: "check",
          content: null,
        });
        if (typeof res.updateInfo !== "undefined") {
          setData({ ...data, systemVersion: res.versionInfo.version });
          setUpdateVersion(res.updateInfo.version);
          setDialogUpdate(res.versionInfo.version < res.updateInfo.version);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      {dialogUpdate && (
        <DialogUpdate
          open={[dialogUpdate, setDialogUpdate]}
          title={"Uma nova versão do sistema foi encontrada"}
          content={`Deseja atualizar o sistema para a versão ${updateVersion}?`}
        />
      )}
      <div id="MainContainer">
        <Routes>
          <Route
            path="/"
            element={
              <EscolherBeneficiario
                buttons={[footbarButtons, setFootbarButtons]}
                data={[data, setData]}
              />
            }
          />

          <Route
            path="/EscolherCondominio"
            element={
              <EscolherCondominio
                buttons={[footbarButtons, setFootbarButtons]}
                data={[data, setData]}
              />
            }
          />

          <Route
            path="/VisualizarRelatorios"
            element={
              <VisualizarRelatorios
                buttons={[footbarButtons, setFootbarButtons]}
                data={[data, setData]}
              />
            }
          />

          <Route
            path="/RegistrarDespesas"
            element={
              <RegistrarDespesas
                buttons={[footbarButtons, setFootbarButtons]}
                data={[data, setData]}
              />
            }
          />

          <Route
            path="/VisualizarRelatoriosGerados"
            element={
              <VisualizarRelatoriosGerados
                buttons={[footbarButtons, setFootbarButtons]}
                data={[data, setData]}
              />
            }
          />
        </Routes>
      </div>
      <Footbar buttons={[footbarButtons, setFootbarButtons]} />
    </>
  );
}
