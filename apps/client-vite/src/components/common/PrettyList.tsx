import type { PropsWithChildren } from "react";

import styles from "./common.module.css";

export function PrettyList({ children }: PropsWithChildren) {
  return <ul className={styles["pretty-list"]}>{children}</ul>;
}

export function PrettyListItem({ children }: PropsWithChildren) {
  return <li className={styles["pretty-list-item"]}>{children}</li>;
}
