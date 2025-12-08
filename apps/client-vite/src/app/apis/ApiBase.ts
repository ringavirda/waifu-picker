export abstract class ApiBase<TApi> {
  private readonly _baseUrl: string;
  private readonly _api: TApi;

  constructor(baseUrl: string, api: TApi) {
    this._baseUrl = baseUrl;
    this._api = api;
  }

  public getFullUrl(endpoint: string): string {
    return `${this._baseUrl}/${endpoint}`;
  }

  public get endpoints() {
    return this._api;
  }
}
