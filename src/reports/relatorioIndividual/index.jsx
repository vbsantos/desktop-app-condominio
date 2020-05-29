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
import IndividualReportHeader from "../../components/headerIndividualReport";

// CSS
import "./style.css";

const pad = (num, size) => {
  var s = "000000000" + num;
  return s.substr(s.length - size);
};

export default function RelatorioIndividual(props) {
  const { reportRef } = props;
  const { reportClass } = props;
  const { report } = props;

  const info =
    report[report.length - 1].name === "info" ? report.pop().data : null;

  // console.warn("RI.info:", info);

  const reportData = report
    .map((categoria) =>
      categoria.table
        ? categoria.data.map((despesa) => [
            despesa.id,
            despesa.nome,
            despesa.valor,
            true,
          ])
        : [
            [
              categoria.id,
              categoria.name === "total" ? "Total" : "Fundo Reserva",
              categoria.data,
              false,
            ],
          ]
    )
    .flat(1);

  // console.warn("RI:", JSON.parse(JSON.stringify(reportData)));

  const table1 = reportData.splice(0, Math.ceil(reportData.length / 2));
  const table2 = reportData;

  return (
    <div id="relatorioIndividual">
      <TableContainer className={reportClass} ref={reportRef}>
        <IndividualReportHeader
          complementoPagante={info.complementoPagante}
          nomePagante={info.nomePagante}
          fracaoPagante={info.fracaoPagante}
        />
        <div id="duasTabelas">
          <Table id="table1">
            <TableHead>
              <TableRow>
                <TableCell id="nome">Despesa</TableCell>
                <TableCell id="valor">{"Valor "}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table1.map((despesa, index) => (
                <TableRow key={"table1row" + index}>
                  <TableCell id="nome">
                    {despesa[3]
                      ? `${pad(despesa[0], 4)} - ${despesa[1]}`
                      : `${despesa[1]}`}
                  </TableCell>
                  <TableCell id="valor">{"R$ " + despesa[2]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table id="table2">
            <TableHead>
              <TableRow>
                <TableCell id="nome">Despesa</TableCell>
                <TableCell id="valor">{"Valor "}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {table2.map((despesa, index) => (
                <TableRow key={"table2row" + index}>
                  <TableCell id="nome">
                    {despesa[3]
                      ? `${pad(despesa[0], 4)} - ${despesa[1]}`
                      : `${despesa[1]}`}
                  </TableCell>
                  <TableCell id="valor">{"R$ " + despesa[2]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {info.aguaConsumo !== null && (
          <TableContainer>
            <Table id="table3">
              <TableHead>
                <TableRow>
                  <TableCell id="agua">Anterior</TableCell>
                  <TableCell id="agua">Atual</TableCell>
                  <TableCell id="agua">Consumo</TableCell>
                  <TableCell id="agua">Valor Unitário</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={"table3row"}>
                  <TableCell id="agua">
                    {Number(info.aguaAnterior).toFixed(3) + "m³"}
                  </TableCell>
                  <TableCell id="agua">
                    {Number(info.aguaAtual).toFixed(3) + "m³"}
                  </TableCell>
                  <TableCell id="agua">
                    {Number(info.aguaConsumo).toFixed(3) + "m³"}
                  </TableCell>
                  <TableCell id="agua">
                    {"R$ " + Number(info.aguaValorUnitario).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TableContainer>
    </div>
  );
}
