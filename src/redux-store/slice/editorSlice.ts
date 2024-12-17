"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
  content: string; 
}


const initialState: EditorState = {
  content: "", 
};


const EditorSlice = createSlice({
  name: "editor", 
  initialState,   
  reducers: {
   
    setEditorData: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },

   
    clearEditorData: (state) => {
      state.content = ""; 
    },
  },
});


export const { setEditorData, clearEditorData } = EditorSlice.actions;


export default EditorSlice.reducer;
