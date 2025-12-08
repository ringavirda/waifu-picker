import { MouseEventHandler } from "react";

type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  type: "primary" | "secondary";
  children: React.ReactNode;
};

export function Button({ onClick, type, children }: ButtonProps) {
  const primaryStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "orange",
    color: "white",
    border: "none",
    cursor: "pointer",
  };
  const secondaryStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "orange",
    color: "white",
    border: "none",
    cursor: "pointer",
  };

  return (
    <button
      onClick={onClick}
      style={type === "primary" ? primaryStyle : secondaryStyle}
    >
      {children}
    </button>
  );
}
