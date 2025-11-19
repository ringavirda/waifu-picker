import { memo, useEffect, useState } from "react";

import { CacheService, ConfigService } from "@wp/common";
import { useService } from "@/services";

import "./home-princess.scss";

type PrincessBuffer = {
  blob?: Blob;
  blobUrl?: string;
};

function HomePrincess(props: { server: boolean }) {
  const config = useService(ConfigService);
  const cache = useService(CacheService);

  const [princess, setPrincess] = useState<string>();

  const princessGenshinUrl =
    "https://genshin.jmp.blue/characters/keqing/outfit-opulent-splendor";
  const cacheKey = "home-princess-image";

  const fetchPrincess = async () => {
    if (cache.hasKey(CacheService, cacheKey)) {
      const cached = cache.getValue<PrincessBuffer>(CacheService, cacheKey);
      return cached.blobUrl;
    } else {
      const response: Response = props.server
        ? await fetch(config.toApiRoute("/princess"))
        : await fetch(princessGenshinUrl);

      if (!response.ok)
        throw new Error(
          `Failed to fetch princess image: ${response.status} ${response.statusText}`,
        );

      const blob = await response.blob();
      const buffer: PrincessBuffer = {
        blob,
        blobUrl: URL.createObjectURL(blob),
      };

      cache.setValue<PrincessBuffer>(CacheService, cacheKey, buffer);
      return buffer.blobUrl;
    }
  };

  useEffect(() => {
    fetchPrincess().then(setPrincess).catch(console.error);
  }, []);

  return (
    <img
      alt="Princess"
      className="home-princess"
      loading="lazy"
      src={princess}
    />
  );
}

export default memo(HomePrincess);
