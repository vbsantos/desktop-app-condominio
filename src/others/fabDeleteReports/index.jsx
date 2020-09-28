import React, { useState } from "react";

// MATERIAL UI COMPONENTS
import { Fab } from "@material-ui/core";

// MATERIAL UI ICONS
import { DeleteTwoTone as Delete } from "@material-ui/icons";

// CSS
import "./style.css";

// DIALOGS
import DeletaRelatorios from "../../dialogs/deletarRelatorios";

export default function FloatingActionDeleteButton(props) {
  const { geracaoId } = props;
  const [data, setData] = props.data;
  const [value, setValue] = props.tabs;
  const [onHover, setOnHover] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const handleClick = async () => {
    setConfirmation(true);
    setOnHover(false);
  };

  return confirmation ? (
    <DeletaRelatorios
      geracaoId={geracaoId}
      open={[confirmation, setConfirmation]}
      tabs={[value, setValue]}
      data={[data, setData]}
    />
  ) : (
    <Fab
      id="FloatingActionDeleteButton"
      className={onHover ? "hover" : ""}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      onClick={handleClick}
      color="secondary"
      aria-label="delete"
      variant="extended"
    >
      <Delete
        className={onHover ? "Ajusted" : ""}
        fontSize={onHover ? "default" : "large"}
      />
      {onHover ? <p>Deletar Relatórios</p> : ""}
    </Fab>
  );
}
