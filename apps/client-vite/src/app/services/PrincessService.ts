import { CacheService, ConfigService, StaticConfig } from "@wp/common";
import { injectable } from "inversify";
import { BehaviorSubject, Observable } from "rxjs";
import { ConfigOptionIds } from "../app-services";

export type PrincessImage = {
  id?: string;
  url?: string;
  blob?: string;
  isLoading?: boolean;
  error?: string;
};

@injectable("Singleton")
export class PrincessService {
  private _config: ConfigService;
  private _cache: CacheService;

  private readonly _baseUrl = `${StaticConfig.genshinApiBaseUrl}/characters`;

  private readonly _princess$ = new BehaviorSubject<PrincessImage>({
    isLoading: true,
  });
  private readonly _princessCache = "princess-image";

  constructor(config: ConfigService, cache: CacheService) {
    this._config = config;
    this._cache = cache;
  }

  public fetchPrincessImage(princessPath: string): Observable<PrincessImage> {
    const princessCacheKey = `${this._princessCache}-${princessPath}`;
    // Cache check
    if (this._cache.hasKey(PrincessService, princessCacheKey)) {
      const cachedPrincess = this._cache.getValue<PrincessImage>(
        PrincessService,
        princessCacheKey,
      )!;
      const blob: Blob = this.base64ToBlob(cachedPrincess.blob!);
      const objectUrl = URL.createObjectURL(blob);
      URL.revokeObjectURL(cachedPrincess.url!);
      cachedPrincess.url = objectUrl;

      this._cache.setValue<PrincessImage>(
        PrincessService,
        princessCacheKey,
        cachedPrincess,
      );

      this._princess$.next({ url: cachedPrincess.url, isLoading: false });
      return this._princess$.asObservable();
    }

    // Fetch if not in cache
    this._princess$.next({ isLoading: true });
    fetch(`${this._baseUrl}/${princessPath}`)
      .then(async (res) => {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const princessImage: PrincessImage = {
          id: princessPath.split("/")[0],
          url: objectUrl,
          blob: await this.blobToBase64(blob),
          isLoading: false,
        };
        // Cache the fetched princess image
        this._cache.setValue<PrincessImage>(
          PrincessService,
          princessCacheKey,
          princessImage,
        );

        this._princess$.next(princessImage);
      })
      .catch((err) => {
        this._princess$.next({
          url: "",
          isLoading: false,
          error: `Error fetching princess image: ${err.message}`,
        });
      });
    return this._princess$.asObservable();
  }

  public getRandomPrincessPath(): string {
    const princessPaths = this._config.getOption<string[]>(
      ConfigOptionIds.princessPaths,
    )!;
    const randomIndex = Math.floor(Math.random() * princessPaths.length);
    return princessPaths[randomIndex];
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
}
