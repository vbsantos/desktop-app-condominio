import React, { Component } from "react";
// import PropTypes from "prop-types";

export class DropdownInput extends Component {
  // static propTypes = {};

  render() {
    const { options } = this.props;
    // console.log("DropdownInput - options:", options);
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
}

export default DropdownInput;
