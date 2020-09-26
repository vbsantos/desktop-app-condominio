import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// PAGES
import EscolherBeneficiario from "./pages/escolherBeneficiario";
import EscolherCondominio from "./pages/escolherCondominio";
import RegistrarDespesas from "./pages/registrarDespesas";
import VisualizarRelatorios from "./pages/visualizarRelatorios";
import VisualizarRelatoriosGerados from "./pages/visualizarRelatoriosGerados";
import VisualizarRelatorioAnual from "./pages/visualizarRelatorioAnual";

// COMPONENTS
import Footbar from "./components/footbar";

// SNACKBARS
import SnackbarSystemUpdate from "./others/snackbarUpdate";

// CSS
import "./style.css";

export default function MainRoutes(props) {
  const [data, setData] = useState({
    beneficiario: {},
    allNestedBeneficiario: {},
    allNestedCondominio: {},
    reports: { generalReport: false, data: [] },
    anualReport: [],
    lastReports: {},
    base64Reports: {},
    reportDate: { mes: "", ano: "" },
    systemVersion: require("../package.json").version,
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
        visible: true,
        enabled: true,
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

  return (
    <>
      <SnackbarSystemUpdate />
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

          <Route
            path="/VisualizarRelatorioAnual"
            element={
              <VisualizarRelatorioAnual
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
