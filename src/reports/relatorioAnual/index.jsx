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

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function RelatorioAnual(props) {
  const { report } = props;
  const { reportRef } = props;
  const { reportClass } = props;
  const { view } = props;

  const ano = report.data[0].month.split("/")[1];

  const totalFundoReserva = report.data.reduce(
    (a, b) => a + Number(b.rfrValue),
    0
  );

  const byMonth = {
    Janeiro: 0,
    Fevereiro: 0,
    Março: 0,
    Abril: 0,
    Maio: 0,
    Junho: 0,
    Julho: 0,
    Agosto: 0,
    Setembro: 0,
    Outubro: 0,
    Novembro: 0,
    Dezembro: 0,
  };

  const byUnidade = JSON.parse(report.data[0].rfrValues).map((unidade) => {
    return {
      unidade: unidade.unidade,
      fracao: unidade.fracao,
      box: unidade.box,
      Janeiro: 0,
      Fevereiro: 0,
      Março: 0,
      Abril: 0,
      Maio: 0,
      Junho: 0,
      Julho: 0,
      Agosto: 0,
      Setembro: 0,
      Outubro: 0,
      Novembro: 0,
      Dezembro: 0,
      total: 0,
    };
  });

  report.data.map((mes) => {
    const str_mes = months[parseInt(mes.month) - 1];
    const individuais = JSON.parse(mes.rfrValues);
    individuais.map((unidade) => {
      const index = byUnidade.findIndex((u) => u.unidade === unidade.unidade);
      const valor = unidade.valor;
      byUnidade[index][str_mes] = valor;
      byUnidade[index]["total"] += Number(valor);
      byMonth[str_mes] += Number(valor);
    });
  });

  return (
    <div id="relatorioAnual">
      <TableContainer className={`${reportClass} ${view}`} ref={reportRef}>
        <AnualReportHeader
          nomeCondominio={report.headerInfo.nomeCondominio}
          enderecoCondominio={report.headerInfo.enderecoCondominio}
          year={ano}
        />
        <Table>
          <TableHead>
            <TableRow className="Black">
              <TableCell className="colInicial">Unidade</TableCell>
              <TableCell className="colInicial">Box</TableCell>
              <TableCell className="colInicial">Fração</TableCell>
              {months.map((mes) => (
                <TableCell key={"header_" + mes} className="colCentral">
                  {mes}
                </TableCell>
              ))}
              <TableCell className="colFinal">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {byUnidade.map((unidade) => (
              <TableRow key={"body_" + unidade.unidade} className="Linha">
                <TableCell className="colInicial">{unidade.unidade}</TableCell>
                <TableCell className="colInicial">{unidade.box}</TableCell>
                <TableCell className="colInicial">{unidade.fracao}</TableCell>
                {months.map((mes) => (
                  <TableCell key={unidade.unidade + mes} className="colCentral">
                    R$ {unidade[mes].toFixed(2)}
                  </TableCell>
                ))}
                <TableCell className="colFinal">
                  R$ {unidade.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow className="Black">
              <TableCell className="colInicial">TOTAL:</TableCell>
              <TableCell className="colCentral"></TableCell>
              <TableCell className="colCentral"></TableCell>
              {months.map((mes) => (
                <TableCell key={"footer_" + mes} className="colCentral">
                  R$ {byMonth[mes].toFixed(2)}
                </TableCell>
              ))}
              <TableCell className="colFinal">
                {"R$ " + Number(totalFundoReserva).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
