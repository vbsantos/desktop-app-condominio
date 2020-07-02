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

export default function RelatorioCondominioRegistrar(props) {
  // Stores the general report reference
  const { reportRef } = props;

  // All Contas of the Condominio
  const { despesas } = props;

  // Function that stores the id of the selected Conta
  const { setSelected } = props;

  // Function that when setted to true opens Conta Edit Dialog
  const [
    dialogEditDespesaFixa,
    setDialogEditDespesaFixa,
  ] = props.dialogEditDespesaFixa;
  const [
    dialogEditDespesaParcelada,
    setDialogEditDespesaParcelada,
  ] = props.dialogEditDespesaParcelada;
  const [
    dialogEditDespesaAgua,
    setDialogEditDespesaAgua,
  ] = props.dialogEditDespesaAgua;
  const [
    dialogEditDespesaFundoReserva,
    setDialogEditDespesaFundoReserva,
  ] = props.dialogEditDespesaFundoReserva;
  const [
    dialogEditInformacao,
    setDialogEditInformacao,
  ] = props.dialogEditInformacao;

  // Store the Contas by Categoria
  const [categorias, setCategorias] = props.categorias;

  // Store the total value
  const [total, setTotal] = props.valorTotal;

  // Store the fundoReserva percentage
  const [percentage, setPercentage] = props.valorFundoReserva;

  // Store the informacoes
  const [informacoes, setInformacoes] = props.informacoes;

  // Function that runs when you click in a Conta row
  const selectAndOpenDialog = (id) => {
    setSelected({ id }); // pega o id da despesa
    const despesa = despesas.find((despesa) => despesa.id === id);

    if (despesa.fundoReserva) {
      setDialogEditDespesaFundoReserva(true);
    } else if (despesa.informacao) {
      setDialogEditInformacao(true);
    } else if (despesa.aguaIndividual) {
      setDialogEditDespesaAgua(true);
    } else if (despesa.permanente) {
      setDialogEditDespesaFixa(true);
    } else {
      setDialogEditDespesaParcelada(true);
    }
  };

  // TODO colocar despesas (categoria) em ordem alfabética

  return (
    <div id="relatorioCondominioRegistrar">
      <TableContainer ref={reportRef}>
        {percentage[0] !== 0 && (
          <Table>
            <TableHead>
              <TableRow className="Black">
                <TableCell className="col1">{"1.RECEITA"}</TableCell>
                <TableCell className="col2">Cód.</TableCell>
                <TableCell className="col3">Parcela</TableCell>
                <TableCell className="col4">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                className="Linha"
                onClick={() =>
                  selectAndOpenDialog(
                    despesas.find((despesa) => despesa.fundoReserva).id || ""
                  )
                }
              >
                <TableCell className="col1">
                  Fundo Reserva - {percentage[0]} %
                </TableCell>
                <TableCell className="col2">
                  {despesas.find((despesa) => despesa.fundoReserva).id}
                </TableCell>
                <TableCell className="col3">{"Fixa"}</TableCell>
                <TableCell className="col4">
                  {"R$ " + percentage[1].toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow className="Black">
                <TableCell className="col1">SUB-TOTAL:</TableCell>
                <TableCell className="col2"></TableCell>
                <TableCell className="col3"></TableCell>
                <TableCell className="col4">
                  {"R$ " + percentage[1].toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {categorias.map((categoria) => {
          const categoriaContas = despesas.filter(
            (despesa) => despesa.categoria === categoria
          );
          const subtotal = categoriaContas.reduce((acc, despesa) => {
            return acc + Number(despesa.valor);
          }, 0);
          return (
            <Table key={categoria + "table"}>
              <TableHead>
                <TableRow key={categoria + "header"} className="Black">
                  <TableCell className="col1">{categoria}</TableCell>
                  <TableCell className="col2">Cód.</TableCell>
                  <TableCell className="col3">Parcela</TableCell>
                  <TableCell className="col4">Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriaContas.map((categoriaConta) => (
                  <TableRow
                    key={categoria + categoriaConta.id}
                    className="Linha"
                    onClick={() => selectAndOpenDialog(categoriaConta.id)}
                  >
                    <TableCell className="col1">
                      {categoriaConta.nome}
                    </TableCell>
                    <TableCell className="col2">{categoriaConta.id}</TableCell>
                    <TableCell className="col3">
                      {categoriaConta.permanente
                        ? "Fixa"
                        : `${
                            categoriaConta.parcelaAtual +
                            " de " +
                            categoriaConta.numParcelas
                          }`}
                    </TableCell>
                    <TableCell className="col4">
                      {"R$ " + Number(categoriaConta.valor).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
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
          );
        })}

        <Table key={"total"}>
          <TableHead>
            <TableRow className="Black">
              <TableCell className="col1">TOTAL:</TableCell>
              <TableCell className="col2"></TableCell>
              <TableCell className="col3"></TableCell>
              <TableCell className="col4">
                {"R$ " + (total + percentage[1]).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>

        {informacoes.length > 0 && (
          <Table key={"informacoes"}>
            <TableHead>
              <TableRow className="Black" id="informacoesRow">
                <TableCell className="col1">Informações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {informacoes.map((informacao) => (
                <TableRow
                  key={"informacao" + informacao.id}
                  onClick={() => selectAndOpenDialog(informacao.id)}
                >
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
