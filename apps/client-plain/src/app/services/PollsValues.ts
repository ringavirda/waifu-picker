import { injectable } from "inversify";
import { io, Socket } from "socket.io-client";
import { compare, hash } from "bcryptjs";
import {
  fetchCurrentIp,
  JsonSerialization,
  WaifuPoll,
  WaifuPollUpdateDto,
} from "@wp/common";

export type PolValueEvents = "changed" | "update";
export type PolValueEventListener = (pol: WaifuPoll) => void;

@injectable("Singleton")
export class PollValues {
  private _pols: Array<WaifuPoll> = [];

  private _ipHash: string = "";
  private _socket: Socket;

  private readonly _maxValue: number = 90;
  private readonly _minValue: number = 10;

  private _listeners: Map<PolValueEvents, Array<PolValueEventListener>> =
    new Map();

  constructor() {
    this._socket = io();
    this._socket.on("polls-update", (json: string) => {
      const polUpdate = JSON.parse(
        json,
        JsonSerialization.reviver,
      ) as WaifuPollUpdateDto;

      const index = this._pols.findIndex(
        (pol) => pol.title === polUpdate.title,
      );
      if (index !== -1) this._pols[index].options = polUpdate.options;

      this.emit("update", polUpdate);
    });
  }

  public async registerPolls(polls: Array<WaifuPoll>): Promise<void> {
    this._pols = polls;
    this._ipHash = await hash(await fetchCurrentIp(), 0);
  }

  public on(event: PolValueEvents, callback: PolValueEventListener) {
    const listeners = this._listeners.get(event);
    if (listeners === undefined) this._listeners.set(event, [callback]);
    else {
      listeners.push(callback);
      this._listeners.set(event, listeners);
    }
  }

  public emit(event: PolValueEvents, model: WaifuPollUpdateDto) {
    this._listeners.get(event)?.forEach((listener) => listener(model));
  }

  public getOptionValue(pollTitle: string, optionName: string) {
    const poll = this.getPoll(pollTitle);
    const selected = this.getOption(pollTitle, optionName);

    const options = Array.from(poll.options.values());
    const maxVotes = options
      .map((opt) => opt.length)
      .reduce((prev, curr) => Math.max(prev, curr));

    const value = Math.ceil((selected.length / maxVotes) * this._maxValue);
    return value > this._minValue ? value : this._minValue;
  }

  public incOptionValue(pollTitle: string, optionName: string): void {
    const selected = this.getOption(pollTitle, optionName);

    if (selected.includes(this._ipHash))
      throw new Error("You cannot vote twice!");

    selected.push(this._ipHash);
    this.emit("changed", this.getPoll(pollTitle));
  }

  public decOptionValue(pollTitle: string, optionName: string): void {
    const selected = this.getOption(pollTitle, optionName);

    const index = selected.findIndex((vote) => compare(vote, this._ipHash));
    selected.splice(index, 1);
    this.emit("changed", this.getPoll(pollTitle));
  }

  public isAlreadyVoted(pollTitle: string): boolean {
    const poll = this.getPoll(pollTitle);

    return Array.from(poll.options.values()).some(
      (opt) => opt.find((vote) => compare(vote, this._ipHash)) !== undefined,
    );
  }

  private getPoll(pollTitle: string): WaifuPoll {
    const poll = this._pols.find((p) => p.title === pollTitle);
    if (poll === undefined)
      throw new Error("Trying to get value from unknown poll.");
    return poll;
  }

  private getOption(pollTitle: string, optionName: string): string[] {
    const poll = this.getPoll(pollTitle);
    const option = poll.options.get(optionName);
    if (option === undefined)
      throw new Error("Trying to get value for unknown option.");
    return option;
  }
}
