import styles from "./common.module.css";

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className={styles["error-card"]}>
      <div className="mb-4 text-3xl font-bold">
        Something went horribly wrong!
      </div>
      <div className="rounded-lg bg-white p-4 text-base">{message}</div>
    </div>
  );
}
