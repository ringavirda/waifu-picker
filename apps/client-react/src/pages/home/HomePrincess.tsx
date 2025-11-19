import { useEffect, useState } from "react";
import "./home-princess.scss";

type PrincessBuffer = {
  blob?: Blob;
  blobUrl?: string;
};

export function HomePrincess() {
  const [princessUrl, setPrincessUrl] = useState<string>();

  const princessGenshinUrl =
    "https://genshin.jmp.blue/characters/keqing/outfit-opulent-splendor";
  const princessBuffer: PrincessBuffer = {};

  useEffect(() => {
    const fetchPrincess = async () => {
      if (princessBuffer.blobUrl !== undefined)
        setPrincessUrl(princessBuffer.blobUrl);

      let resp = await fetch(princessGenshinUrl);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);

      princessBuffer.blob = blob;
      princessBuffer.blobUrl = blobUrl;
      setPrincessUrl(blobUrl);
    };

    fetchPrincess().catch(console.error);
  }, []);

  return <img alt="Princess" className="home-princess" src={princessUrl} />;
}
