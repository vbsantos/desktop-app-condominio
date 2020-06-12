import React from "react";

// MATERIAL UI COMPONENTS
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

// COMPONENTS
import WaterReportHeader from "../../components/headerWaterReport";

// CSS
import "./style.css";

export default function RelatorioAgua(props) {
  const { report } = props;
  const { reportRef } = props;
  const { reportClass } = props;

  const headerInfo = report[2];
  console.warn(headerInfo);
  console.warn(report);

  const keys = Object.keys(report[0].data[0]);

  function camelize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  return (
    <div id="relatorioAgua">
      <TableContainer className={reportClass} ref={reportRef}>
        <WaterReportHeader
          nomeCondominio={headerInfo.data.nomeCondominio}
          enderecoCondominio={headerInfo.data.enderecoCondominio}
          date={headerInfo.data.reportDate}
          precoAgua={headerInfo.data.precoAgua}
        />

        <Table key={report[0].name + "table"}>
          <TableHead>
            <TableRow key={report[0].name + "header"} className="Black">
              <TableCell className="col1">{camelize(keys[0])}</TableCell>
              <TableCell className="col2">{camelize(keys[1])}</TableCell>
              <TableCell className="col3">{camelize(keys[2])}</TableCell>
              <TableCell className="col4">{camelize(keys[3])}</TableCell>
              <TableCell className="col5">{camelize(keys[4])}</TableCell>
              <TableCell className="col6">Nova Leitura</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report[0].data.map((pagante) => (
              <TableRow key={pagante.unidade + "line"} className="Linha">
                <TableCell className="col1">{pagante.unidade}</TableCell>
                <TableCell className="col2">
                  {pagante.anterior.toFixed(3)} m³
                </TableCell>
                <TableCell className="col3">
                  {pagante.atual.toFixed(3)} m³
                </TableCell>
                <TableCell className="col4">
                  {pagante.consumo.toFixed(3)} m³
                </TableCell>
                <TableCell className="col5">
                  R$ {pagante.valor.toFixed(2)}
                </TableCell>
                <TableCell className="col6"></TableCell>
              </TableRow>
            ))}
            <TableRow key={report[0].name + "subtotal"} className="Black">
              <TableCell className="col1">TOTAL:</TableCell>
              <TableCell className="col2">
                {headerInfo.data.totalAnteriorIndividual.toFixed(3)} m³
              </TableCell>
              <TableCell className="col3">
                {headerInfo.data.totalAtualIndividual.toFixed(3)} m³
              </TableCell>
              <TableCell className="col4">
                {headerInfo.data.totalConsumoIndividual.toFixed(3)} m³
              </TableCell>
              <TableCell className="col5">
                R$ {headerInfo.data.totalIndividual.toFixed(2)}
              </TableCell>
              <TableCell className="col6"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
