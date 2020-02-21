import React from "react";

import "./style.css";

export default function dropdownInput(props) {
  const { options } = props;
  return (
    <div className="DropdownInput">
      <select
        onChange={e =>
          console.log(`Trocou o Administrador [id=${e.target.value}]`)
        }
      >
        {options.map(administrador => (
          <option key={administrador.id} value={administrador.id}>
            {administrador.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
