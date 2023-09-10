import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { userSlice, settingSlice } from "../reducers";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Disbale storage
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage: storage,
};
const rootReducer = combineReducers({
  user: userSlice,
  setting: settingSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
  // process.env.NEXT_PUBLIC_NODE_ENV !== "production"
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "pro",
});
export type RootState = ReturnType<typeof store.getState>;
const persistor = persistStore(store);

export { persistor, store };
