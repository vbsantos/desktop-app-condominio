import React from "react";

// IMAGE
import logo from "../../assets/icon.png";

// CSS
import "./style.css";

export default function GeneralReportHeader(props) {
  const { nomeCondominio } = props;
  const { nomeAdministrador } = props;

  return (
    <div id="GeneralReportHeader">
      <img id="header-left" src={logo} alt="Logo" />
      <div id="header-right">
        <div id="header-line1">{"Relatório Geral"}</div>
        <div id="header-line2">{"Condomínio " + nomeCondominio}</div>
        <div id="header-line3">{"Administrador " + nomeAdministrador}</div>
      </div>
    </div>
  );
}
