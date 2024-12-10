"use client";

import { RootState } from "@/redux-store/redux_store";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { notFound } from "next/navigation";

interface AdminProviderProps {
  children: ReactNode;
}

const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const user_data = useSelector((state: RootState) => state.user.user);

  if (user_data?.role !== "admin") {
    return notFound();
  }

  return <>{children}</>;
};

export default AdminProvider;
