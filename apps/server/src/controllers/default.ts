import { Request, Response } from "express";
import { container } from "tsyringe";

import { controller, ControllerBase, route } from "@wp/controllers";
import { GenshinApi } from "../services/genshinApi";
import { ImageProcessor } from "../services/imageProcessor";

@controller("/api")
export class DefaultController extends ControllerBase {
  constructor(private readonly _api: GenshinApi) {
    super();
  }

  @route("get", "/")
  public getHealth(
    req: Request,
    res: Response,
    // next: NextFunction
  ) {
    return this.ok(res, { status: "Working" });
  }

  @route("get", "/princess")
  public async getKeqingOpulent(
    req: Request,
    res: Response,
    // next: NextFunction
  ) {
    const blob = await this._api.fetchCharacterMedia(
      "outfit-opulent-splendor",
      "keqing",
    );
    const optimizer = new ImageProcessor();
    const optimized = await optimizer.blobToBuffer(blob);

    return this.ok(res, optimized, "image/png");
  }

  public static async preloadPrincess() {
    const api = container.resolve(GenshinApi);
    await api.fetchCharacterMedia("outfit-opulent-splendor", "keqing");
  }
}
