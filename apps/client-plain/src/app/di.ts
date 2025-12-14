import { Container } from "inversify";

export const TYPES = {
  ICharactersApi: Symbol.for("ICharactersApi"),
};

export const container = new Container();
