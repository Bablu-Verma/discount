import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";

import { getServerToken } from "@/helpers/server/server_function";
import { wishlist_list_get_ } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React from "react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { ICampaign } from "@/model/CampaignModel";

export const GetData = async (token: string) => {
  try {
    let { data } = await axios.post(
      wishlist_list_get_,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error get wishlist", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

const Wishlist = async () => {
  const token = await getServerToken();
  if (!token) {
    redirect("/login");
  }

  const page_data = await GetData(token);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-between items-end mb-4 relative">
          <h2 className="text-xl font-semibold text-gray-700 capitalize pr-5 md:pr-10 gap-10">
            Wishlist(6)
          </h2>
          <button className="text-gray-700 bg-white py-1.5 px-4 rounded capitalize font-medium text-[11px] border-2 border-gray-600 text-sm hover:shadow-sm hover:rounded-md duration-200">
            Remove all
          </button>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 pt-2  mb-4 gap-3 ">
          <div className="grid grid-cols-10 w-full mt-10 py-2 text-xl font-semibold mb-2 select-none px-4">
            <h3 className="text-base text-secondary">S No.</h3>
            <h3 className="col-span-3 text-base text-secondary">Product</h3>
            <h3 className="text-base text-secondary">Partner</h3>
            <h3 className="text-base text-secondary"></h3>
            <h3 className="text-base text-secondary">Offer</h3>
            <h3 className="text-base text-secondary">Status</h3>
            <h3 className="text-base text-secondary">Action</h3>
          </div>
          {page_data.data.map((item:ICampaign,i:number) => {
            return (
              <div className="grid grid-cols-10 w-full mt-3 py-2 text-base font-normal mb-2 hover:bg-gray-200 items-center px-4 rounded" key={i}>
                <span>{i+1}</span>
                <div className="col-span-3 flex items-center">
                  <img
                    src="https://api.thechennaimobiles.com/1719121334790.webp"
                    className="max-h-14 aspect-auto"
                    alt=""
                  />{" "}
                  <span className=" mx-3 line-clamp-1">{item.title}</span>
                </div>
                <span className="col-span-2">
                  <a href="">{item.brand}</a>
                </span>
                <span>{item.cashback}</span>
                <span>
                  <b
                    className="text-green-700 italic"
                    title="Bye this product use link"
                  >
                    Active
                  </b>
                </span>
                <span>
                   View
                </span>
                <span>
                  <i className="fa-solid fa-trash"></i>
                </span>
              </div>
            );
          })}
        </div>

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default Wishlist;
