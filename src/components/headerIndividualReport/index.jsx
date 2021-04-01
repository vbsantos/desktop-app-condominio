import React from "react";

// CSS
import "./style.css";

export default function IndividualReportHeader(props) {
  const { complementoPagante } = props;
  const { nomePagante } = props;
  const { fracaoPagante } = props;
  const { date } = props;

  const { nomeCondominio } = props;
  const { enderecoCondominio } = props;

  const validDate = typeof date !== "undefined";

  const com_info_condominio = nomeCondominio && enderecoCondominio;

  return (
    <div id="IndividualReportHeader">
      <div className="bold" id="header-line1">
        {validDate
          ? `Relatório Individual ${date.mes} de ${date.ano}`
          : "Relatório Individual"}
      </div>

      <div id="header-line2">
        {com_info_condominio
          ? `${nomeCondominio} - ${enderecoCondominio}`
          : `Apartamento: ${complementoPagante} - Fração: ${fracaoPagante}`}
      </div>

      <div id="header-line3">
        {com_info_condominio
          ? `Apartamento: ${complementoPagante} - Fração: ${fracaoPagante} - Condômino: ${nomePagante}`
          : `Condômino: ${nomePagante}`}
      </div>
    </div>
  );
}
