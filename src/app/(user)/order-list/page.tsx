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
import { IoClose } from "react-icons/io5";

export default function OrderListPage() {
  const [orderList, setOrderList] = useState([]);
  const token = useSelector((state: RootState) => state.user.token);
  // ✅ Filters state (All filters included)
  const user_data = useSelector((state: RootState) => state.user.user);
  const [sheet, setSheet] = useState({
    show: false,
    details: {},
  });

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
        <div className="max-w-6xl mx-auto px-4 mt-7 md:mt-10 gap-4 flex flex-col mb-4 relative min-h-[80vh]">
          {orderList.map((item, i) => {
            return (
              <div className="shadow-sm rounded rounded-tr-3xl  relative border-[1px] border-gray-200 py-4 px-3  bg-[#fff]">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base text-secondary font-semibold tracking-wide">
                    {item.product_id.title}
                  </h2>

                  <span className="text-sm text-gray-400">
                    Order Date: {formatDate(item.createdAt)}
                  </span>
                </div>
                <div className="flex justify-start items-center gap-6 mb-2">
                  <span>
                    Order Status: <b>{item.order_status}</b>
                  </span>
                  -
                  <span>
                    Cashback Amount: <b>{item.calculated_cashback}</b>
                  </span>
                </div>
                <div className="flex justify-start items-center gap-6">
                  <h5 className="text-base text-secondary font-normal tracking-wide">
                    Order #{item.transaction_id}
                  </h5>
                  <button
                    onClick={() =>
                      setSheet({
                        show: true,
                        details: item,
                      })
                    }
                    type="button"
                    className="text-sm text-primary font-normal hover:text-blue-400 hover:underline duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <BottomToTop />
      </main>
      <Footer />

      {sheet.show && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-[rgba(0,0,0,.5)]  flex items-center justify-center">
          <div className="bg-white  md:rounded-md relative w-full max-w-6xl h-full md:h-[70vh]">
            <button
              className="absolute top-2 right-2 bg-slate-400 rounded-full p-1 "
              onClick={() =>
                setSheet({
                  show: false,
                  details: {},
                })
              }
            >
              <IoClose className="text-xl " />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
