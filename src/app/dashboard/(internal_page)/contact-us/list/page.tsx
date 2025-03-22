"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { contact_us_list_api } from "@/utils/api_url";

import { IContactUs } from "@/model/ContactUsModel";

const ContactUsList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [userList, setUserList] = useState([]);

  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    startDate: "",
    endDate: "",
    phone_number:"",
    action_status:""
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      // console.log("Updated Filters:", updatedFilters); // Debugging
      return updatedFilters;
    });
  };

  const getList = async () => {
    try {
      const { data } = await axios.post(
        contact_us_list_api,
        {filters},
        {
          headers: {
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
    getList();
  }, []);

  const create_date = (item: string) => {
    const date = new Date(item);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Contact Us Data
      </h1>

      <button
        className="border p-2 rounded-md h-9 text-sm outline-none text-blue-300"
        type="button"
        onClick={() => setShowFilter(!showFilter)}
      >
        {showFilter ? "Hide Filter" : "Show Filter"}
      </button>

      {showFilter && (
        <div className="flex mt-3 flex-wrap gap-4 p-4 bg-gray-100 rounded-md">
          <input
            type="text"
            name="name"
            placeholder=" name"
            value={filters.name}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
           <input
            type="text"
            name="email"
            placeholder="email"
            value={filters.email}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

<input
            type="text"
            name="phone_number"
            placeholder="phone_number"
            value={filters.phone_number}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <select
            name="action_status"
            value={filters.action_status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>Category status</option>
            <option value="NOTSTART">NOTSTART</option>
            <option value="CLOSED">CLOSED</option>
            <option value="OPEN">OPEN</option>
            <option value="REMOVED">REMOVED</option>
          </select>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <button
            onClick={getList}
            className="border p-2 rounded-md h-9 text-sm outline-none text-white bg-primary"
          >
            Apply Filters
          </button>
        </div>
      )}

      <div className="pt-5 py-5 px-0 relative w-full">
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full table-auto border-collapserounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  S.NO
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Name
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Subject
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Address
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {userList.map((item: IContactUs, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{i + 1}.</span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800 text-sm">
                      {create_date(item.createdAt)} {}
                    </span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.name}</span>
                  </td>

                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.email}</span>
                  </td>

                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.phone_number}</span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.subject}</span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.location}</span>
                  </td>
                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.message}</span>
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

export default ContactUsList;
