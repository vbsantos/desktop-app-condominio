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
import ApportionmentReportHeader from "../../components/headerApportionmentReport";

// CSS
import "./style.css";

export default function RelatorioGeral(props) {
  const { report } = props;
  const { reportRef } = props;
  const { reportClass } = props;
  const { view } = props;

  const headerInfo =
    report[report.length - 1].name === "info"
      ? report[report.length - 1]
      : null;

  // console.warn("RR.info:", headerInfo);

  const tabela1 = report[0];

  // console.warn("RR.report:", tabela1.data);

  const colunas = report[0].data[0].valores.map((coluna) => {
    return {
      // codigo: coluna.id, // n to usando
      nome: coluna.nome,
    };
  });

  return (
    <div id="relatorioRateio">
      <TableContainer className={`${reportClass} ${view}`} ref={reportRef}>
        <ApportionmentReportHeader
          nomeCondominio={headerInfo.data.nomeCondominio}
          enderecoCondominio={headerInfo.data.enderecoCondominio}
          date={headerInfo.data.reportDate}
        />

        <Table key={tabela1.nome + "table"}>
          <TableHead>
            <TableRow key={tabela1.nome + "header"} className="Black">
              <TableCell className="col_start">{"Unidades"}</TableCell>

              {colunas.map((coluna) => (
                <TableCell key={"header_" + coluna.nome} className="col">
                  {coluna.nome}
                </TableCell>
              ))}

              <TableCell className="col_end">{"Total"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabela1.data.map((pagante) => (
              <TableRow key={"linha_" + pagante.unidade} className="Linha">
                <TableCell className="col_start">{pagante.unidade}</TableCell>

                {pagante.valores.map((valor, index) => (
                  <TableCell
                    key={"linha_" + pagante.unidade + index}
                    className="col"
                  >{`R$ ${valor.valor.toFixed(2)}`}</TableCell>
                ))}

                <TableCell className="col_end">{`R$ ${pagante.total.toFixed(
                  2
                )}`}</TableCell>
              </TableRow>
            ))}
            <TableRow key={"total"} className="Black">
              <TableCell className="col_start">{"TOTAL:"}</TableCell>
              {headerInfo.data.totais.map((total, index) => (
                <TableCell
                  key={"total_" + index}
                  className="col"
                >{`R$ ${total.toFixed(2)}`}</TableCell>
              ))}
              <TableCell className="col_end">{`R$ ${headerInfo.data.total.toFixed(
                2
              )}`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
