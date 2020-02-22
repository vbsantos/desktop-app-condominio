import React from "react";

import "./style.css";

export default function footbar(props) {
  const [footbar, setFootbar] = props.buttons;

  function buttonClicked(id) {
    setFootbar({ ...footbar, action: id });
  }

  return (
    <footer className="Footbar">
      {footbar.buttons
        .filter(button => button.visible)
        .map(btn => (
          <button
            key={btn.id}
            id={btn.position}
            disabled={!btn.enabled}
            onClick={() => buttonClicked(btn.id)}
          >
            {btn.value}
          </button>
        ))}
    </footer>
  );
}
