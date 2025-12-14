export abstract class ApiBase {
  protected _controllerRoute: string;

  constructor(controllerRoute: string) {
    this._controllerRoute = controllerRoute;
  }

  protected get baseApiUrl(): string {
    return process.env.API_URL as string;
  }

  protected toApiRoute(endpoint: string): string {
    return `${this.baseApiUrl}${this._controllerRoute}${endpoint}`;
  }
}
