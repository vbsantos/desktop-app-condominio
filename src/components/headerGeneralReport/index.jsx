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
        <div className="bold" id="header-line1">
          {"Relatório Geral"}
        </div>
        <div id="header-line2">
          <span className="bold">Condomínio:</span>
          {" " + nomeCondominio}
        </div>
        <div id="header-line3">
          <span className="bold">Administrador:</span>
          {" " + nomeAdministrador}
        </div>
      </div>
    </div>
  );
}
