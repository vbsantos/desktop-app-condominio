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
import AnualReportHeader from "../../components/headerAnualReport";

// CSS
import "./style.css";

export default function RelatorioFundoReserva(props) {
  const { report } = props;
  const { reportRef } = props;
  const { reportClass } = props;
  const { view } = props;

  const totalFundoReserva = report.data.reduce(
    (a, b) => a + Number(b.rfrValue),
    0
  );

  return (
    <div id="relatorioAnual">
      <TableContainer className={`${reportClass} ${view}`} ref={reportRef}>
        <AnualReportHeader
          nomeCondominio={report.headerInfo.nomeCondominio}
          enderecoCondominio={report.headerInfo.enderecoCondominio}
          year={report.data[0].month.split("/")[1]}
        />
        <Table>
          <TableHead>
            <TableRow className="Black">
              <TableCell className="col1">Mês</TableCell>
              <TableCell className="col2">Fundo Reserva</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.data.map((mes) => (
              <TableRow key={mes.month + "line"} className="Linha">
                <TableCell className="col1">{mes.month}</TableCell>
                <TableCell className="col2">
                  R$ {Number(mes.rfrValue).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="Black">
              <TableCell className="col1">TOTAL:</TableCell>
              <TableCell className="col2">
                {"R$ " + Number(totalFundoReserva).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
