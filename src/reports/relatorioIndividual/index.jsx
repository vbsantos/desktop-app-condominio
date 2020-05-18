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
        ? categoria.data.map((despesa) => [despesa.nome, despesa.valor])
        : [
            [
              categoria.name === "total" ? "Total" : "Fundo Reserva",
              categoria.data,
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
                  <TableCell id="nome">{despesa[0]}</TableCell>
                  <TableCell id="valor">{"R$ " + despesa[1]}</TableCell>
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
                  <TableCell id="nome">{despesa[0]}</TableCell>
                  <TableCell id="valor">{"R$ " + despesa[1]}</TableCell>
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
                  <TableCell id="agua">{info.aguaAnterior + "m³"}</TableCell>
                  <TableCell id="agua">{info.aguaAtual + "m³"}</TableCell>
                  <TableCell id="agua">{info.aguaConsumo + "m³"}</TableCell>
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
