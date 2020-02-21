import React from "react";

import "./style.css";
import FormBeneficiario from "../../../forms/beneficiario";

export default function RegistrarBeneficiario() {
  return (
    <div className="registrarBeneficiario">
      <div className="Screen">
        <FormBeneficiario />
      </div>
    </div>
  );
}
