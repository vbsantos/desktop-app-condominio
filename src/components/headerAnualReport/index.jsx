import React from "react";

// IMAGE
import logo from "../../assets/icon.png";

// CSS
import "./style.css";

export default function AnualReportHeader(props) {
  const { nomeCondominio } = props;
  const { enderecoCondominio } = props;
  const { year } = props;

  return (
    <div id="AnualReportHeader">
      <img id="header-left" src={logo} alt="Logo" />
      <div id="header-right">
        <div className="bold" id="header-line1">
          {`Relatório Anual de ${year}`}
        </div>
        <div id="header-line2">
          <span className="bold">{nomeCondominio}</span>
        </div>
        {enderecoCondominio && (
          <div className="bold" id="header-line3">
            <span className="bold">{enderecoCondominio}</span>
          </div>
        )}
      </div>
    </div>
  );
}
