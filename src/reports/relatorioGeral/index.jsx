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
import GeneralReportHeader from "../../components/headerGeneralReport";

// CSS
import "./style.css";

export default function RelatorioGeral(props) {
  const { report } = props;
  const { reportRef } = props;
  const { reportClass } = props;

  const headerInfo =
    report[report.length - 1].name === "info" ? report.pop().data : null;

  const fundoReserva = report.find(
    (data) => !data.table && data.name === "fundoReserva"
  );
  const total = report.find((data) => !data.table && data.name === "total");
  const informacoes = report.find(
    (data) => !data.table && data.name === "informacoes"
  );

  return (
    <div id="relatorioGeral">
      <TableContainer className={reportClass} ref={reportRef}>
        <GeneralReportHeader
          nomeCondominio={headerInfo.nameCondominio}
          nomeAdministrador={headerInfo.nameAdministrador}
        />

        {/* TODO MOSTRAR fundo reserva COMO UMA DESPESA COMUM */}
        {fundoReserva && (
          <Table key={"fundoReserva"}>
            <TableHead>
              <TableRow className="Black" id="fundoReservaRow">
                <TableCell className="col1">Fundo Reserva</TableCell>
                <TableCell className="col2"></TableCell>
                <TableCell className="col3">
                  {"R$ " + Number(fundoReserva.data).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        )}

        {report.map((categoria) => {
          // cada categoria
          let subtotal = 0;
          return (
            categoria.table && (
              <Table key={categoria.name + "table"}>
                <TableHead>
                  <TableRow key={categoria.name + "header"} className="Black">
                    <TableCell className="col1">{categoria.name}</TableCell>
                    <TableCell className="col2">Cód.</TableCell>
                    <TableCell className="col3">Parcela</TableCell>
                    <TableCell className="col4">Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoria.data.map((despesa) => {
                    // cada conta dessa categoria
                    subtotal += Number(despesa.valor);
                    return (
                      <TableRow key={categoria + despesa.id} className="Linha">
                        <TableCell className="col1">{despesa.nome}</TableCell>
                        <TableCell className="col2">{despesa.id}</TableCell>
                        <TableCell className="col3">
                          {despesa.permanente
                            ? "Fixa"
                            : `${
                                despesa.parcelaAtual +
                                " de " +
                                despesa.numParcelas
                              }`}
                        </TableCell>
                        <TableCell className="col4">
                          {"R$ " + Number(despesa.valor).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow key={categoria + "subtotal"} className="Black">
                    <TableCell className="col1">SUB-TOTAL:</TableCell>
                    <TableCell className="col2"></TableCell>
                    <TableCell className="col3"></TableCell>
                    <TableCell className="col4">
                      {"R$ " + Number(subtotal).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )
          );
        })}

        <Table key={"total"}>
          <TableHead>
            <TableRow className="Black">
              <TableCell className="col1">TOTAL:</TableCell>
              <TableCell className="col2"></TableCell>
              <TableCell className="col3"></TableCell>
              <TableCell className="col4">
                {"R$ " + Number(total.data).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>

        {informacoes && (
          <Table key={"informacoes"}>
            <TableHead>
              <TableRow className="Black" id="informacoesRow">
                <TableCell className="col1">Informações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {informacoes.data.map((informacao) => (
                <TableRow key={"informacoes" + informacao.id}>
                  <TableCell className="uniqueCol">{informacao.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
}
