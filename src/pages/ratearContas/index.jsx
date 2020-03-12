import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";

// MATERIAL UI ICONS
import { PlusOne } from "@material-ui/icons";

// CSS
import "./style.css";

// DIALOGS
import DialogConta from "../../dialogs/conta";
import DialogExcluirConta from "../../dialogs/deletarConta";

export default function RatearContas(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // Store the total value
  const [total, setTotal] = useState(0);

  // ID of the selected Conta
  const [selectedConta, setSelectedConta] = useState({ id: -1 });

  // Boolean for Edit Dialog
  const [dialogEditContaForm, setDialogEditContaForm] = useState(false);

  // Boolean for Register Dialog
  const [dialogRegisterContaForm, setDialogRegisterContaForm] = useState(false);

  // Boolean for Delete Dialog
  const [dialogDeleteConta, setDialogDeleteConta] = useState(false);

  console.log("Entrou em RatearContas\nFootbar:", footbar, "\nData:", data);

  // This function runs only when the component is monted
  useEffect(() => {
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR"
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: ""
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "Finalizar"
        }
      ],
      action: -1
    });
    return () => console.log("RatearContas - Encerrou");
  }, []);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("RatearContas - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/EscolherCondominio");
        break;
      case 2:
        console.log("RatearContas - Botão da direita");
        setFootbar({ ...footbar, action: -1 });
        navigate("/"); // vai pra tela de rateamento de contas
        break;
    }
  }, [footbar.action]);

  // This function runs only when the all dialogs are closed
  useEffect(() => {
    data.beneficiario.id || navigate("/");
    // console.log("Ta bugando pq?", data.beneficiario.id);
    const allDialogsClosed = !(
      dialogRegisterContaForm ||
      dialogDeleteConta ||
      dialogEditContaForm
    );
    if (allDialogsClosed) {
      // console.log(data.allNestedCondominio["Contas"]);
      async function getEverything() {
        console.time("getEverything");
        const allNestedBeneficiario = await window.ipcRenderer.invoke(
          "beneficiarios",
          {
            method: "showNested",
            content: { id: data.beneficiario.id }
          }
        );
        const allNestedCondominio = allNestedBeneficiario["Condominios"].filter(
          condominio => condominio.id === data.allNestedCondominio.id
        )[0];
        setData({
          ...data,
          allNestedBeneficiario,
          allNestedCondominio
        });
        console.timeEnd("getEverything");
        setTotal(
          data.allNestedCondominio["Contas"].reduce((total, conta) => {
            // TODO deletei uma acc e ele continuou NaN
            return total + Number(conta.valor);
          }, 0)
        );
      }
      getEverything();
    }
  }, [dialogRegisterContaForm, dialogDeleteConta, dialogEditContaForm]);

  const handleContaRegister = () => {
    console.log("CADASTRAR CONTA");
    setDialogRegisterContaForm(true);
  };

  const handleContaEdit = contaId => {
    console.log("EDITAR CONTA", contaId);
    setSelectedConta({ id: contaId });
    setDialogEditContaForm(true);
  };

  return (
    <div>
      {dialogRegisterContaForm && (
        <DialogConta
          open={[dialogRegisterContaForm, setDialogRegisterContaForm]}
          delete={[dialogDeleteConta, setDialogDeleteConta]}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogEditContaForm && (
        <DialogConta
          open={[dialogEditContaForm, setDialogEditContaForm]}
          delete={[dialogDeleteConta, setDialogDeleteConta]}
          condominio={data.allNestedCondominio}
          conta={
            data.allNestedCondominio["Contas"].filter(
              conta => conta.id === selectedConta.id
            )[0]
          }
        />
      )}
      {dialogDeleteConta && (
        <DialogExcluirConta
          open={[dialogDeleteConta, setDialogDeleteConta]}
          conta={
            data.allNestedCondominio["Contas"].filter(
              conta => conta.id === selectedConta.id
            )[0]
          }
        />
      )}
      {/* <h1 className="PageTitle">Registro de Despesas</h1> */}
      {/* TABLE */}
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow key={"header"}>
              {/* HEAD */}
              <TableCell className="ContaTitleCell">
                <strong>Condôminos</strong>
              </TableCell>
              {/* CADA CONTA ADICIONADA */}
              {typeof data.allNestedCondominio["Contas"] !== "undefined" &&
                data.allNestedCondominio["Contas"].map(conta => (
                  <TableCell
                    key={conta.id}
                    onClick={() => handleContaEdit(conta.id)}
                    className="ContaEditLink"
                    title={
                      "Nome: " +
                      conta.nome +
                      "\nValor: R$ " +
                      Number(conta.valor).toFixed(2)
                    }
                  >
                    <p>
                      <strong>{conta.nome}</strong>
                      <br />
                      R$ {Number(conta.valor).toFixed(2)}
                    </p>
                  </TableCell>
                ))}
              {/* COLUNA DE ADICIONAR NOVA CONTA */}
              <TableCell
                key={-1}
                onClick={handleContaRegister}
                className="ContaRegisterLink"
              >
                <PlusOne />
              </TableCell>
              {/* O TOTAL DAS CONTAS */}
              <TableCell className="ContaTitleCell">
                <p>
                  <strong>Total</strong>
                  <br />
                  R$ {Number(total).toFixed(2)}
                </p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* BODY */}
            {typeof data.allNestedCondominio["Pagantes"] !== "undefined" &&
              data.allNestedCondominio["Pagantes"].map(pagante => (
                <TableRow key={String(pagante.id) + "row"}>
                  <TableCell
                    key={pagante.id}
                    title={
                      "Nome: " +
                      pagante.nome +
                      "\nApartamento: " +
                      pagante.complemento +
                      "\nFração: " +
                      Number(pagante.fracao).toFixed(4)
                    }
                  >
                    <p>
                      <strong>{pagante.complemento} </strong>(
                      {Number(pagante.fracao).toFixed(4)})
                    </p>
                  </TableCell>
                  {/* CADA CONTA ADICIONADA */}
                  {data.allNestedCondominio["Contas"].map(conta => {
                    const result = String(
                      (pagante.fracao * conta.valor).toFixed(2)
                    );
                    return (
                      <TableCell
                        className="ContaCell"
                        key={String(conta.id) + String(pagante.id)}
                        title={`${pagante.fracao} x ${Number(
                          conta.valor
                        ).toFixed(2)} = R$ ${result}`}
                      >
                        <p>R$ {result}</p>
                      </TableCell>
                    );
                  })}
                  {/* COLUNA DE ADICIONAR NOVA CONTA */}
                  <TableCell
                    key={String(pagante.id) + "="}
                    className="ContaCell"
                  >
                    =
                  </TableCell>
                  {/* O TOTAL INDIVIDUAL DAS CONTAS */}
                  <TableCell
                    className="ContaCell"
                    key={String(pagante.id) + "total"}
                    title={`${pagante.fracao} x ${total} = R$ ${(
                      pagante.fracao * total
                    ).toFixed(2)}`}
                  >
                    <p>R$ {(pagante.fracao * total).toFixed(2)}</p>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
