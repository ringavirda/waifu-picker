import { io } from "socket.io-client";
import {
  MapSerializationFixes,
  WaifuPol,
  WaifuPolUpdateDto,
  StaticConfig,
} from "@wp/common";

export class PolsApi {
  private readonly _baseApiUrl =
    `http://${StaticConfig.commonHostname}:${StaticConfig.commonPort}/api/pols` as const;
  private readonly _socket = io();

  public async fetchAllPols(): Promise<Array<WaifuPol>> {
    const res = await fetch(this._baseApiUrl);
    if (!res.ok) throw new Error("Failed to load pols list!");
    const json = await res.text();
    return JSON.parse(json, MapSerializationFixes.reviver);
  }

  public async fetchCreatePol(_newPolModel: WaifuPol) {
    const json = JSON.stringify(_newPolModel, MapSerializationFixes.replacer);
    const res = await fetch(this._baseApiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: json,
    });

    if (!res.ok) throw new Error(await res.text());
  }

  public async fetchRemovePol(pol: WaifuPol) {
    const res = await fetch(this._baseApiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "delete",
      body: JSON.stringify({
        title: pol.title,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
  }

  public async fetchUpdatePol(pol: WaifuPol) {
    const updateDto = {
      title: pol.title,
      options: pol.options,
    } as WaifuPolUpdateDto;
    const json = JSON.stringify(updateDto, MapSerializationFixes.replacer);
    this._socket.emit("pols-change", json);

    const res = await fetch(this._baseApiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "put",
      body: json,
    });

    if (!res.ok) throw new Error(await res.text());
  }
}
