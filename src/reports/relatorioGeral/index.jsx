import React, { useRef } from "react";

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

export default function RelatorioGeral(props) {
  const { report } = props;
  const { reportRef } = props;

  return (
    <div id="relatorioGeral" ref={reportRef}>
      <TableContainer>
        {report.map((categoria) => {
          // cada categoria
          let subtotal = 0;
          return (
            categoria.table && (
              <Table key={categoria.name + "table"}>
                <TableHead>
                  <TableRow key={categoria.name + "header"} className="Black">
                    <TableCell className="col1">{categoria.name}</TableCell>
                    <TableCell className="col2">Parcela</TableCell>
                    <TableCell className="col3">Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoria.data.map((despesa) => {
                    // cada conta dessa categoria
                    subtotal += Number(despesa.valor);
                    return (
                      <TableRow key={categoria + despesa.id} className="Linha">
                        <TableCell className="col1">{despesa.nome}</TableCell>
                        <TableCell className="col2">
                          {despesa.permanente
                            ? "Fixa"
                            : `${
                                despesa.parcelaAtual +
                                " de " +
                                despesa.numParcelas
                              }`}
                        </TableCell>
                        <TableCell className="col3">
                          {"R$ " + Number(despesa.valor).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow key={categoria + "subtotal"} className="Black">
                    <TableCell className="col1">SUB-TOTAL:</TableCell>
                    <TableCell className="col2"></TableCell>
                    <TableCell className="col3">
                      {"R$ " + Number(subtotal).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )
          );
        })}

        {/* fundo reserva e soma total dos valores */}
        {report.map((info) => {
          if (!info.table) {
            if (info.name === "fundoReserva") {
              return (
                <Table key={"fundoReserva"}>
                  <TableHead>
                    <TableRow className="Black" id="fundoReservaRow">
                      <TableCell className="col1">Fundo Reserva</TableCell>
                      <TableCell className="col2"></TableCell>
                      <TableCell className="col3">
                        {"R$ " + Number(info.data).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              );
            } else if (info.name === "total") {
              return (
                <Table key={"total"}>
                  <TableHead>
                    <TableRow className="Black">
                      <TableCell className="col1">TOTAL:</TableCell>
                      <TableCell className="col2"></TableCell>
                      <TableCell className="col3">
                        {"R$ " + Number(info.data).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              );
            }
          }
        })}
      </TableContainer>
    </div>
  );
}
