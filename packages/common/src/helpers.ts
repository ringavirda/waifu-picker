import { Container } from "inversify";
import { ConfigService, StatusService, CacheService } from "./services";
import { IpResponse } from "./models";

export class MapSerializationFixes {
  public static replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: [...value],
      };
    }
    return value;
  }

  public static reviver(key: any, value: any): any {
    if (typeof value === "object" && value !== null) {
      if (value.dataType === "Map") {
        return new Map(value.value);
      }
    }
    return value;
  }
}

export async function fetchCurrentIp(): Promise<string> {
  const res = await fetch("https://ipinfo.io/json");
  return ((await res.json()) as IpResponse).ip;
}

export function useDefaultServices(container: Container): Container {
  container.bind(ConfigService).toSelf().inSingletonScope();
  container.bind(StatusService).toSelf().inSingletonScope();
  container.bind(CacheService).toSelf().inSingletonScope();
  return container;
}
