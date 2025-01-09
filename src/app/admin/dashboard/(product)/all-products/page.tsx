"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import SelectInput from "@/app/admin/_admin_components/SelectInput";
import PaginationControls from "@/app/admin/_admin_components/PaginationControls";
import {productData} from "@/utils/data"
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { product_list_ } from "@/utils/api_url";
import { ICampaign } from "@/model/CampaignModel";

const ProductList = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [produt_list, setProdutList]= useState([])
  const [entries, setEntries] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 10;

  const token = useSelector((state: RootState) => state.user.token);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  
  const getBlog = async () => {
    try {
      const { data } = await axios.post(
        product_list_,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      setProdutList(data.data);
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
    getBlog();
  }, []);



  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Products
      </h1>
      <div className="pt-5 pb-5 flex justify-between items-center">
        <div className="flex gap-5 ">
          <SelectInput
            id="month-select"
            options={months}
            defaultValue="Select Month"
            onChange={(value) => setSelectedMonth(value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-[200px] py-1 px-2.5"
          />
          <div className="min-w-[250px] relative">
            <input
              type="text"
              id="search"
              className="w-full text-base py-1 pl-3 pr-10 rounded-full text-gray-500 outline-none focus:ring-0 border-2 border-gray-200 focus:border-gray-300 duration-100"
              placeholder="Search Product"
            />
            <button className="absolute right-4 top-2.5 justify-center flex items-center">
              <i className="fa-solid fa-magnifying-glass text-base text-text-gray-500"></i>
            </button>
          </div>
          <div className="flex justify-center items-center gap-3 ">
            <div className="flex items-center">
              <label
                htmlFor="date_from"
                className="text-sm font-normal text-gray-400 mr-2 inline-block"
              >
                From:
              </label>
              <input
                type="date"
                id="date_from"
                name="date_from"
                className="w-full px-2 py-0.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="date_to"
                className="text-sm font-normal text-gray-400 mr-2 inline-block"
              >
                To:
              </label>
              <input
                type="date"
                id="date_to"
                name="date_to"
                className="w-full px-2 py-0.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
          </div>
        </div>
        <Link href='./add-product' className="text-white bg-primary py-2 px-6 cursor-pointer hover:shadow hover:mr-1 duration-200 text-base rounded-md flex justify-center items-center gap-2">
          <i className="fa-solid fa-plus text-base text-white"></i>
          <span className="capitalize">Add Product</span>
        </Link>
      </div>
      <div className="pt-5 py-5 px-0 relative w-full">
        <div className="overflow-x-auto pb-4">
          <table className="min-w-full table-auto border-collapserounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Brand
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Banner
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Price
                </th>
               
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {produt_list.map((product:ICampaign,i) => (
                <tr className="bg-white hover:bg-gray-100" key={i}>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={product.img[0]}
                      alt={product.title}
                      className="w-10 h-10 rounded-md"
                    />
                    <span className="text-gray-800 line-clamp-2">{product.title}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 ">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-sm text-white rounded-md ${
                        product.active == true
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {product.active ? "Active":"Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-sm rounded-md ${
                        product.banner === true
                          ? "bg-yellow-300"
                          : "bg-gray-300"
                      }`}
                    >
                      {product.banner ? "Yes": "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.price}</td>
            
                  <td className="px-6 py-4">
                    <Link href={`/admin/dashboard/product/${product.slug}`} className="px-2 py-1 text-sm text-white bg-gray-500 rounded-md">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </div>
    </>
  );
};

export default ProductList;
