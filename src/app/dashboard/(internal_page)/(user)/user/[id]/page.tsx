"use client";

import { RootState } from "@/redux-store/redux_store";
import { users_details_admin } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const AdminProfile = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const urlslug = pathname.split("/").pop() || "";
  const [userData, setUserData] = useState(null);

  const getUserDetails = async () => {
    try {
      const { data } = await axios.post(
        users_details_admin,
        { email: urlslug },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(data);


      setUserData(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!userData) {
    return <p className="text-center text-gray-500">Loading user details...</p>;
  
  }

console.log(userData)


  return (
    <div className=" p-6 ">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Profile ({urlslug})</h3>
      <table className="w-full border border-gray-300 rounded-md overflow-hidden">
        <tbody>
          
        </tbody>
      </table>
    </div>
  );
};

export default AdminProfile;
