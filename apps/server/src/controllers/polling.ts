import {
  controller,
  ControllerBase,
  route,
  validateBody,
} from "@wp/controllers";
import { Request, Response } from "express";
import { PollingRepository } from "../services/polsRepo";
import { MapSerializationFixes, WaifuPol } from "@wp/common";

@controller("/api/pols")
export class PollingController extends ControllerBase {
  constructor(private readonly _repo: PollingRepository) {
    super();
  }

  @route("get", "/")
  public async getAllPols(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const json = JSON.stringify(
      await this._repo.loadPols(),
      MapSerializationFixes.replacer,
    );
    return this.ok(res, json);
  }

  @route("post", "/")
  public async createNewPol(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const pol = validateBody<WaifuPol>(req.body, WaifuPol, ["description"]);
    await this._repo.createPol(pol);
    return this.ok(res);
  }

  @route("put", "/")
  public async updatePol(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const pol = validateBody(req.body, WaifuPol, ["description"]);
    await this._repo.updatePolVotes(pol.title, pol.options);
    return this.ok(res);
  }

  @route("delete", "/")
  public async deletePol(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const pol = validateBody(req.body, WaifuPol, ["description", "options"]);
    await this._repo.removePol(pol.title);
    return this.ok(res);
  }
}
