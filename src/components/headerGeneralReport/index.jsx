import React from "react";

// IMAGE
import logo from "../../assets/icon.png";

// CSS
import "./style.css";

export default function GeneralReportHeader(props) {
  const { nomeCondominio } = props;
  const { enderecoCondominio } = props;

  return (
    <div id="GeneralReportHeader">
      <img id="header-left" src={logo} alt="Logo" />
      <div id="header-right">
        <div className="bold" id="header-line1">
          {/* TODO ADICIONAR MÊS E ANO */}
          {"Demonstrativo Financeiro"}
        </div>
        <div id="header-line2">
          <span className="bold">{nomeCondominio}</span>
        </div>
        <div id="header-line3">
          <span className="bold">{enderecoCondominio}</span>
        </div>
      </div>
    </div>
  );
}
