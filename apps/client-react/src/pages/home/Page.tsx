import { use } from "react";
import { CacheService, ConfigService, StatusService } from "@wp/common";

import { HomeCard } from "@/pages/home";
import { useService } from "@/app";
import { Image } from "@/components";

type PrincessBuffer = {
  blob?: Blob;
  blobUrl?: string;
};

const cacheKey = "home-princess-image";
const princessGenshinUrl =
  "https://genshin.jmp.blue/characters/keqing/outfit-opulent-splendor";

const fetchPrincess = async (
  cache: CacheService,
  status: StatusService,
  config: ConfigService,
) => {
  if (cache.hasKey(CacheService, cacheKey)) {
    const cached = cache.getValue<PrincessBuffer>(CacheService, cacheKey);
    return cached.blobUrl!;
  } else {
    const response: Response = (await status.isServerAlive())
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
    return buffer.blobUrl!;
  }
};

export function HomePage() {
  const status = useService(StatusService);
  const config = useService(ConfigService);
  const cache = useService(CacheService);

  return (
    <>
      {/* <HomeCard /> */}
      <Image
        srcPromise={fetchPrincess(cache, status, config)}
        alt={"She is our Princess!"}
      />
      ;
    </>
  );
}
