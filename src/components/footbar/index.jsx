import React from "react";

import "./style.css";

export default function footbar(props) {
  const { left, right } = props;

  function getBarStyle() {
    return {
      height: "45px", // Altura da Footbar
      padding: "5px 0px",
      backgroundColor: "#245",
      display: "flex",
      justifyContent: "space-between",
      position: "fixed",
      width: "100%",
      bottom: "0"
    };
  }

  function getLeftButtonStyle() {
    return {
      borderRadius: "3px",
      width: "90px",
      padding: "5px",
      backgroundColor: "#924",
      // shadow: "21px 21px black",
      border: "0",
      color: "#111",
      cursor: "pointer",
      marginLeft: "10px"
    };
  }

  function getRightButtonStyle() {
    return {
      borderRadius: "3px",
      width: "90px",
      padding: "5px",
      backgroundColor: "#593",
      // shadow: "21px 21px black",
      border: "0",
      color: "#111",
      cursor: "pointer",
      marginRight: "10px"
    };
  }

  return (
    <footer style={getBarStyle()} className="Footbar">
      <button style={getLeftButtonStyle()} onClick={left.function}>
        {left.value}
      </button>
      <button style={getRightButtonStyle()} onClick={right.function}>
        {right.value}
      </button>
    </footer>
  );
}
