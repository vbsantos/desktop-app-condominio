import React from "react";

// CSS
import "./style.css";

export default function IndividualReportHeader(props) {
  const { complementoPagante } = props;
  const { nomePagante } = props;
  const { fracaoPagante } = props;
  const { date } = props;

  const validDate = typeof date !== "undefined";

  return (
    <div id="IndividualReportHeader">
      {validDate ? (
        <div className="bold" id="header-line1">
          {`Relatório Individual ${date.mes} de ${date.ano}`}
        </div>
      ) : (
        <div className="bold" id="header-line1">
          {"Relatório Individual"}
        </div>
      )}
      <div id="header-line2">
        <span className="bold">{"Apartamento: " + complementoPagante}</span>
        <span className="bold">{"Fração: " + fracaoPagante}</span>
      </div>
      <div id="header-line3">
        <span className="bold">Condômino:</span>
        {" " + nomePagante}
      </div>
    </div>
  );
}
