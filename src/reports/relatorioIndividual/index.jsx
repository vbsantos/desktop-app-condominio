import React, { useState } from "react";

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

  const [tableSize, setTableSize] = useState(Math.ceil(reportData.length / 2));

  const table1 = reportData.splice(0, tableSize);
  const table2 = reportData;

  console.warn(table1, table2);

  return (
    <div id="relatorioIndividual" ref={reportRef}>
      <TableContainer>
        <Table id="table1">
          <TableHead>
            <TableRow>
              <TableCell id="nome">Despesa</TableCell>
              <TableCell id="valor">{"Valor (R$) "}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table1.map((despesa) => (
              <TableRow>
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
              <TableCell id="valor">{"Valor (R$) "}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table2.map((despesa) => (
              <TableRow>
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
