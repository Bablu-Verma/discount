"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import {
  category_list_api,
  list_store_api,
  order_list_api,
  product_list_,
} from "@/utils/api_url";
import { ICategory } from "@/common_type";
import { IRecord } from "@/model/CashbackOrderModel";

const OrderList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [OrderList, setOrderList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [productList, setProductList] = useState<
    { title: string; _id: string }[]
  >([]);
  const [storeList, setStoreList] = useState<{ name: string; _id: string }[]>(
    []
  );
  const [filters, setFilters] = useState({
    order_status: "", // [ "ALL","Redirected", "Order", "Completed", "Cancelled"]
    payment_status: "", // ["ALL","Pending", "confirm", "Paid", "Failed"]
    user_id: "",
    user_email: "",
    product_id: "",
    store_id: "",
    transaction_id: "",
    startDate: "",
    endDate: "",
  });

  const getOrders = async () => {
    try {
      const { data } = await axios.post(order_list_api, filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderList(data.data);
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
    getOrders();
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, productRes] = await Promise.all([
          axios.post(
            list_store_api,
            { store_status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(
            product_list_,
            {product_status:"ALL"},
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setStoreList(storeRes.data.data || []);
        setProductList(productRes.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    if (showFilter) {
      fetchData();
    }
  }, [token, showFilter]);

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        All Order
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
            name="transaction_id"
            placeholder="transaction_id"
            value={filters.transaction_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
        
          <select
            name="product_id"
            value={filters.product_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm max-w-[250px] outline-none "
          >
            <option disabled>product_id</option>

            {productList.map((product: { title: string; _id: string }) => (
              <option key={product._id} value={product._id}>
                {product.title}
              </option>
            ))}
          </select>

          <select
            name="store_id"
            value={filters.store_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>store_id</option>

            {storeList.map((product: { name: string; _id: string }) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="user_id"
            placeholder="user_id"
            value={filters.user_id}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />
          <input
            type="text"
            name="user_email"
            placeholder="user_email"
            value={filters.user_email}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          />

          <select
            name="order_status"
            value={filters.order_status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>order_status</option>
            <option value="ALL">ALL</option>
            <option value="Redirected">Redirected</option>
            <option value="Order">Order</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            name="payment_status"
            value={filters.payment_status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>payment_status</option>
            <option value="ALL">ALL</option>
            <option value="Pending">Pending</option>
            <option value="confirm">confirm</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            name="payment_status"
            value={filters.payment_status}
            onChange={handleFilterChange}
            className="border p-2 rounded-md h-9 text-sm outline-none "
          >
            <option disabled>payment_status</option>
            <option value="ALL">ALL</option>
            <option value="Pending">Pending</option>
            <option value="confirm">confirm</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
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
            onClick={getOrders}
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
                transaction_id
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                calculated_cashback
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                payment_status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                order_status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-700">
                user_id
                </th>

                <th className="px-6 py-3 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {OrderList.map((item:IRecord, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                

                  <td className="px-6 py-4  ">
                    {item.transaction_id}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {item.calculated_cashback.toString()}
                  </td>
                  <td className="px-6 py-4">
                    {item.payment_status}
                  </td>
                  <td className="px-6 py-4">
                    {item.order_status}
                  </td>
                  <td className="px-6 py-4">
                    {item.user_id.toString()}
                  </td>
                  <td className="px-6 py-4">
                   <button className=""  >
                      View details
                   </button>
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

export default OrderList;
