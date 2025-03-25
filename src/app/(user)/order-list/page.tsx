"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { formatDate } from "@/helpers/client/client_function";
import { RootState } from "@/redux-store/redux_store";
import { list_store_api, order_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function OrderListPage() {
  const [orderList, setOrderList] = useState([]);
  const token = useSelector((state: RootState) => state.user.token);
  // ✅ Filters state (All filters included)
  const user_data = useSelector((state: RootState) => state.user.user);

 

  const get_order = async () => {
    try {
      const { data } = await axios.post(
        order_list_api,
        {
          user_id: user_data?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderList(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        console.error("Unknown error", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    get_order();
  }, []);

  console.log(orderList);

  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-6xl mx-auto px-4 mt-7 md:mt-10 gap-4 flex flex-col mb-4 relative">
          {orderList.map((item, i) => {
            return (
              <div className="shadow-sm rounded rounded-tr-3xl  relative border-[1px] border-gray-200 py-4 px-3  bg-[#fff]">
                <div className="flex justify-between items-center">
                  <h2 className="text-base text-secondary font-semibold tracking-wide">
                    Order #{item.transaction_id}
                  </h2>
                  <span className="text-sm text-gray-400">
                    Order Date: {formatDate(item.createdAt)}
                  </span>
                </div>

                <button type="button">View Details</button>
              </div>
            );
          })}
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
