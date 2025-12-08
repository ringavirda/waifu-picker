import { injectable } from "inversify";

import { StatusResponse } from "../models";
import { StaticConfig } from "../static-config";

@injectable("Singleton")
export class StatusService {
  constructor() {}

  public async isServerAlive(): Promise<boolean> {
    const statusEndpoint = StaticConfig.toApiRoute("/");
    const response = await fetch(statusEndpoint);
    if (response.ok) {
      const parsed = (await response.json()) as StatusResponse;
      return parsed.status === "Working";
    }
    return response.ok;
  }
}
