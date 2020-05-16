import React from "react";

// MATERIAL UI ICON
import { AssessmentOutlined } from "@material-ui/icons";

// CSS
import "./style.css";

export default function IndividualReportHeader(props) {
  const { complementoPagante } = props;
  const { nomePagante } = props;

  return (
    <div id="IndividualReportHeader">
      <div id="header-line1">{"Relatório Individual"}</div>
      <div id="header-line2">{"Apartamento " + complementoPagante}</div>
      {"Morador " + nomePagante}
      <div id="header-line3"></div>
    </div>
  );
}
