import React, { useState } from "react";

// MATERIAL UI COMPONENTS
import { Fab } from "@material-ui/core";

// MATERIAL UI ICONS
import { DeleteTwoTone as Delete } from "@material-ui/icons";

// CSS
import "./style.css";

export default function FloatingActionDeleteButton() {
  const [onHover, setOnHover] = useState(false);

  const handleClick = () => {
    // TODO lógica de deletar relatórios por geração
    console.log("you just deleted everything!!");
  };

  return (
    <Fab
      id="FloatingActionDeleteButton"
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
      {onHover && <p>Deletar Relatórios</p>}
    </Fab>
  );
}
