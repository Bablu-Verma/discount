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
import Wishlist_client from "./_wishlist_client";
import Wishlist_remove from "./_wishlist_remove";

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
   return data.data;
    
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

  const page_data = await GetData(token);

  const wishlist_products = page_data.products;

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="min-h-screen">
        <div className="max-w-6xl  mx-auto px-4 flex mt-7 md:mt-10 justify-between items-end mb-4 relative">
          <h2 className="text-xl font-semibold text-gray-700 capitalize pr-5 md:pr-10 gap-10">
            Total ({page_data?.count})
          </h2>
         <Wishlist_remove id={page_data?.wishlist_id} />
        </div>
        <div className="overflow-auto">
        <div className="max-w-6xl min-w-[800px] mx-auto px-4 pt-2  mb-4 gap-3 ">
          <div className="grid grid-cols-10 w-full mt-10 py-2 text-xl font-semibold mb-2 select-none px-4">
            <h3 className="text-base text-secondary">S No.</h3>
            <h3 className="col-span-3 text-base text-secondary">Product...</h3>
            <h3 className="text-base text-secondary">Partner</h3>
            <h3 className="text-base text-secondary"></h3>
            <h3 className="text-base text-secondary">Offer</h3>
            <h3 className="text-base text-secondary">Status</h3>
            <h3 className="text-base text-secondary">Action</h3>
          </div>
          <Wishlist_client item_={wishlist_products}/>

        </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default Wishlist;
