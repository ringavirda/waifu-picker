import {
  controller,
  ControllerBase,
  route,
  validateBody,
} from "@wp/controllers";
import { Request, Response } from "express";
import { PollingRepository } from "../services/pollsRepo";
import { JsonSerialization, WaifuPoll } from "@wp/common";

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
      await this._repo.loadPolls(),
      JsonSerialization.replacer,
    );
    return this.ok(res, json);
  }

  @route("post", "/")
  public async createNewPol(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const poll = validateBody<WaifuPoll>(req.body, WaifuPoll, ["description"]);
    await this._repo.createPoll(poll);
    return this.ok(res);
  }

  @route("put", "/")
  public async updatePol(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const poll = validateBody(req.body, WaifuPoll, ["description"]);
    await this._repo.updatePollVotes(poll.title, poll.options);
    return this.ok(res);
  }

  @route("delete", "/")
  public async deletePol(
    req: Request,
    res: Response,
    // next: NextFunction,
  ) {
    const poll = validateBody(req.body, WaifuPoll, ["description", "options"]);
    await this._repo.removePoll(poll.title);
    return this.ok(res);
  }
}
