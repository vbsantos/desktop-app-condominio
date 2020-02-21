import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// PAGES
import Login from "./pages/login";
import RegisterBeneficiario from "./pages/register/registrarBeneficiario";

// COMPONENTS
import Footbar from "./components/footbar";

// CSS
import "./style.css";

export default function Routes(props) {
  return (
    <div id="MainContainer">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/screen-2" component={RegisterBeneficiario} />
        </Switch>
      </BrowserRouter>
      <Footbar
        left={{
          value: "ESQUERDA",
          function: () => console.log("ESQUERDA")
        }}
        right={{
          value: "DIREITA",
          function: () => console.log("DIREITA")
        }}
      />
    </div>
  );
}
