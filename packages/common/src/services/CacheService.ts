import { inject, injectable, Newable } from "inversify";
import { ConfigService } from "./ConfigService";

type CacheItem<T> = {
  value: T;
  created: number;
};

@injectable("Singleton")
export class CacheService {
  private _cache = new Map<string, Map<string, CacheItem<any>>>();
  private _ids = new Map<Newable, string>();
  private _cleanupInterval: NodeJS.Timeout | null = null;

  constructor(@inject(ConfigService) private _config: ConfigService) {
    if (this._config.isCacheCleanupEnabled()) this.startCleanup();
  }

  public hasKey(id: Newable, key: string): boolean {
    const cacheId = this.getCacheId(id);

    const entry = this._cache.get(cacheId) as Map<string, CacheItem<any>>;
    return entry.has(key);
  }

  public getValue<T>(id: Newable, key: string): T {
    const cacheId = this.getCacheId(id);

    const entry = this._cache.get(cacheId) as Map<string, CacheItem<T>>;
    return entry.get(key) as T;
  }

  public setValue<T>(id: Newable, key: string, value: T): void {
    const cacheId = this.getCacheId(id);

    const entry = this._cache.get(cacheId) as Map<string, CacheItem<T>>;
    entry.set(key, { value, created: Date.now() });
    this._cache.set(cacheId, entry);
  }

  public reduceValue<T>(
    id: Newable,
    key: string,
    reducer: (current: T | undefined) => T,
  ): void {
    const cacheId = this.getCacheId(id);

    const entry = this._cache.get(cacheId) as Map<string, CacheItem<T>>;
    const current = entry.get(key);
    const reduced = reducer(current?.value);
    entry.set(key, { value: reduced, created: Date.now() });
    this._cache.set(cacheId, entry);
  }

  public deleteValue(id: Newable, key: string): void {
    const cacheId = this.getCacheId(id);

    const entry = this._cache.get(cacheId) as Map<string, CacheItem<any>>;
    entry.delete(key);
    this._cache.set(cacheId, entry);
  }

  public clearCache(id: Newable): void {
    const cacheId = this.getCacheId(id);

    this._cache.delete(cacheId);
    this._ids.delete(id);
  }

  public stopCleanup(): void {
    if (this._cleanupInterval) {
      clearInterval(this._cleanupInterval);
      this._cleanupInterval = null;
    }
  }
  public startCleanup(): void {
    if (!this._cleanupInterval) {
      this._cleanupInterval = setInterval(
        () => this.removeExpiredItems(),
        this._config.cacheTtlSeconds * 1000,
      );
    }
  }

  private getCacheId(cacheable: Newable): string {
    let cacheId = this._ids.get(cacheable);
    if (cacheId) return cacheId;

    cacheId = crypto.randomUUID();
    this._ids.set(cacheable, cacheId);
    this._cache.set(cacheId, new Map<string, CacheItem<any>>());
    return cacheId;
  }

  private removeExpiredItems(): void {
    const now = Date.now();
    const ttl = this._config.cacheTtlSeconds * 1000;
    for (const [cacheId, entry] of this._cache.entries()) {
      for (const [key, item] of entry.entries()) {
        if (now - item.created > ttl) {
          entry.delete(key);
        }
      }
      if (entry.size === 0) {
        this._cache.delete(cacheId);
        this._ids.forEach((value, key) => {
          if (value === cacheId) {
            this._ids.delete(key);
          }
        });
      } else this._cache.set(cacheId, entry);
    }
  }
}
