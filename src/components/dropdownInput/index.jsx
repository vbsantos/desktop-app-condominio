import React from "react";

import "./style.css";

export default function dropdownInput(props) {
  const { options } = props;
  const [selected, setSelected] = props.selected;

  function adminSelected(id) {
    console.log(selected);
    setSelected({ id });
  }

  return (
    <div className="DropdownInput">
      <select onChange={e => adminSelected(e.target.value)}>
        <option key={-1} value={-1}>
          {""}
        </option>
        {options.map(administrador => (
          <option key={administrador.id} value={administrador.id}>
            {administrador.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
