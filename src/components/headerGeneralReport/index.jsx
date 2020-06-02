import React from "react";

// IMAGE
import logo from "../../assets/icon.png";

// CSS
import "./style.css";

export default function GeneralReportHeader(props) {
  const { nomeCondominio } = props;
  const { enderecoCondominio } = props;
  const { date } = props;

  const validDate = typeof date !== "undefined";

  return (
    <div id="GeneralReportHeader">
      <img id="header-left" src={logo} alt="Logo" />
      <div id="header-right">
        <div id="header-line2">
          <span className="bold">{nomeCondominio}</span>
        </div>
        {enderecoCondominio && (
          <div id="header-line3">
            <span className="bold">{enderecoCondominio}</span>
          </div>
        )}
        {validDate ? (
          <div className="bold" id="header-line1">
            {`Demonstrativo Financeiro ${date.mes} de ${date.ano}`}
          </div>
        ) : (
          <div className="bold" id="header-line1">
            {"Demonstrativo Financeiro"}
          </div>
        )}
      </div>
    </div>
  );
}
