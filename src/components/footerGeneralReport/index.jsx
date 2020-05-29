import React from "react";

// CSS
import "./style.css";

export default function GeneralReportHeader(props) {
  const { nomeAdministrador } = props;
  const { emailAdministrador } = props;
  const { telefoneAdministrar } = props;

  return (
    <div id="GeneralReportFooter">
      <div id="header-line1">{"Administrador: " + nomeAdministrador}</div>
      <div id="header-line2">{"E-mail: " + emailAdministrador}</div>
      <div id="header-line3">{"Telefone: " + telefoneAdministrar}</div>
    </div>
  );
}
