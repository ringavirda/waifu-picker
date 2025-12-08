import type { PropsWithChildren } from "react";

import styles from "./common.module.css";

export function PrimaryCard({ children }: PropsWithChildren) {
  return <div className={styles["primary-card"]}>{children}</div>;
}
