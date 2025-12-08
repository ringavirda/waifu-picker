import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { StaticConfig, type Character } from "@wp/common";
import { injectable } from "inversify";
import { ApiBase } from "./ApiBase";

const baseApiUrl = `${StaticConfig.genshinApiBaseUrl}` as const;

export const genshinApi = createApi({
  reducerPath: "genshinApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseApiUrl }),
  endpoints: (builder) => ({
    getCharacters: builder.query<string[], void>({
      query: () => "characters",
    }),
    getCharacterById: builder.query<Character, string>({
      query: (id) => `characters/${id}`,
    }),
  }),
});

@injectable("Singleton")
export class GenshinApi extends ApiBase<typeof genshinApi> {
  constructor() {
    super(baseApiUrl, genshinApi);
  }
}
