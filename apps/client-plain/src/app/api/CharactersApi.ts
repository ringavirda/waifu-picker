import { CacheService, Character } from "@wp/common";
import { ApiBase } from "./ApiBase";
import { inject, injectable } from "inversify";

export interface ICharactersApi {
  fetchCharacterList(): Promise<Array<string>>;
  fetchCharacter(id: string): Promise<Character>;
  fetchCharacterPortrait(
    id: string,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<string>;
  fetchCharacterCard(
    id: string,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<string>;
  fetchCharacterIcon(id: string, type?: string): Promise<string>;
}

type CharacterMedia = {
  blobUrl: string;
  blob: Blob;
};
type CharacterCacheEntry = {
  data: Character;
  media: Map<string, CharacterMedia>;
};

@injectable("Singleton")
export class CharactersServerApi extends ApiBase implements ICharactersApi {
  constructor(@inject(CacheService) private readonly _cache: CacheService) {
    super("/chars");
  }

  public async fetchCharacterList(): Promise<Array<string>> {
    const res = await fetch(this.toApiRoute(""));
    if (!res.ok) throw new Error(`Wasn't able to load waifu list! Oh, no...`);

    return await res.json();
  }

  public async fetchCharacter(id: string): Promise<Character> {
    const url = this.toApiRoute(`/${id}`);
    if (this._cache.hasKey(CharactersServerApi, id)) {
      const cached = this._cache.getValue<CharacterCacheEntry>(
        CharactersServerApi,
        id,
      );
      if (cached.data && Object.keys(cached.data).length > 0) {
        return cached.data;
      }
    }

    const res = await fetch(url);
    if (!res.ok)
      throw new Error(
        `Wasn't able to load character [${id}]. Reason: ${res.statusText}`,
      );

    return await res.json();
  }

  public async fetchCharacterPortrait(
    id: string,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<string> {
    const url = resizeHeight
      ? this.toApiRoute(
          `/${id}/portrait?height=${resizeHeight}?width=${resizeWidth}`,
        )
      : this.toApiRoute(`/${id}/portrait`);

    if (this._cache.hasKey(CharactersServerApi, id)) {
      const cached = this._cache.getValue<CharacterCacheEntry>(
        CharactersServerApi,
        id,
      );
      if (cached.media.has("portrait")) {
        const oldUrl = cached.media.get("portrait")?.blobUrl as string;
        URL.revokeObjectURL(oldUrl);
        const newUrl = URL.createObjectURL(
          cached.media.get("portrait")?.blob as Blob,
        );
        cached.media.set("portrait", {
          blobUrl: newUrl,
          blob: cached.media.get("portrait")?.blob as Blob,
        });
        return newUrl;
      }
    }
    const res = await fetch(url);
    if (!res.ok) return await this.fetchCharacterCard(id);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  public async fetchCharacterCard(
    id: string,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<string> {
    const url = resizeHeight
      ? this.toApiRoute(
          `/${id}/card?height=${resizeHeight}?width=${resizeWidth}`,
        )
      : this.toApiRoute(`/${id}/card`);

    if (this._cache.hasKey(CharactersServerApi, id)) {
      const cached = this._cache.getValue<CharacterCacheEntry>(
        CharactersServerApi,
        id,
      );
      if (cached.media.has("card")) {
        const oldUrl = cached.media.get("card")?.blobUrl as string;
        URL.revokeObjectURL(oldUrl);
        const newUrl = URL.createObjectURL(
          cached.media.get("card")?.blob as Blob,
        );
        cached.media.set("card", {
          blobUrl: newUrl,
          blob: cached.media.get("card")?.blob as Blob,
        });
        return newUrl;
      }
    }

    const res = await fetch(url);
    if (!res.ok) return await this.fetchCharacterIcon(id);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  public async fetchCharacterIcon(id: string, type?: string): Promise<string> {
    const url = type
      ? this.toApiRoute(`/${id}/icon?type=${type}`)
      : this.toApiRoute(`/${id}/icon`);

    if (this._cache.hasKey(CharactersServerApi, id)) {
      const cached = this._cache.getValue<CharacterCacheEntry>(
        CharactersServerApi,
        id,
      );
      if (cached.media.has(`icon-${type ?? "default"}`)) {
        const oldUrl = cached.media.get(`icon-${type ?? "default"}`)
          ?.blobUrl as string;
        URL.revokeObjectURL(oldUrl);
        const newUrl = URL.createObjectURL(
          cached.media.get(`icon-${type ?? "default"}`)?.blob as Blob,
        );
        cached.media.set(`icon-${type ?? "default"}`, {
          blobUrl: newUrl,
          blob: cached.media.get(`icon-${type ?? "default"}`)?.blob as Blob,
        });
        return newUrl;
      }
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Wasn't able to load icon for [${id}]`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
}

@injectable("Singleton")
export class CharactersGenshinApi implements ICharactersApi {
  private _baseApiUrl = "https://genshin.jmp.blue/characters" as const;
  private toApiRoute(route: string) {
    return `${this._baseApiUrl}/${route}`;
  }
  public async fetchCharacterList(): Promise<Array<string>> {
    const res = await fetch(this.toApiRoute(""));
    if (!res.ok) throw new Error(`Wasn't able to load waifu list! Oh, no...`);

    return await res.json();
  }

  public async fetchCharacter(id: string): Promise<Character> {
    const url = this.toApiRoute(`${id}`);

    const res = await fetch(url);
    if (!res.ok)
      throw new Error(
        `Wasn't able to load target [${id}]. Reason: ${res.statusText}`,
      );

    return await res.json();
  }

  public async fetchCharacterPortrait(
    id: string,
    // height?: number,
  ): Promise<string> {
    const portraitUrl = this.toApiRoute(`${id}/portrait`);
    const res = await fetch(portraitUrl);
    if (!res.ok) {
      return await this.fetchCharacterCard(id);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  public async fetchCharacterCard(
    id: string,
    // height?: number,
  ): Promise<string> {
    const cardUrl = this.toApiRoute(`${id}/card`);
    const res = await fetch(cardUrl);
    if (!res.ok) {
      return await this.fetchCharacterIcon(id);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  public async fetchCharacterIcon(id: string, type?: string): Promise<string> {
    let iconUrl = this.toApiRoute(`${id}/icon`);
    if (type && type !== "") iconUrl = `${iconUrl}-`;
    const res = await fetch(`${iconUrl}${type ? type : ""}`);

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
}
