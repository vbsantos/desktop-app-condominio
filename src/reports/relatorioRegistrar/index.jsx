import React from "react";

// MATERIAL UI COMPONENTS
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from "@material-ui/core";

// CSS
import "./style.css";

export default function RelatorioCondominioRegistrar(props) {
  // Stores the general report reference
  const { reportRef } = props;

  // Data
  const [data, setData] = props.data;

  // All Contas of the Condominio
  const despesas = data.allNestedCondominio["Despesas"];

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
  const categorias_sorted = [...categorias].sort();

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

  let despesaFundoReserva = null;
  if (despesas) {
    despesaFundoReserva = despesas.find((despesa) => despesa.fundoReserva);
  }

  const setDespesas = (despesas) => {
    setData({
      ...data,
      allNestedCondominio: {
        ...data.allNestedCondominio,
        Despesas: despesas,
      },
    });
  };

  const toggleClassInativa = (despesa_id) => {
    const element = document.getElementById(`linha_despesa_${despesa_id}`);
    element.classList.toggle("Inativa");
  };

  const setStatusDespesa = async (event, despesa_id) => {
    event.stopPropagation();

    const despesa_ativa = event.target.checked;
    const despesa = despesas.find((despesa) => despesa.id === despesa_id);
    toggleClassInativa(despesa.id);
    despesa.ativa = despesa_ativa;

    if (despesa.aguaIndividual) {
      const despesa2 = despesas.find(
        (despesa) => despesa.aguaIndividual && despesa.id !== despesa_id
      );
      toggleClassInativa(despesa2.id);
      despesa2.ativa = despesa_ativa;
      await window.ipcRenderer.invoke("despesas", {
        method: "update",
        content: despesa2,
      });
    }

    const response = await window.ipcRenderer.invoke("despesas", {
      method: "update",
      content: despesa,
    });

    console.warn("Despesa Editada:", response);

    const updated_despesas = data.allNestedCondominio["Despesas"].map(
      (despesa_temp) => {
        if (despesa_temp.id === despesa_id) {
          despesa_temp.ativa = despesa_ativa;
        }
        return despesa_temp;
      }
    );

    setDespesas(updated_despesas);
  };

  return (
    <div id="relatorioCondominioRegistrar">
      <TableContainer ref={reportRef}>
        {despesaFundoReserva && (
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
                id={`linha_despesa_${despesaFundoReserva.id}`}
                className={
                  despesaFundoReserva.ativa ? "Linha" : "Linha Inativa"
                }
                onClick={() =>
                  selectAndOpenDialog(despesaFundoReserva.id || "")
                }
              >
                <TableCell className="col1">
                  <Checkbox
                    color="primary"
                    className="smallCheckbox"
                    defaultChecked={despesaFundoReserva.ativa}
                    title={
                      despesaFundoReserva.ativa
                        ? "Desativar Despesa"
                        : "Ativar Despesa"
                    }
                    onClick={(event) =>
                      setStatusDespesa(event, despesaFundoReserva.id)
                    }
                  />
                  Fundo Reserva - {percentage[0]} %
                </TableCell>
                <TableCell className="col2">{despesaFundoReserva.id}</TableCell>
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
                  {"R$ " +
                    (despesaFundoReserva.ativa ? percentage[1] : 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {categorias_sorted.map((categoria) => {
          const categoriaContas = despesas
            .filter((despesa) => despesa.categoria === categoria)
            .sort((despesa_a, despesa_b) =>
              despesa_a.nome.localeCompare(despesa_b.nome)
            );
          const subtotal = categoriaContas
            .filter((despesa) => despesa.ativa)
            .reduce((acc, despesa) => {
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
                    id={`linha_despesa_${categoriaConta.id}`}
                    key={categoria + categoriaConta.id}
                    className={categoriaConta.ativa ? "Linha" : "Linha Inativa"}
                    onClick={() => selectAndOpenDialog(categoriaConta.id)}
                  >
                    <TableCell className="col1">
                      {!(
                        categoriaConta.aguaIndividual &&
                        !categoriaConta.rateioAutomatico
                      ) ? (
                        <Checkbox
                          color="primary"
                          className="smallCheckbox"
                          defaultChecked={categoriaConta.ativa}
                          title={
                            categoriaConta.ativa
                              ? "Desativar Despesa"
                              : "Ativar Despesa"
                          }
                          onClick={(event) =>
                            setStatusDespesa(event, categoriaConta.id)
                          }
                        />
                      ) : (
                        <span className="smallCheckboxSpace"></span>
                      )}
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
                {"R$ " +
                  (despesaFundoReserva?.ativa
                    ? total + percentage[1]
                    : total
                  ).toFixed(2)}
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
                  id={`linha_despesa_${informacao.id}`}
                  className={informacao.ativa ? "" : "Inativa"}
                  key={"informacao" + informacao.id}
                  onClick={() => selectAndOpenDialog(informacao.id)}
                >
                  <TableCell className="uniqueCol">
                    <Checkbox
                      color="primary"
                      className="smallCheckbox"
                      defaultChecked={informacao.ativa}
                      title={
                        informacao.ativa
                          ? "Desativar Informação"
                          : "Ativar Informação"
                      }
                      onClick={(event) =>
                        setStatusDespesa(event, informacao.id)
                      }
                    />
                    {informacao.text}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
}
