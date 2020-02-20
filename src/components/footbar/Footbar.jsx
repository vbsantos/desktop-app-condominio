import React, { Component } from "react";
// import PropTypes from "prop-types";

export class Footbar extends Component {
  // static propTypes = {};

  getBarStyle = () => {
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
  };

  getLeftButtonStyle = () => {
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
  };

  getRightButtonStyle = () => {
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
  };

  // leftButton = () => {
  //   alert("left?");
  //   console.log("clicked left button");
  // };

  // rightButton = () => {
  //   alert("right?");
  //   console.log("clicked right button");
  // };

  render() {
    const { left, right } = this.props;
    return (
      <footer style={this.getBarStyle()} className="Footbar">
        <button style={this.getLeftButtonStyle()} onClick={left.function}>
          {left.value}
        </button>
        <button style={this.getRightButtonStyle()} onClick={right.function}>
          {right.value}
        </button>
      </footer>
    );
  }
}

export default Footbar;
