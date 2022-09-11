import React from "react";

export default function Timer({ time }) {
  return (
    <div>
      <span>
        {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}
        <span style={{ color: "#eab464" }}>:</span>
      </span>
      <span>
        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}
        <span style={{ color: "#eab464" }}>:</span>
      </span>
      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
    </div>
  );
}
