import React from "react";

// IMAGE
import logo from "../../assets/icon.png";

// CSS
import "./style.css";

export default function WaterReportHeader(props) {
  const { nomeCondominio } = props;
  const { enderecoCondominio } = props;
  const { precoAgua } = props;
  const { date } = props;

  const validDate = typeof date !== "undefined";

  return (
    <div id="WaterReportHeader">
      <img id="header-left" src={logo} alt="Logo" />
      <div id="header-right">
        {validDate ? (
          <div className="bold" id="header-line1">
            {`Leitura de Água ${date.mes} de ${date.ano}`}
          </div>
        ) : (
          <div className="bold" id="header-line1">
            {"Leitura de Água"}
          </div>
        )}

        <div id="header-line2">
          <span className="bold">{nomeCondominio}</span>
          {enderecoCondominio && (
            <span className="bold">{" - " + enderecoCondominio}</span>
          )}
        </div>

        {enderecoCondominio && (
          <div id="header-line3">
            <span className="bold">{`Responsável: _______________ Data: ___ / ___ / ___ Valor do m³: R$ ${precoAgua}`}</span>
          </div>
        )}
      </div>
    </div>
  );
}
