"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { category_list_api } from "@/utils/api_url";
import { ICategory } from "@/common_type";

const CategoryList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState([]);

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        category_list_api,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategoryList(data.data);
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

  console.log(categoryList)
  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All Category
      </h1>
      <div className="pt-5 pb-5 flex justify-between items-center">
        <Link
          href="./add-category"
          className="text-white bg-primary py-2 px-6 cursor-pointer hover:shadow hover:mr-1 duration-200 text-base rounded-md flex justify-center items-center gap-2"
        >
          <i className="fa-solid fa-plus text-base text-white"></i>
          <span className="capitalize">Add Category</span>
        </Link>
      </div>
      <div className="pt-5 py-5 px-0 relative w-full">
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full table-auto border-collapserounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Image
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Name
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Slug
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Font awsom  Class
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((item:ICategory, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="px-6 py-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-10 h-10 rounded-md"
                    />
                  </td>

                  <td className="px-6 py-4  ">
                    <span className="text-gray-800">{item.name}</span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-sm text-white rounded-md ${
                        item.status == true ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.status == true ? "Active" : "InActive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.slug}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-gray-800">{item.font_awesome_class
                    }</span>
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/category/${item.slug}`}
                      className="px-2 py-1 text-sm text-blue-500 hover:underline "
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/dashboard/category/${item.slug}`}
                      className="px-2 py-1 text-sm inline-block ml-5 text-blue-500 hover:underline"
                    >
                      Edit
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

export default CategoryList;
