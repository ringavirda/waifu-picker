export function ErrorCard({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "1rem",
        margin: "2rem",
        padding: "1rem",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Something went horribly wrong!
      </div>
      <div
        style={{
          fontSize: "1rem",
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        {message}
      </div>
    </div>
  );
}
