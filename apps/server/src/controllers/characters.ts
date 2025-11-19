import { Request, Response } from "express";
import { container } from "tsyringe";

import { controller, ControllerBase, logger, route } from "@wp/controllers";
import { GenshinApi } from "../services/genshinApi";
import { ImageProcessor } from "../services/imageProcessor";

@controller("/api/chars")
export class CharactersController extends ControllerBase {
  constructor(
    private readonly _api: GenshinApi,
    private readonly _imageOptimizer: ImageProcessor,
  ) {
    super();
  }

  @route("get", "/")
  public async getCharacterList(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    return this.ok(res, await this._api.fetchCharacterList());
  }

  @route("get", "/:id")
  public async getCharacterInfo(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    return this.ok(res, await this._api.fetchCharacter(req.params.id));
  }

  @route("get", "/:id/portrait")
  public async getCharacterPortrait(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const blob = await this._api.fetchCharacterPortrait(req.params.id);

    const resizeHeight = parseInt(req.query.height as string);
    const resizeWidth = parseInt(req.query.width as string);
    const optimized = await this._imageOptimizer.processBlob(
      blob,
      isNaN(resizeHeight) ? undefined : resizeHeight,
      isNaN(resizeWidth) ? undefined : resizeWidth,
    );

    return this.ok(res, optimized, "image/jpeg");
  }

  @route("get", "/:id/card")
  public async getCharacterCard(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const blob = await this._api.fetchCharacterCard(req.params.id);

    const resizeHeight = parseInt(req.query.height as string);
    const resizeWidth = parseInt(req.query.width as string);
    const optimized = await this._imageOptimizer.processBlob(
      blob,
      isNaN(resizeHeight) ? undefined : resizeHeight,
      isNaN(resizeWidth) ? undefined : resizeWidth,
    );

    return this.ok(res, optimized, "image/jpeg");
  }

  @route("get", "/:id/icon")
  public async getCharacterIcon(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    let iconType = req.query.type;
    if (iconType === undefined) iconType = "";

    const blob = await this._api.fetchCharacterIcon(
      req.params.id,
      iconType as string,
    );
    const icon = await this._imageOptimizer.processBlob(blob);

    return this.ok(res, icon, "image/jpeg");
  }

  public static async preloadAndPreprocessMedia() {
    const api = container.resolve(GenshinApi);
    const waifus = await api.fetchCharacterList();
    const blobs: Array<Blob> = [];
    await Promise.all(
      waifus.map(async (waifu) => {
        try {
          blobs.push(await api.fetchCharacterPortrait(waifu));
        } catch {
          try {
            blobs.push(await api.fetchCharacterCard(waifu));
          } catch {
            logger.warn(
              "Server",
              `Did not resolve character [${waifu}] while preloading media.`,
            );
          }
        }
      }),
    );
    logger.info(
      "Server",
      `Finished preloading [${waifus.length}] character media.`,
    );

    const optimizer = new ImageProcessor();
    await Promise.all(
      blobs.map(async (blob) => {
        optimizer.processBlob(blob);
      }),
    );
    logger.info(
      "Server",
      `Finished preprocessing [${blobs.length}] character media.`,
    );
  }
}
