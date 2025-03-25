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
  const [userData, setUserData] = useState({
    details: {},
    order: [],
    user_upi:[],
    user_claim_form:[],
    user_withdrawal_request:[]
  });

  const getUserDetails = async () => {
    try {
      const { data } = await axios.post(
        users_details_admin,
        { email: urlslug },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("User Details:", data.data);

      setUserData({ details: data.data.details, 
        order: data.data.order, 
        user_upi: data.data.user_upi, 
        user_claim_form: data.data.user_claim_form, 
        user_withdrawal_request: data.data.user_withdrawal_request });
       
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Error fetching user details"
        );
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!userData.details || Object.keys(userData.details).length === 0) {
    return <p className="text-center text-gray-500">Loading user details...</p>;
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Profile ({urlslug})
      </h3>

      <h5 className="text-xl font-semibold text-gray-500 mb-2">Basic Info</h5>
      <div className="max-w-5xl overflow-auto">
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              {Object.keys(userData.details)
                .slice(1)
                .map(
                  (
                    key // Skipping 0th key
                  ) => (
                    <th
                      key={key}
                      className="px-4 py-2 font-semibold text-gray-700 text-left"
                    >
                      {key}
                    </th>
                  )
                )}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(userData.details)
                .slice(1)
                .map(
                  (
                    value,
                    index // Skipping 0th value
                  ) => (
                    <td
                      key={index}
                      className="px-4 py-2 text-nowrap text-gray-600"
                    >
                      {String(value)}
                    </td>
                  )
                )}
            </tr>
          </tbody>
        </table>
      </div>

      <h5 className="text-xl font-semibold text-gray-500 mb-2 mt-8">
        Address Info
      </h5>
      <div className="max-w-5xl overflow-auto">
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              {Object.keys(userData.details?.address).map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 font-semibold text-gray-700 text-left"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(userData.details?.address)
              .map(
                (
                  value,
                  index 
                ) => (
                  <td
                    key={index}
                    className="px-4 py-2 text-nowrap text-gray-600"
                  >
                    {String(value)}
                  </td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProfile;
