export class WaifuPol {
  public title: string = "";
  public description?: string;
  public options: Map<string, Array<string>> = new Map();
}

export type WaifuPolUpdateDto = {
  title: string;
  options: Map<string, Array<string>>;
};
