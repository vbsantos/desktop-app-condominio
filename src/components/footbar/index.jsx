import React from "react";

// MATERIAL UI COMPONENTS
import { Button } from "@material-ui/core";

// CSS
import "./style.css";

export default function footbar(props) {
  const [footbar, setFootbar] = props.buttons;

  function buttonClicked(id) {
    setFootbar({ ...footbar, action: id });
  }

  return (
    <footer className="footbar">
      {footbar.buttons
        .filter(button => button.visible)
        .map(btn => (
          <Button
            variant="contained"
            color={btn.position === "left" ? "secondary" : "primary"}
            key={btn.id}
            id={btn.position}
            disabled={!btn.enabled}
            onClick={() => buttonClicked(btn.id)}
          >
            {btn.value}
          </Button>
        ))}
    </footer>
  );
}
