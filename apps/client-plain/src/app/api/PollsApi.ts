import { io } from "socket.io-client";
import { JsonSerialization, WaifuPoll, WaifuPollUpdateDto } from "@wp/common";
import { ApiBase } from "./ApiBase";

export class PollsApi extends ApiBase {
  private readonly _socket = io(process.env.API_URL ?? "http://localhost:5000");

  constructor() {
    super("/polls");
  }

  public async fetchAllPolls(): Promise<Array<WaifuPoll>> {
    const url = this.toApiRoute("");
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load polls list!");
    const json = await res.text();
    return JSON.parse(json, JsonSerialization.reviver);
  }

  public async fetchCreatePoll(_newPollModel: WaifuPoll) {
    const json = JSON.stringify(_newPollModel, JsonSerialization.replacer);

    const url = this.toApiRoute("");
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: json,
    });

    if (!res.ok) throw new Error(await res.text());
  }

  public async fetchRemovePoll(poll: WaifuPoll) {
    const url = this.toApiRoute("");
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "delete",
      body: JSON.stringify({
        title: poll.title,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
  }

  public async fetchUpdatePoll(poll: WaifuPoll) {
    const updateDto = {
      title: poll.title,
      options: poll.options,
    } as WaifuPollUpdateDto;
    const json = JSON.stringify(updateDto, JsonSerialization.replacer);
    this._socket.emit("polls-change", json);

    const url = this.toApiRoute("");
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "put",
      body: json,
    });

    if (!res.ok) throw new Error(await res.text());
  }
}
