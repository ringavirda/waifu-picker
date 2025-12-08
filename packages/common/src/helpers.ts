import { Container } from "inversify";
import { ConfigService, StatusService, CacheService } from "./services";
import { IpResponse } from "./models";

export class SerializationHelpers {
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

  public static parseJson<T>(json: string): T {
    return JSON.parse(json, SerializationHelpers.reviver) as T;
  }

  public static stringify(value: any): string {
    return JSON.stringify(value, SerializationHelpers.replacer);
  }
}

export function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // Equivalent to hash * 31 + char, optimized for speed in JS
    hash = (hash << 5) - hash + char;
    hash |= 0; // Constrain to 32bit integer (signed)
  }
  return hash;
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
