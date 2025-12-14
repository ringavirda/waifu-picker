import { StatusService, useDefaultServices } from "@wp/common";

import { container, TYPES } from "./di";
import { CharactersGenshinApi, CharactersServerApi, PollsApi } from "./api";
import { PollValues, PrincessService } from "./services";
import { Router } from "./router";

export async function useAppServices() {
  useDefaultServices(container as any);
  container.bind(Router).toSelf().inSingletonScope();

  const status = container.get(StatusService);
  status
    .isServerAlive()
    .then(() => {
      if (!container.isBound(TYPES.ICharactersApi))
        container
          .bind(TYPES.ICharactersApi)
          .to(CharactersServerApi)
          .inSingletonScope();
    })
    .catch(() => {
      if (!container.isBound(TYPES.ICharactersApi))
        container
          .bind(TYPES.ICharactersApi)
          .to(CharactersGenshinApi)
          .inSingletonScope();
    });
  container
    .bind(TYPES.ICharactersApi)
    .to(CharactersGenshinApi)
    .inSingletonScope();
  container.bind(PollsApi).toSelf().inSingletonScope();

  container.bind(PollValues).toSelf().inSingletonScope();
  container.bind(PrincessService).toSelf().inSingletonScope();
}
