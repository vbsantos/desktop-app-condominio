import React from "react";

// IMAGE
import logo from "../../assets/icon.png";

// CSS
import "./style.css";

export default function ReserveFundReportHeader(props) {
  const { nomeCondominio } = props;
  const { enderecoCondominio } = props;
  const { date } = props;

  const validDate = typeof date !== "undefined";

  return (
    <div id="ReserveFundReportHeader">
      <img id="header-left" src={logo} alt="Logo" />
      <div id="header-right">
        {validDate ? (
          <div className="bold" id="header-line1">
            {`Extrato Fundo Reserva ${date.mes} de ${date.ano}`}
          </div>
        ) : (
          <div className="bold" id="header-line1">
            {"Extrato Fundo Reserva"}
          </div>
        )}

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
