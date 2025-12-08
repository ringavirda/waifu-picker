import { useParams } from "react-router";

export function CharsDetailsPage() {
  const charId = useParams().charId;
  return <div>This is the chars details page for charId: {charId}</div>;
}
