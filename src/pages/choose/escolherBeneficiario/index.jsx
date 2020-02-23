import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MATERIAL UI COMPONENTS
import { FormControl, NativeSelect } from "@material-ui/core";

// CSS
import "./style.css";

export default function EscolherBeneficiario(props) {
  const [footbar, setFootbar] = props.buttons;
  const [data, setData] = props.data;
  const navigate = useNavigate();
  // Lista de Beneficiários
  const [list, setList] = useState([]);
  // ID do Beneficiário escolhido
  const [selected, setSelected] = useState({ id: -1 });

  console.log("Entrou em EscolherBeneficiário: ", footbar);

  useEffect(() => {
    async function getBeneficiarios() {
      console.time("getBeneficiarios");
      const beneficiarios = await window.ipcRenderer.invoke("beneficiarios", {
        method: "index",
        content: null
      });
      setList([...beneficiarios]);
      console.timeEnd("getBeneficiarios");
      return beneficiarios.length > 0 ? true : false;
    }
    getBeneficiarios();
    setFootbar({
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "SAIR"
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: "CADASTRAR"
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: false,
          value: "CONTINUAR"
        }
      ],
      action: -1
    });
    return () => console.log("EscolherBeneficiário - Encerrou");
  }, []);

  useEffect(() => {
    switch (footbar.action) {
      case 0:
        console.log("EscolherBeneficiario - Botão da esquerda");
        setFootbar({ ...footbar, action: -1 });
        window.close(); // sai do sistema
        break;
      case 1:
        console.log("EscolherBeneficiario - Botão do centro");
        setFootbar({ ...footbar, action: -1 });
        navigate("/screen-2"); // vai pra tela de cadastro
        break;
      case 2:
        console.log("EscolherBeneficiario - Botão da direita");
        setData({
          ...data,
          beneficiario: list.filter(a => a.id === selected.id)[0]
        });
        setFootbar({
          ...footbar,
          action: -1
        });
        navigate("/screen-3"); // vai pra tela de condominios
        break;
    }
  }, [footbar.action]);

  useEffect(() => {
    console.log("Beneficiário selecionado:", selected);
    setFootbar({
      ...footbar,
      buttons: [
        {
          id: 0,
          position: "left",
          visible: true,
          enabled: true,
          value: "SAIR"
        },
        {
          id: 1,
          position: "center",
          visible: true,
          enabled: true,
          value: "CADASTRAR"
        },
        {
          id: 2,
          position: "right",
          visible: true,
          enabled: selected.id !== -1,
          value: "CONTINUAR"
        }
      ]
    });
  }, [selected.id]);

  function beneficiarioSelected(id) {
    setSelected({ id: Number(id) });
  }

  return (
    <div id="EscolherBeneficiario">
      <h1 className="PageTitle">Selecione o Beneficiário</h1>
      <div className="DropdownInput">
        <FormControl>
          <NativeSelect onChange={e => beneficiarioSelected(e.target.value)}>
            <option key={-1} value={-1}>
              {""}
            </option>
            {list.map(beneficiario => (
              <option key={beneficiario.id} value={beneficiario.id}>
                {beneficiario.nome}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </div>
    </div>
  );
}
