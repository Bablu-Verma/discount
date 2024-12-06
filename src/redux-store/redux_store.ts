"use client";

import userSlice from './slice/userSlice'
import { configureStore } from "@reduxjs/toolkit";


const redux_store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof redux_store.getState>;
export type AppDispatch = typeof redux_store.dispatch;
export default redux_store

