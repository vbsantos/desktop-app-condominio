import React, { useRef } from "react";

// MATERIAL UI COMPONENTS
import {
  DialogContentText,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Grid,
  TextField,
} from "@material-ui/core";

// CSS
import "./style.css";

export default function FormPagante(props) {
  // true when all the fields of the form are filled
  const [formCompleted, setFormCompleted] = props.completed;

  // store all current values of the form fields
  const [pagante, setPagante] = props.pagante;

  // pagante must belong to a condominio
  const { condominio } = props;

  // form reference
  const formRef = useRef(null);

  // FIXME muito estranho quando pressiona uma tecla ao digitar no formulário
  function formOnChange() {
    const formList = [...formRef.current.elements];
    atualizaPagante(formList);
    verificaFormulario(formList);
  }

  const atualizaPagante = (inputs) => {
    setPagante({
      id: pagante.id,
      nome: inputs[0].value,
      email: inputs[1].value,
      telefone: inputs[2].value,
      complemento: inputs[3].value,
      fracao: inputs[4].value.replace(",", "."),
      box: inputs[5].value,
      leituraAgua: inputs[6].value.replace(",", "."),
      unidadeComercial: inputs[7].checked,
      carros: inputs[8].value,
      animais: inputs[9].value,
      condominioId: condominio.id,
    });
  };

  const verificaFormulario = (inputs) => {
    const nome = inputs[0].value;
    const complemento = inputs[3].value;
    const fracao = inputs[4].value.replace(",", ".");
    const leituraAgua = inputs[6].value.replace(",", ".");
    const isFormCompleted =
      nome !== "" &&
      complemento !== "" &&
      fracao !== "" &&
      leituraAgua !== "" &&
      Number(fracao) > 0 &&
      Number(fracao) <= 1 &&
      Number(leituraAgua) >= 0;
    setFormCompleted(isFormCompleted);
  };

  const getRows = (string, minimo_de_linhas) => {
    if (!string) return minimo_de_linhas;
    const quantidade_de_linhas = string.split("\n").length;
    return Math.max(minimo_de_linhas, quantidade_de_linhas);
  };

  return (
    <form ref={formRef} onChange={formOnChange}>
      <section>
        <DialogContentText color="inherit">
          Informações do Condômino
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="nome">Nome *</InputLabel>
          <Input
            title="Nome do atual morador do Apartamento"
            autoFocus
            defaultValue={pagante.nome}
            id="nome"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="email">E-mail</InputLabel>
          <Input
            title="E-mail do atual morador do Apartamento"
            defaultValue={pagante.email}
            id="email"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="telefone">Telefone</InputLabel>
          <Input
            title="Telefone do atual morador do Apartamento"
            defaultValue={pagante.telefone}
            id="telefone"
          ></Input>
        </FormControl>
      </section>

      <section>
        <DialogContentText color="inherit">
          Informações do Apartamento
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="complemento">Número do apartamento *</InputLabel>
          <Input
            title="Número identificador do Apartamento"
            defaultValue={pagante.complemento}
            id="complemento"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="fracao">Fração *</InputLabel>
          <Input
            title="Entre 0 e 1"
            defaultValue={pagante.fracao}
            id="fracao"
          ></Input>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="box">Box</InputLabel>
          <Input
            title="Box que pertencem ao apartamento"
            defaultValue={pagante.box}
            id="box"
          ></Input>
        </FormControl>
      </section>

      <section>
        <DialogContentText color="inherit">
          Última Leitura de água
        </DialogContentText>
        <FormControl>
          <InputLabel htmlFor="leituraAgua">Leitura da Água *</InputLabel>
          <Input
            title="Valor no medidor de água (m³)"
            defaultValue={pagante.leituraAgua}
            id="leituraAgua"
          ></Input>
        </FormControl>
      </section>

      <section>
        <DialogContentText color="inherit">Tipo de Unidade</DialogContentText>
        <FormGroup>
          <Typography component="div">
            <Grid container justify="center" alignItems="center" spacing={1}>
              <Grid item xs>
                Residencial
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  style={{ marginRight: "-10px" }}
                  control={
                    <Switch
                      value="cb1"
                      checked={pagante.unidadeComercial}
                      color="primary"
                    />
                  }
                />
              </Grid>
              <Grid item xs>
                Comercial
              </Grid>
            </Grid>
          </Typography>
        </FormGroup>
      </section>

      <section>
        <DialogContentText color="inherit">
          Informações Extras
        </DialogContentText>

        <FormControl>
          <TextField
            className="text-informacoes"
            label="Veículos"
            multiline
            rows={getRows(pagante.carros, 1)}
            defaultValue={pagante.carros}
          />
        </FormControl>

        <FormControl>
          <TextField
            className="text-informacoes"
            label="Animais de estimação"
            multiline
            rows={getRows(pagante.animais, 1)}
            defaultValue={pagante.animais}
          />
        </FormControl>
      </section>

      {/* FEEDBACK */}
      {!formCompleted && (
        <DialogContent>
          {pagante.id === ""
            ? "É necessário preencher os campos obrigatórios (*) para incluir"
            : "É necessário modificar algum campo para salvar"}
        </DialogContent>
      )}
    </form>
  );
}
