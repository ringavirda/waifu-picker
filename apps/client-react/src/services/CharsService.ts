import { injectable } from "inversify";

import { Character, StaticConfig } from "@wp/common";

export interface ICharsService {
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

interface CharsCacheEntry {
  character: Character;
  mediaUrls: Map<string, string>;
}

@injectable()
export class CharsService implements ICharsService {
  private _baseApiUrl =
    `http://${StaticConfig.commonHostname}:${StaticConfig.commonPort}/api/chars` as const;
  private _charsCache: Map<string, CharsCacheEntry> = new Map();

  public async fetchCharacterList(): Promise<Array<string>> {
    const res = await fetch(this._baseApiUrl);
    if (!res.ok) throw new Error(`Wasn't able to load waifu list! Oh, no...`);

    return await res.json();
  }

  public async fetchCharacter(id: string): Promise<Character> {
    if (this._charsCache.has(id))
      return this._charsCache.get(id)?.character as Character;

    const res = await fetch(`${this._baseApiUrl}/${id}`);
    if (!res.ok)
      throw new Error(
        `Wasn't able to load character [${id}]. Reason: ${res.statusText}`,
      );

    const char = await res.json();
    this._charsCache.set(id, {
      character: char,
      mediaUrls: new Map(),
    });

    return char;
  }

  public async fetchCharacterPortrait(
    id: string,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<string> {
    if (this._charsCache.get(id)?.mediaUrls.has("portrait")) {
      const cached = this._charsCache.get(id)?.mediaUrls;
      return cached?.get("portrait") as string;
    }
    const fetchUrl = resizeHeight
      ? `${this._baseApiUrl}/${id}/portrait?height=${resizeHeight}?width=${resizeWidth}`
      : `${this._baseApiUrl}/${id}/portrait`;

    const res = await fetch(fetchUrl);
    if (!res.ok) return await this.fetchCharacterCard(id);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    if (this._charsCache.get(id)) {
      const cached = this._charsCache.get(id)?.mediaUrls;
      cached?.set("portrait", blobUrl);
    } else {
      const char = await this.fetchCharacter(id);
      this._charsCache.set(id, {
        character: char,
        mediaUrls: new Map([["portrait", blobUrl]]),
      });
    }
    return blobUrl;
  }

  public async fetchCharacterCard(
    id: string,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<string> {
    if (this._charsCache.get(id)?.mediaUrls.has("portrait")) {
      const cached = this._charsCache.get(id)?.mediaUrls;
      return cached?.get("card") as string;
    }
    const fetchUrl = resizeHeight
      ? `${this._baseApiUrl}/${id}/card?height=${resizeHeight}?width=${resizeWidth}`
      : `${this._baseApiUrl}/${id}/card`;
    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`Failed to fetch media for target [${id}].`);

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    if (this._charsCache.get(id)) {
      const cached = this._charsCache.get(id)?.mediaUrls;
      cached?.set("card", blobUrl);
    } else {
      const char = await this.fetchCharacter(id);
      this._charsCache.set(id, {
        character: char,
        mediaUrls: new Map([["card", blobUrl]]),
      });
    }

    return blobUrl;
  }

  public async fetchCharacterIcon(id: string, type?: string): Promise<string> {
    const iconType = type !== "" ? `icon?type=${type}` : "icon";

    if (this._charsCache.get(id)?.mediaUrls.has(iconType)) {
      const cached = this._charsCache.get(id)?.mediaUrls;
      return cached?.get(iconType) as string;
    }
    const res = await fetch(`${this._baseApiUrl}/${id}/${iconType}`);
    if (!res.ok)
      throw new Error(
        `Failed to fetch icon of type (${iconType}) for target ${id}`,
      );

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    if (this._charsCache.get(id)) {
      const cached = this._charsCache.get(id)?.mediaUrls;
      cached?.set(iconType, blobUrl);
    } else {
      const char = await this.fetchCharacter(id);
      this._charsCache.set(id, {
        character: char,
        mediaUrls: new Map([[iconType, blobUrl]]),
      });
    }

    return blobUrl;
  }
}

@injectable()
export class CharsExternalService implements ICharsService {
  private _baseApiUrl: string = "https://genshin.jmp.blue/characters" as const;

  private _waifuCashe: Map<string, [Character | null, string, Blob]> =
    new Map();

  public async fetchCharacterList(): Promise<Array<string>> {
    const res = await fetch(`${this._baseApiUrl}`);
    if (!res.ok) throw new Error(`Wasn't able to load waifu list! Oh, no...`);

    return res.json();
  }

  public async fetchCharacter(id: string): Promise<Character> {
    if (this._waifuCashe.has(id))
      return this._waifuCashe.get(id)?.[0] as Character;

    const res = await fetch(`${this._baseApiUrl}/${id}`);
    if (!res.ok)
      throw new Error(
        `Wasn't able to load target [${id}]. Reason: ${res.statusText}`,
      );

    const char = (await res.json()) as Character;
    const cashed = this._waifuCashe.get(id);
    if (cashed != undefined)
      this._waifuCashe.set(id, [char, cashed?.[1], cashed?.[2]]);

    return char;
  }

  public async fetchCharacterPortrait(
    id: string,
    // height?: number,
  ): Promise<string> {
    const portraitUrl = `${this._baseApiUrl}/${id}/portrait`;
    const res = await fetch(portraitUrl);
    if (!res.ok) {
      return await this.fetchCharacterCard(id);
    }

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    this._waifuCashe.set(id, [null, blobUrl, blob]);

    return blobUrl;
  }

  public async fetchCharacterIcon(id: string, type?: string): Promise<string> {
    let iconUrl = `${this._baseApiUrl}/${id}/icon`;
    if (type && type !== "") iconUrl = `${iconUrl}-`;
    const res = await fetch(`${iconUrl}${type ? type : ""}`);

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    this._waifuCashe.set(id, [null, blobUrl, blob]);

    return blobUrl;
  }

  public async fetchCharacterCard(
    id: string,
    // resizeHeight?: number
  ): Promise<string> {
    const cardUrl = `${this._baseApiUrl}/${id}/card`;
    const res = await fetch(cardUrl);
    if (!res.ok) throw new Error(`Failed to load card for target [${id}].`);

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    this._waifuCashe.set(id, [null, blobUrl, blob]);

    return blobUrl;
  }
}
