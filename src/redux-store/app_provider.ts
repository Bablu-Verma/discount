"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux"; 
import redux_store from "./redux_store";

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={redux_store}>{children}</Provider>; 
};

export default ReduxProvider;
