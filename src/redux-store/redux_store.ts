"use client";

import userSlice from './slice/userSlice'
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import editorReducer from './slice/editorSlice'

import wishlistReduce from './slice/wishlistSlice'

const store_ = configureStore({
  reducer: {
    user: userSlice,
    editor: editorReducer,
    wishlist: wishlistReduce,
  },
});



export type RootState = ReturnType<typeof store_.getState>
export type AppDispatch = typeof store_.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>() 
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector 


export default store_
