import React from "react";

// MATERIAL UI ICON
import { AssessmentOutlined } from "@material-ui/icons";

// CSS
import "./style.css";

export default function IndividualReportHeader(props) {
  const { complementoPagante } = props;
  const { nomePagante } = props;
  const { fracaoPagante } = props;

  return (
    <div id="IndividualReportHeader">
      <div className="bold" id="header-line1">
        Relatório Individual
      </div>
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
