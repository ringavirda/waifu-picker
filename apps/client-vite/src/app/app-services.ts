import { Container } from "inversify";
import {
  CacheService,
  ConfigService,
  StaticConfig,
  StatusService,
  useDefaultServices,
} from "@wp/common";

import { GenshinApi, ServerApi } from "./apis";
import { PrincessService } from "./services";

export const ServiceIds = {
  ICharsApi: "ICharsApi",
} as const;

export const ConfigOptionIds = {
  princessPaths: "princessPaths",
  serverAlive: "serverAlive",
  cachePersistence: "cachePersistence",
} as const;

export function useAppServices() {
  const container = new Container();

  useDefaultServices(container);
  const status = container.get(StatusService);
  const config = container.get(ConfigService);

  container.bind(PrincessService).toSelf().inSingletonScope();
  config.setOption(ConfigOptionIds.princessPaths, [
    "keqing/outfit-opulent-splendor",
    "ningguang/outfit-orchids-evening-gown",
    "ayaka/outfit-springbloom-missive",
    "nilou/outfit-breeze-of-sabaa",
    "fischl/outfit-ein-immernachtstraum",
    "lisa/outfit-a-sobriquet-under-shade",
  ]);

  status.isServerAlive().then((alive) => {
    if (alive) {
      container
        .bind<ServerApi>(ServiceIds.ICharsApi)
        .to(ServerApi)
        .inSingletonScope();
      config.setOption(ConfigOptionIds.serverAlive, true);
    }
  });
  container
    .bind<GenshinApi>(ServiceIds.ICharsApi)
    .to(GenshinApi)
    .inSingletonScope();
  config.setOption(ConfigOptionIds.serverAlive, false);

  // Enable config options persistence
  if (StaticConfig.isOptionsPersistenceEnabled()) {
    const configService = container.get(ConfigService);
    configService.enableOptionsPersistence(window.sessionStorage);
  }
  // Enable cache persistence
  if (StaticConfig.isCachePersistenceEnabled()) {
    const cache = container.get(CacheService);
    cache.enablePersistence(window.sessionStorage);
    config.setOption(ConfigOptionIds.cachePersistence, true);
  } else {
    config.setOption(ConfigOptionIds.cachePersistence, false);
  }
  return container;
}
