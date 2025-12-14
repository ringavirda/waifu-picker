import { CacheService, StatusService } from "@wp/common";
import { inject, injectable } from "inversify";

const PRINCESS_CACHE_KEY = "princess-image-url" as const;

type PrincessCacheEntry = {
  blobUrl: string;
  blobBase64: string;
};

@injectable("Singleton")
export class PrincessService {
  constructor(
    @inject(CacheService) private readonly _cache: CacheService,
    @inject(StatusService) private readonly _status: StatusService,
  ) {}

  async getPrincessImageUrl(): Promise<string> {
    if (this._cache.hasKey(PrincessService, PRINCESS_CACHE_KEY)) {
      const cachedEntry = this._cache.getValue<PrincessCacheEntry>(
        PrincessService,
        PRINCESS_CACHE_KEY,
      )!;
      const blob = this._base64ToBlob(cachedEntry.blobBase64);
      URL.revokeObjectURL(cachedEntry.blobUrl);
      const blobUrl = URL.createObjectURL(blob);
      this._cache.setValue<PrincessCacheEntry>(
        PrincessService,
        PRINCESS_CACHE_KEY,
        {
          blobUrl: blobUrl,
          blobBase64: cachedEntry.blobBase64,
        },
      );
      return blobUrl;
    }

    const princessApiUrl = (await this._status.isServerAlive())
      ? `${process.env.API_URL}/princess`
      : "https://genshin.jmp.blue/characters/keqing/outfit-opulent-splendor";
    const response = await fetch(princessApiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch princess image!");
    }
    const blob = await response.blob();
    const blobBase64 = await this._blobToBase64(blob);
    const blobUrl = URL.createObjectURL(blob);
    this._cache.setValue<PrincessCacheEntry>(
      PrincessService,
      PRINCESS_CACHE_KEY,
      {
        blobUrl: blobUrl,
        blobBase64: blobBase64,
      },
    );
    return blobUrl;
  }

  private _base64ToBlob(base64: string): Blob {
    const dataUrlMatch = base64.match(/^data:(.+);base64,(.*)$/);
    let contentType = "";
    let b64Data = base64;

    if (dataUrlMatch) {
      contentType = dataUrlMatch[1];
      b64Data = dataUrlMatch[2];
    }

    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  private _blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
