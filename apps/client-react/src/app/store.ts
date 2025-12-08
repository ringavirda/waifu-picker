import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { genshinApi, serverApi } from "./apis";

const store = configureStore({
  reducer: combineReducers({
    [genshinApi.reducerPath]: genshinApi.reducer,
    [serverApi.reducerPath]: serverApi.reducer,
  }),
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(genshinApi.middleware, serverApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAppStore() {
  return store;
}
