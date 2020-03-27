import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";

// CSS
import "./style.css";

export default function RelatorioCondominio(props) {
  // Stores the general report reference
  const { reportRef } = props;

  // All Contas of the Condominio
  const { despesas } = props;

  // Function that stores the id of the selected Conta
  const { setSelected } = props;

  // Function that when setted to true opens Conta Edit Dialog
  const [dialogEditContaForm, setDialogEditContaForm] = props.editDialog;

  // Store the Contas by Categoria
  const [categorias, setCategorias] = props.categorias;

  // Store the total value
  const [total, setTotal] = props.valorTotal;

  // Store the fundoReserva percentage
  const [percentage, setPercentage] = props.valorFundoReserva;

  // Function that runs when you click in a Conta row
  const selectAndOpenDialog = id => {
    setSelected({ id });
    setDialogEditContaForm(true);
  };

  return (
    <TableContainer ref={reportRef}>
      {categorias.map(categoria => {
        const categoriaContas = despesas.filter(
          despesa => despesa.categoria === categoria
        );
        const subtotal = categoriaContas.reduce((acc, despesa) => {
          return acc + Number(despesa.valor);
        }, 0);
        return (
          <Table key={categoria + "table"}>
            <TableHead>
              <TableRow key={categoria + "header"} className="Black">
                <TableCell className="col1">{categoria}</TableCell>
                <TableCell className="col2">Parcela</TableCell>
                <TableCell className="col3">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoriaContas.map(categoriaConta => (
                <TableRow
                  key={categoria + categoriaConta.id}
                  className="Linha"
                  onClick={() => selectAndOpenDialog(categoriaConta.id)}
                >
                  <TableCell className="col1">{categoriaConta.nome}</TableCell>
                  <TableCell className="col2">
                    {categoriaConta.permanente
                      ? "Fixa"
                      : `${categoriaConta.parcelaAtual +
                          " de " +
                          categoriaConta.numParcelas}`}
                  </TableCell>
                  <TableCell className="col3">
                    {"R$ " + Number(categoriaConta.valor).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow key={categoria + "subtotal"} className="Black">
                <TableCell className="col1">SUB-TOTAL:</TableCell>
                <TableCell className="col2"></TableCell>
                <TableCell className="col3">
                  {"R$ " + Number(subtotal).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      })}
      <Table key={"total"}>
        <TableHead>
          <TableRow className="Black">
            <TableCell className="col1">
              Fundo Reserva - {percentage[0]} %
            </TableCell>
            <TableCell className="col2"></TableCell>
            <TableCell className="col3">
              {"R$ " + percentage[1].toFixed(2)}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <Table key={"fundoReserva"}>
        <TableHead>
          <TableRow className="Black">
            <TableCell className="col1">TOTAL:</TableCell>
            <TableCell className="col2"></TableCell>
            <TableCell className="col3">
              {"R$ " + (total + percentage[1]).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
}
