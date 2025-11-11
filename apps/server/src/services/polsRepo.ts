import { access, constants, mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { singleton } from "tsyringe";

import { MapSerializationFixes, WaifuPol } from "@wp/common";
import { BadRequestError, logger } from "@wp/controllers";

@singleton()
export class PollingRepository {
  private readonly _fileName = "pols.json";
  private readonly _dirName = "data";
  private readonly _path = join(__dirname, this._dirName, this._fileName);

  private _polsCashe: Array<WaifuPol> = [];

  public async loadPols(): Promise<Array<WaifuPol>> {
    try {
      await access(this._path, constants.F_OK);
      const data = await readFile(this._path);
      const pols = JSON.parse(
        data.toString(),
        MapSerializationFixes.reviver,
      ) as Array<WaifuPol>;
      this._polsCashe = pols;
      return pols;
    } catch (err: unknown) {
      logger.warn(
        "Service",
        `Pols loading failed due to: ${(err as Error).message}. Reinitializing pol's repository file.`,
      );
      await this.writeCache();
      return this._polsCashe;
    }
  }

  public async createPol(pol: WaifuPol): Promise<void> {
    if (this._polsCashe.find((p) => p.title === pol.title))
      throw new BadRequestError("Trying to create a pol that already exists.");

    this._polsCashe.push(pol);
    await this.writeCache();
  }

  public async updatePolVotes(
    polTitle: string,
    newVotes: Map<string, Array<string>>,
  ): Promise<void> {
    const possibleCached = this._polsCashe.find((p) => p.title === polTitle);
    if (possibleCached !== undefined) {
      possibleCached.options = newVotes;
    } else {
      throw new BadRequestError("Trying to update pol that doesn't exist.");
    }

    await this.writeCache();
  }

  public async removePol(polTitle: string): Promise<void> {
    if (!this._polsCashe.find((p) => p.title === polTitle))
      throw new BadRequestError("Trying to remove a pol that doesn't exist.");
    const index = this._polsCashe.findIndex((p) => p.title === polTitle)!;
    this._polsCashe.splice(index, 1);

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
      JSON.stringify(this._polsCashe, MapSerializationFixes.replacer),
    );
  }
}
