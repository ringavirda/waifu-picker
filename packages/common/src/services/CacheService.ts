import { injectable, Newable } from "inversify";
import { StaticConfig } from "../static-config";
import { hashString, SerializationHelpers } from "../helpers";

type Cacheable = Newable;

type CacheItem<T> = {
  value: T;
  created: number;
};

type CacheLine<T> = Map<string, CacheItem<T>>;
type CacheIds = Map<string, string>;

type Cache = {
  cacheLines: Map<string, CacheLine<any>>;
  cacheIds: CacheIds;
};

@injectable("Singleton")
export class CacheService {
  private _cache: Cache = {
    cacheLines: new Map<string, Map<string, CacheItem<any>>>(),
    cacheIds: new Map<string, string>(),
  };

  private _cacheContainer?: Record<string, any> | null = null;

  private get _cacheIds() {
    return this._cache.cacheIds;
  }
  private get _cacheLines() {
    return this._cache.cacheLines;
  }

  private _cleanupInterval: NodeJS.Timeout | null = null;
  private readonly _cachePersistenceKey = "WPCache";

  constructor() {
    if (StaticConfig.isCacheCleanupEnabled()) this.startCleanup();
  }

  public hasKey(id: Cacheable, key: string): boolean {
    const cacheId = this.getCacheId(id);

    const line = this._cache.cacheLines.get(cacheId) as CacheLine<any>;
    return line.has(key);
  }

  public getValue<T>(id: Cacheable, key: string): T {
    const cacheId = this.getCacheId(id);
    this.keyExists(cacheId, key);

    const line = this._cache.cacheLines.get(cacheId) as CacheLine<T>;
    return line.get(key)?.value as T;
  }

  public setValue<T>(id: Cacheable, key: string, value: T): void {
    const cacheId = this.getCacheId(id);

    const line = this._cacheLines.get(cacheId) as CacheLine<T>;
    line.set(key, { value, created: Date.now() });
    this.setCacheLine(cacheId, line);
  }

  public reduceValue<T>(
    id: Cacheable,
    key: string,
    reducer: (current: T | undefined) => T,
  ): void {
    const cacheId = this.getCacheId(id);
    this.keyExists(cacheId, key);

    const line = this._cacheLines.get(cacheId) as CacheLine<T>;
    const current = line.get(key);
    const reduced = reducer(current?.value);
    line.set(key, { value: reduced, created: Date.now() });
    this.setCacheLine<T>(cacheId, line);
  }

  public deleteValue(id: Cacheable, key: string): void {
    const cacheId = this.getCacheId(id);
    this.keyExists(cacheId, key);

    const line = this._cacheLines.get(cacheId);
    if (!line) throw new Error(`Cache line "${cacheId}" does not exist.`);
    line.delete(key);
    this.setCacheLine(cacheId, line);
  }

  public clearCache(id: Cacheable): void {
    const cacheId = this.getCacheId(id);

    this._cacheLines.delete(cacheId);
    this._cacheIds.delete(id.name.toLowerCase());
    if (this._cacheContainer) {
      this._cacheContainer[this._cachePersistenceKey] =
        SerializationHelpers.stringify(this._cache);
    }
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
        StaticConfig.cacheTtlSeconds * 1000,
      );
    }
  }

  public enablePersistence(container: Record<string, any>): void {
    if (container[this._cachePersistenceKey]) {
      this._cache = SerializationHelpers.parseJson(
        container[this._cachePersistenceKey],
      );
    } else {
      container[this._cachePersistenceKey] = SerializationHelpers.stringify(
        this._cache,
      );
    }

    this._cacheContainer = container;
    StaticConfig.setCachePersistence(true);
  }

  public disablePersistence(): void {
    if (this._cacheContainer) {
      delete this._cacheContainer[this._cachePersistenceKey];
    }
    this._cacheContainer = null;
    StaticConfig.setCachePersistence(false);
  }

  private getCacheId(cacheable: Cacheable): string {
    const cacheableName = cacheable.name.toLowerCase();
    let cacheId = this._cacheIds.get(cacheableName);
    if (cacheId) return cacheId;

    cacheId = hashString(cacheableName).toString();
    this._cacheIds.set(cacheableName, cacheId);
    this._cacheLines.set(cacheId, new Map<string, CacheItem<any>>());
    return cacheId;
  }

  private keyExists(cacheId: string, key: string): void {
    const entry = this._cacheLines.get(cacheId);
    if (!entry?.has(key)) {
      throw new Error(
        `Cache key "${key}" does not exist in cache "${cacheId}".`,
      );
    }
  }

  private setCacheLine<T>(cacheId: string, line: CacheLine<T>) {
    this._cacheLines.set(cacheId, line);
    if (this._cacheContainer) {
      this._cacheContainer[this._cachePersistenceKey] =
        SerializationHelpers.stringify(this._cache);
    }
  }

  private removeExpiredItems(): void {
    const now = Date.now();
    const ttl = StaticConfig.cacheTtlSeconds * 1000;
    for (const [cacheId, entry] of this._cacheLines.entries()) {
      for (const [key, item] of entry.entries()) {
        if (now - item.created > ttl) {
          entry.delete(key);
        }
      }
      if (entry.size === 0) {
        this._cacheLines.delete(cacheId);
        this._cacheIds.forEach((value, key) => {
          if (value === cacheId) {
            this._cacheIds.delete(key);
          }
        });
      } else this._cacheLines.set(cacheId, entry);
    }
  }
}
