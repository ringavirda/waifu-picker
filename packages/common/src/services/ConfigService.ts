import { injectable } from "inversify";

import { StaticConfig } from "../configs";

@injectable("Singleton")
export class ConfigService {
  private _config = StaticConfig;

  get port(): number {
    return this._config.commonPort;
  }

  get secPort(): number {
    return this._config.commonSecPort;
  }

  get hostname(): string {
    return this._config.commonHostname;
  }

  get cacheTtlSeconds(): number {
    return this._config.cacheTtlSeconds;
  }

  public isSecure(): boolean {
    return this._config.isSecure;
  }

  public setSecure(isSecure: boolean): void {
    this._config.isSecure = isSecure;
  }

  public isCacheCleanupEnabled(): boolean {
    return this._config.cacheCleanupEnabled;
  }

  public setCacheCleanup(enabled: boolean): void {
    this._config.cacheCleanupEnabled = enabled;
  }

  public setCacheTtl(seconds: number): void {
    this._config.cacheTtlSeconds = seconds;
  }

  public toApiRoute(path: string, params?: Record<string, any>): URL {
    const rawUrl = this._config.isSecure
      ? `https://${this.hostname}:${this.secPort}${this._config.serverRoutesPrefix}/${path}`
      : `http://${this.hostname}:${this.port}${this._config.serverRoutesPrefix}/${path}`;

    const url = new URL(rawUrl);
    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });
    }
    return url;
  }
}
