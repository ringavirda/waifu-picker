import { injectable } from "inversify";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { StaticConfig, type Character } from "@wp/common";

import { ApiBase } from "./ApiBase";

export const serverApi = createApi({
  reducerPath: "serverApi",
  baseQuery: fetchBaseQuery({ baseUrl: StaticConfig.apiBaseUrl }),
  endpoints: (builder) => ({
    getCharacters: builder.query<string[], void>({
      query: () => "chars",
    }),
    getCharacterById: builder.query<Character, string>({
      query: (id) => `chars/${id}`,
    }),
  }),
});

@injectable("Singleton")
export class ServerApi extends ApiBase<typeof serverApi> {
  constructor() {
    super(StaticConfig.apiBaseUrl, serverApi);
  }
}
