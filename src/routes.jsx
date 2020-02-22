import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// PAGES
import Login from "./pages/login";
import RegisterBeneficiario from "./pages/register/registrarBeneficiario";

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
    action: -1,
    data: []
  });

  return (
    <div id="MainContainer">
      <Routes>
        <Route
          path="/"
          element={<Login buttons={[footbarButtons, setFootbarButtons]} />}
        />
        <Route
          path="/screen-2"
          element={
            <RegisterBeneficiario
              buttons={[footbarButtons, setFootbarButtons]}
            />
          }
        />
      </Routes>
      <Footbar buttons={[footbarButtons, setFootbarButtons]} />
    </div>
  );
}
