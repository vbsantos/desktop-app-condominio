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

// CSS
import "./style.css";

export default function RelatorioIndividual(props) {
  const { reportRef } = props;
  const { reportClass } = props;

  const reportData = props.report
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

  const table1 = reportData.splice(0, Math.ceil(reportData.length / 2));
  const table2 = reportData;

  return (
    <div id="relatorioIndividual">
      <TableContainer className={reportClass} ref={reportRef}>
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
      </TableContainer>
    </div>
  );
}
