import type { CSSProperties } from "react";

export function LoadingSpinner() {
  const spinnerStyle: CSSProperties = {
    width: "300px",
    height: "300px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "10px solid",
    borderRadius: "50%",
    borderColor: "orange transparent orange transparent",
    animation: "spin 2s linear infinite",
  };

  const spinnerKeyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <>
      <div style={spinnerStyle}></div>
      <style>{spinnerKeyframes}</style>
    </>
  );
}
