import { configs } from "./configs";

export class StaticConfig {
  // Api path settings

  public static get apiPort(): number {
    return configs.apiPort;
  }

  public static get apiSecPort(): number {
    return configs.apiSecPort;
  }

  public static get apiHostname(): string {
    return configs.apiHostname;
  }

  public static get apiPrefix(): string {
    return configs.apiPrefix;
  }

  public static get genshinApiBaseUrl(): string {
    return configs.genshinApiBaseUrl;
  }

  // API route generation

  public static get apiBaseUrl(): string {
    return configs.isSecure
      ? `https://${configs.apiHostname}:${configs.apiSecPort}${configs.apiPrefix}`
      : `http://${configs.apiHostname}:${configs.apiPort}${configs.apiPrefix}`;
  }

  public static toApiRoute(path: string, params?: Record<string, any>): URL {
    const rawUrl = `${StaticConfig.apiBaseUrl}${path}`;

    const url = new URL(rawUrl);
    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });
    }
    return url;
  }

  // Enable or disable secure mode (HTTPS)

  public static isSecure(): boolean {
    return configs.isSecure;
  }

  public static setSecure(isSecure: boolean): void {
    configs.isSecure = isSecure;
  }

  // Cache settings

  public static isCacheCleanupEnabled(): boolean {
    return configs.cacheCleanupEnabled;
  }

  public static setCacheCleanup(enabled: boolean): void {
    configs.cacheCleanupEnabled = enabled;
  }

  public static get cacheTtlSeconds(): number {
    return configs.cacheTtlSeconds;
  }

  public static setCacheTtl(seconds: number): void {
    configs.cacheTtlSeconds = seconds;
  }

  public static isCachePersistenceEnabled(): boolean {
    return configs.cachePersistenceEnabled;
  }

  public static setCachePersistence(enabled: boolean): void {
    configs.cachePersistenceEnabled = enabled;
  }

  public static isOptionsPersistenceEnabled(): boolean {
    return configs.optionsPersistenceEnabled;
  }

  public static setOptionsPersistence(enabled: boolean): void {
    configs.optionsPersistenceEnabled = enabled;
  }
}
