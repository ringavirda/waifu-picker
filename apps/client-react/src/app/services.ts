import { CharsExternalService } from "@/services";
import { useDefaultServices } from "@wp/common";
import { Container } from "inversify";

export function useAppServices() {
  const container = new Container();

  useDefaultServices(container);
  container.bind("ICharsService").to(CharsExternalService).inSingletonScope();

  return container;
}
