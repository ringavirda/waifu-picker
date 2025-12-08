export class WaifuPoll {
  public title: string = "";
  public description?: string;
  public options: Map<string, Array<string>> = new Map();
}

export type WaifuPollUpdateDto = {
  title: string;
  options: Map<string, Array<string>>;
};
