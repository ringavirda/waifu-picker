import { inject, injectable } from "inversify";

import { StatusResponse } from "../models";
import { ConfigService } from "../services";

@injectable("Singleton")
export class StatusService {
  constructor(@inject(ConfigService) private _config: ConfigService) {}

  public async isServerAlive(): Promise<boolean> {
    const statusEndpoint = this._config.toApiRoute("/");
    const response = await fetch(statusEndpoint);
    if (response.ok) {
      const parsed = (await response.json()) as StatusResponse;
      return parsed.status === "Working";
    }
    return response.ok;
  }
}
