"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { all_users } from "@/utils/api_url";
import { IUser } from "@/model/UserModel";


const AllUser = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [userList, setUserList] = useState([]);

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        all_users,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserList(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getCategory();
  }, []);


  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Users
      </h1>
     
      <div className="pt-5 py-5 px-0 relative w-full">
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full table-auto border-collapserounded-lg">
            <thead className="bg-gray-200">
              <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Profile
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Name
                </th>
              
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                Email Verify
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                 Phone
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                Role
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userList.map((item:IUser, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                 <td className="px-6 py-4">
                    <img
                      src={item.profile}
                      alt={item.name}
                      className="w-10 h-10 rounded-md"
                    />
                  </td>
                   <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.name}</span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.email}</span>
                  </td>
                  <td className="px-6 py-4  ">
                  {item.email_verified ? <span className="text-green-800">Yes</span>:<span className="text-red-800">No</span>}
                    
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.phone}</span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.role}</span>
                  </td>

      
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/dashboard/user/${item.email}`}
                      className="px-2 py-1 text-sm text-blue-500 hover:underline "
                    >
                      View
                    </Link>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllUser;
