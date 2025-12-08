import { access, constants, mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { singleton } from "tsyringe";

import { JsonSerialization, WaifuPoll } from "@wp/common";
import { BadRequestError, logger } from "@wp/controllers";

@singleton()
export class PollingRepository {
  private readonly _fileName = "pols.json";
  private readonly _dirName = "data";
  private readonly _path = join(__dirname, this._dirName, this._fileName);

  private _pollsCashe: Array<WaifuPoll> = [];

  public async loadPolls(): Promise<Array<WaifuPoll>> {
    try {
      await access(this._path, constants.F_OK);
      const data = await readFile(this._path);
      const pols = JSON.parse(
        data.toString(),
        JsonSerialization.reviver,
      ) as Array<WaifuPoll>;
      this._pollsCashe = pols;
      return pols;
    } catch (err: unknown) {
      logger.warn(
        "Service",
        `Polls loading failed due to: ${(err as Error).message}. Reinitializing poll's repository file.`,
      );
      await this.writeCache();
      return this._pollsCashe;
    }
  }

  public async createPoll(pol: WaifuPoll): Promise<void> {
    if (this._pollsCashe.find((p) => p.title === pol.title))
      throw new BadRequestError("Trying to create a poll that already exists.");

    this._pollsCashe.push(pol);
    await this.writeCache();
  }

  public async updatePollVotes(
    polTitle: string,
    newVotes: Map<string, Array<string>>,
  ): Promise<void> {
    const possibleCached = this._pollsCashe.find((p) => p.title === polTitle);
    if (possibleCached !== undefined) {
      possibleCached.options = newVotes;
    } else {
      throw new BadRequestError("Trying to update poll that doesn't exist.");
    }

    await this.writeCache();
  }

  public async removePoll(polTitle: string): Promise<void> {
    if (!this._pollsCashe.find((p) => p.title === polTitle))
      throw new BadRequestError("Trying to remove a poll that doesn't exist.");
    const index = this._pollsCashe.findIndex((p) => p.title === polTitle)!;
    this._pollsCashe.splice(index, 1);

    await this.writeCache();
  }

  private async writeCache() {
    const dirPath = join(__dirname, this._dirName);
    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath);
    }
    await writeFile(
      this._path,
      JSON.stringify(this._pollsCashe, JsonSerialization.replacer),
    );
  }
}
