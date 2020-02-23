import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// PAGES
import EscolherBeneficiario from "./pages/choose/escolherBeneficiario";
import RegisterBeneficiario from "./pages/register/registrarBeneficiario";
import EscolherCondominio from "./pages/choose/escolherCondominio";

// COMPONENTS
import Footbar from "./components/footbar";

// CSS
import "./style.css";

export default function MainRoutes(props) {
  const [footbarButtons, setFootbarButtons] = useState({
    buttons: [
      {
        id: 0,
        position: "left",
        visible: true,
        enabled: true,
        value: "LEFT"
      },
      {
        id: 1,
        position: "center",
        visible: true,
        enabled: true,
        value: "CENTER"
      },
      {
        id: 2,
        position: "right",
        visible: true,
        enabled: true,
        value: "RIGHT"
      }
    ],
    action: -1
  });
  const [data, setData] = useState([]);

  return (
    <>
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
            path="/screen-2"
            element={
              <RegisterBeneficiario
                buttons={[footbarButtons, setFootbarButtons]}
              />
            }
          />
          <Route
            path="/screen-3"
            element={
              <EscolherCondominio
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
