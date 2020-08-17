import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { Container, CircularProgress, Button } from "@material-ui/core";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";

import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";

// MATERIAL UI ICONS
import {
  DeleteTwoTone as Delete,
  CreateTwoTone as Create,
  AssessmentTwoTone as Assessment,
  HomeWorkTwoTone as HomeWork,
  PeopleTwoTone as People,
} from "@material-ui/icons";

// CSS
import "./style.css";

// DIALOGS
import DialogCondominio from "../../dialogs/condominio";
import DialogExcluirCondominio from "../../dialogs/deletarCondominio";
import DialogPagante from "../../dialogs/pagante";
import DialogExcluirPagante from "../../dialogs/deletarPagante";
import DialogAlerta from "../../dialogs/alerta";

export default function EscolherCondominio(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;

  const [loading, setLoading] = useState(false);

  // React Router Hook for navigation between pages
  const navigate = useNavigate();

  // ID of the selected Condominio
  const [selectedCondominio, setSelectedCondominio] = useState({ id: -1 });

  // ID of the selected Pagante
  const [selectedPagante, setSelectedPagante] = useState({ id: -1 });

  // Boolean for Condominio expanded panels
  const [expanded, setExpanded] = useState(false);

  // Boolean for Register Dialog
  const [
    dialogRegisterCondominioForm,
    setDialogRegisterCondominioForm,
  ] = useState(false);

  // Boolean for Edit Dialog
  const [dialogEditCondominioForm, setDialogEditCondominioForm] = useState(
    false
  );

  // Boolean for Delete Confirmation Dialog
  const [dialogDeleteCondominio, setDialogDeleteCondominio] = useState(false);

  // Boolean for Register Dialog
  const [dialogRegisterPaganteForm, setDialogRegisterPaganteForm] = useState(
    false
  );

  // Boolean for Edit Dialog
  const [dialogEditPaganteForm, setDialogEditPaganteForm] = useState(false);

  // Boolean for Delete Confirmation Dialog
  const [dialogDeletePagante, setDialogDeletePagante] = useState(false);

  // Boolean for Alert Dialog
  const [dialogAlertDespesas, setDialogAlertDespesas] = useState(false);
  const [dialogAlertNoReports, setDialogAlertNoReports] = useState(false);
  const [dialogAlertPagante, setDialogAlertPagante] = useState(false);
  const [dialogAlertFracao, setDialogAlertFracao] = useState(false);

  console.groupCollapsed("EscolherCondominio: System data");
  console.log("Footbar:", footbar);
  console.log("Data:", data);
  console.groupEnd("EscolherCondominio: System data");

  // This function runs only when the component is monted
  useEffect(() => {
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR",
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: "",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "CONTINUAR",
        },
      ],
      action: -1,
    });
    return () => console.log("EscolherCondominio - Encerrou");
  }, []);

  // This function runs only when there is an interaction with the footbar buttons
  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("EscolherCondominio - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        navigate("/");
        break;
      case 2:
        console.log("EscolherCondominio - Botão da direita");
        const hasPagantes = data.allNestedCondominio["Pagantes"].length > 0;
        const sumFracao = data.allNestedCondominio["Pagantes"]
          .reduce((a, b) => a + Number(b.fracao), 0)
          .toFixed(5);
        const validFracao = sumFracao === "1.00000";
        setFootbar({ ...footbar, action: -1 });

        if (validFracao && hasPagantes) {
          navigate("/RegistrarDespesas");
        } else if (!hasPagantes) {
          setDialogAlertPagante(true);
        } else {
          setDialogAlertFracao(true);
        }
    }
  }, [footbar.action]);

  // This function runs only when a different Condominio is selectedCondominio
  useEffect(() => {
    console.log("Condominio selecionado:", selectedCondominio);
    setFootbar({
      ...footbar,
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "VOLTAR",
        },
        {
          id: 1,
          position: "center",
          visible: false,
          enabled: false,
          value: "",
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: selectedCondominio.id !== -1,
          value: "CONTINUAR",
        },
      ],
    });
  }, [selectedCondominio.id]);

  // This function runs only when the confirm delete Condominio dialog is closed
  useEffect(() => {
    if (!dialogDeleteCondominio) {
      // Started as a bug, now it is a feature
      setSelectedCondominio({ id: -1 });
      setExpanded(false);
    }
  }, [dialogDeleteCondominio]);

  // This function runs only when the all dialogs are closed
  useEffect(() => {
    data.beneficiario.id || navigate("/"); //corrects development bug when reloading pages
    const allDialogsClosed = !(
      dialogRegisterCondominioForm ||
      dialogDeleteCondominio ||
      dialogEditCondominioForm ||
      dialogRegisterPaganteForm ||
      dialogDeletePagante ||
      dialogEditPaganteForm
    );
    if (allDialogsClosed) {
      async function getEverything() {
        setLoading(true);
        // console.time("Get all data from database");
        const response = await window.ipcRenderer.invoke("beneficiarios", {
          method: "showNested",
          content: { id: data.beneficiario.id },
        });
        selectedCondominio.id === -1
          ? setData({
              ...data,
              allNestedBeneficiario: response,
            })
          : setData({
              ...data,
              allNestedBeneficiario: response,
              allNestedCondominio: response["Condominios"].find(
                (condominio) => condominio.id == selectedCondominio.id
              ),
            });
        // console.timeEnd("Get all data from database");
        setLoading(false);
      }
      getEverything();
    }
  }, [
    dialogRegisterCondominioForm,
    dialogDeleteCondominio,
    dialogEditCondominioForm,
    dialogRegisterPaganteForm,
    dialogDeletePagante,
    dialogEditPaganteForm,
  ]);

  const handleCondominioClick = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      setSelectedCondominio({ id: panel });
      setExpanded(panel);
      const allNestedCondominio = data.allNestedBeneficiario[
        "Condominios"
      ].find((condominio) => condominio.id === panel);
      setData({ ...data, allNestedCondominio });
    } else {
      setSelectedCondominio({ id: -1 });
      setExpanded(false);
    }
  };

  async function handleCondominioReport(e) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();

    const generalReports = await window.ipcRenderer.invoke("generalReports", {
      method: "indexByOwnerId",
      content: { id: data.allNestedCondominio.id },
    });
    // Mostrar todos relatórios gerais (demonstrativo, rateio e água) na mesma página
    const waterReports = await window.ipcRenderer.invoke("waterReports", {
      method: "indexByOwnerId",
      content: { id: data.allNestedCondominio.id },
    });
    const apportionmentReports = await window.ipcRenderer.invoke(
      "apportionmentReports",
      {
        method: "indexByOwnerId",
        content: { id: data.allNestedCondominio.id },
      }
    );
    const reserveFundReports = await window.ipcRenderer.invoke(
      "reserveFundReports",
      {
        method: "indexByOwnerId",
        content: { id: data.allNestedCondominio.id },
      }
    );

    if (
      generalReports[0] &&
      waterReports[0] &&
      apportionmentReports[0] &&
      reserveFundReports[0]
    ) {
      const reports = {
        generalReport: true,
        data: generalReports, // general reports
        data2: apportionmentReports, // apportionment reports
        data3: waterReports, // water reports
        data4: reserveFundReports, // reserve fund reports
      };
      setData({ ...data, reports });
      navigate("/VisualizarRelatorios");
    } else {
      setDialogAlertNoReports(true);
    }
  }

  function handleCondominioEdit(e) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    setDialogEditCondominioForm(true);
  }

  function handleCondominioDelete(e) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    setDialogDeleteCondominio(true);
  }

  function hadleCondominioRegister() {
    setDialogRegisterCondominioForm(true);
  }

  async function handlePaganteReport(id) {
    const individualReports = await window.ipcRenderer.invoke(
      "individualReports",
      {
        method: "indexByOwnerId",
        content: { id },
      }
    );
    if (individualReports[0]) {
      const reports = {
        generalReport: false,
        data: individualReports, // individual reports
      };
      setData({ ...data, reports });
      navigate("/VisualizarRelatorios");
    } else {
      setDialogAlertNoReports(true);
    }
  }

  function handlePaganteEdit(paganteId) {
    setSelectedPagante({ id: paganteId });
    setDialogEditPaganteForm(true);
  }

  function handlePaganteDelete(paganteId) {
    setSelectedPagante({ id: paganteId });
    setDialogDeletePagante(true);
  }

  function hadlePaganteRegister() {
    const despesas = data.allNestedCondominio["Despesas"];
    const registerPagante = despesas.every(
      (despesa) => despesa.rateioAutomatico === true
    );
    if (registerPagante) {
      setDialogRegisterPaganteForm(true);
    } else {
      setDialogAlertDespesas(true);
    }
  }

  return (
    <div id="EscolherCondominio">
      {/* ALERTA */}
      {dialogAlertDespesas && (
        <DialogAlerta
          open={[dialogAlertDespesas, setDialogAlertDespesas]}
          content="Para cadastrar Condôminos é necessário deletar as Despesas (com rateio manual) já registradas"
        />
      )}
      {dialogAlertNoReports && (
        <DialogAlerta
          open={[dialogAlertNoReports, setDialogAlertNoReports]}
          title="Não há Relatórios para visualizar"
        />
      )}
      {dialogAlertPagante && (
        <DialogAlerta
          open={[dialogAlertPagante, setDialogAlertPagante]}
          content="Não é possível continuar sem Condôminos cadastrados no Condomínio selecionado"
        />
      )}
      {dialogAlertFracao && (
        <DialogAlerta
          open={[dialogAlertFracao, setDialogAlertFracao]}
          content="A soma das frações dos Condôminos não é '1.00000', isso quer dizer que é possível que a divisão de valores das Despesas dê erro"
        />
      )}
      {/* CONDOMINIO DIALOGS */}
      {dialogRegisterCondominioForm && (
        <DialogCondominio
          open={[dialogRegisterCondominioForm, setDialogRegisterCondominioForm]}
          delete={[dialogDeleteCondominio, setDialogDeleteCondominio]}
          beneficiario={data.beneficiario}
        />
      )}
      {dialogEditCondominioForm && (
        <DialogCondominio
          open={[dialogEditCondominioForm, setDialogEditCondominioForm]}
          delete={[dialogDeleteCondominio, setDialogDeleteCondominio]}
          beneficiario={data.beneficiario}
          condominio={data.allNestedCondominio}
        />
      )}
      {dialogDeleteCondominio && (
        <DialogExcluirCondominio
          open={[dialogDeleteCondominio, setDialogDeleteCondominio]}
          condominio={data.allNestedCondominio}
        />
      )}
      {/* PAGANTE DIALOGS */}
      {dialogRegisterPaganteForm && (
        <DialogPagante
          open={[dialogRegisterPaganteForm, setDialogRegisterPaganteForm]}
          delete={[dialogDeletePagante, setDialogDeletePagante]}
          condominio={selectedCondominio}
        />
      )}
      {dialogEditPaganteForm && (
        <DialogPagante
          open={[dialogEditPaganteForm, setDialogEditPaganteForm]}
          delete={[dialogDeletePagante, setDialogDeletePagante]}
          condominio={selectedCondominio}
          pagante={data.allNestedCondominio["Pagantes"].find(
            (pagante) => pagante.id === selectedPagante.id
          )}
        />
      )}
      {dialogDeletePagante && (
        <DialogExcluirPagante
          open={[dialogDeletePagante, setDialogDeletePagante]}
          pagante={data.allNestedCondominio["Pagantes"].find(
            (pagante) => pagante.id === selectedPagante.id
          )}
        />
      )}

      <h1 className="PageTitle">Selecione o Condomínio</h1>

      <Container maxWidth="xl">
        {/*CADA CONDOMINIO*/}
        {typeof data.allNestedBeneficiario["Condominios"] !== "undefined" &&
          data.allNestedBeneficiario["Condominios"].map((condominio) => (
            <Accordion
              elevation={condominio.id === selectedCondominio.id ? 10 : 3}
              key={condominio.id}
              expanded={expanded === condominio.id}
              onChange={handleCondominioClick(condominio.id)}
            >
              <AccordionSummary expandIcon={"+"}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <p>
                          <HomeWork className="Ajusted Ajusted2" />
                          <span className="Name">{condominio.nome}</span>
                        </p>
                      </TableCell>
                      {condominio.id === selectedCondominio.id && (
                        <>
                          <TableCell
                            align="center"
                            className="ReportButtonCell ButtonCell"
                          >
                            <p
                              className="ReportIcon"
                              onClick={handleCondominioReport}
                            >
                              <Assessment className="Ajusted" /> Relatórios
                            </p>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="EditButtonCell ButtonCell"
                          >
                            <p
                              className="EditIcon"
                              onClick={handleCondominioEdit}
                            >
                              <Create className="Ajusted" /> Editar
                            </p>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="DeleteButtonCell ButtonCell"
                          >
                            <p
                              className="DeleteIcon"
                              onClick={handleCondominioDelete}
                            >
                              <Delete className="Ajusted" /> Deletar
                            </p>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionSummary>
              <AccordionDetails>
                {/* TODOS OS PAGANTES */}
                <Table className="BottomTable" size="small">
                  <TableBody>
                    {condominio["Pagantes"].map((pagante) => (
                      <TableRow key={"user_row" + pagante.id}>
                        <TableCell className="FirstCell">
                          <p>
                            <People className="Ajusted" /> {pagante.complemento}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p>{pagante.box}</p>
                        </TableCell>
                        <TableCell>
                          <p>{pagante.nome}</p>
                        </TableCell>
                        <TableCell
                          align="center"
                          className="ReportButtonCell ButtonCell"
                        >
                          <p
                            className="ReportIcon"
                            onClick={() => handlePaganteReport(pagante.id)}
                          >
                            <Assessment className="Ajusted" /> Relatórios
                          </p>
                        </TableCell>
                        <TableCell
                          align="center"
                          className="EditButtonCell ButtonCell"
                        >
                          <p
                            className="EditIcon"
                            onClick={() => handlePaganteEdit(pagante.id)}
                          >
                            <Create className="Ajusted" /> Editar
                          </p>
                        </TableCell>
                        <TableCell
                          align="center"
                          className="DeleteButtonCell ButtonCell LastCell"
                        >
                          <p
                            className="DeleteIcon"
                            onClick={() => handlePaganteDelete(pagante.id)}
                          >
                            <Delete className="Ajusted" /> Deletar
                          </p>
                        </TableCell>
                        <TableCell className="FixAlignCell"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>

              {/* BOTÃO DE ADICIONAR CONDÔMINO */}
              <Button
                className="MarginButton1"
                onClick={hadlePaganteRegister}
                variant="outlined"
                color="primary"
              >
                <People className="Ajusted2" /> Incluir Condômino
              </Button>
            </Accordion>
          ))}

        {/* BOTÃO DE ADICIONAR CONDOMÍNIO */}
        <Button
          className="MarginButton2"
          onClick={hadleCondominioRegister}
          variant="outlined"
          color="primary"
        >
          <HomeWork className="Ajusted2" /> Incluir Condomínio
        </Button>
      </Container>

      {loading && <CircularProgress color="secondary" />}
    </div>
  );
}
