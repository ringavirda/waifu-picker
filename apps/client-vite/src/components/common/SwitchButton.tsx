import styles from "./common.module.css";

type SwitchButtonProps = {
  textLeft: string;
  textRight: string;
  handleLeft: () => void;
  handleRight: () => void;
  activeLeft: boolean;
  activeRight: boolean;
  disabled?: boolean;
  disableLeft?: boolean;
  disableRight?: boolean;
};

export function SwitchButton({
  textLeft,
  textRight,
  handleLeft,
  handleRight,
  activeLeft,
  activeRight,
  disabled,
}: SwitchButtonProps) {
  return (
    <div
      className={`${styles["switch-button"]} ${disabled ? styles["switch-disabled"] : ""}`}
    >
      <button
        className={`${styles["inner-button"]} ${activeLeft ? styles["switch-active"] : ""} ${disabled ? styles["switch-disabled"] : ""}`}
        id="left-switch"
        onClick={handleLeft}
      >
        {textLeft}
      </button>
      <button
        className={`${styles["inner-button"]} ${activeRight ? styles["switch-active"] : ""} ${disabled ? styles["switch-disabled"] : ""}`}
        id="right-switch"
        onClick={handleRight}
      >
        {textRight}
      </button>
    </div>
  );
}
