import React from "react";

// IMAGE
import logo from "../../assets/icon.png";

// CSS
import "./style.css";

export default function ApportionmentReportHeader(props) {
  const { nomeCondominio } = props;
  const { enderecoCondominio } = props;
  const { date } = props;

  const validDate = typeof date !== "undefined";
  const validEmissao = !!date.emissao;
  const validVencimento = !!date.vencimento;

  return (
    <div id="ApportionmentReportHeader">
      <img id="header-left" src={logo} alt="Logo" />
      <div id="header-right">
        <div className="bold" id="header-line1">
          {"Planilha de Previsão de Receita Mensal"}
        </div>

        <div id="header-line2">
          <span className="bold">{`${nomeCondominio} - ${enderecoCondominio}`}</span>
        </div>

        {enderecoCondominio && (
          <div id="header-line3">
            <span className="bold">
              {validEmissao ? `Emissão: ${date.emissao} - ` : ""}
              {validDate
                ? validEmissao && validVencimento
                  ? `Competência: ${date.competencia}`
                  : `Competência: ${date.mes}/${date.ano}`
                : ""}
              {validVencimento ? ` - Vencimento: ${date.vencimento}` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
