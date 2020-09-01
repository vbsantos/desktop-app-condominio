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
import ReserveFundReportHeader from "../../components/headerReserveFundReport";

// CSS
import "./style.css";

export default function RelatorioFundoReserva(props) {
  const { report } = props;
  const { reportRef } = props;
  const { reportClass } = props;
  const { view } = props;

  if (!report) return null;

  const headerInfo = report[1];

  return (
    <div id="relatorioFundoReserva">
      <TableContainer className={`${reportClass} ${view}`} ref={reportRef}>
        <ReserveFundReportHeader
          nomeCondominio={headerInfo.data.nomeCondominio}
          enderecoCondominio={headerInfo.data.enderecoCondominio}
          date={headerInfo.data.reportDate}
        />
        <Table key={report[0].name + "table"}>
          <TableHead>
            <TableRow key={report[0].name + "header"} className="Black">
              <TableCell className="col1">Unidade</TableCell>
              <TableCell className="col2">Box</TableCell>
              <TableCell className="col3">Condômino</TableCell>
              <TableCell className="col4">Fração</TableCell>
              <TableCell className="col5">Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report[0].data.map((pagante) => (
              <TableRow key={pagante.unidade + "line"} className="Linha">
                <TableCell className="col1">{pagante.unidade}</TableCell>
                <TableCell className="col2">{pagante.box}</TableCell>
                <TableCell className="col3">{pagante.nome}</TableCell>
                <TableCell className="col4">{pagante.fracao}</TableCell>
                <TableCell className="col5">
                  {"R$ " + pagante.valor.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow key={report[0].name + "subtotal"} className="Black">
              <TableCell className="col1">TOTAL:</TableCell>
              <TableCell className="col2"></TableCell>
              <TableCell className="col3"></TableCell>
              <TableCell className="col4"></TableCell>
              <TableCell className="col5">
                {"R$ " + headerInfo.data.totalFundoReserva.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
