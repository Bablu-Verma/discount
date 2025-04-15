

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import React from "react";
import CampaignClient from "./_campaign_client";
import { getServerToken } from "@/helpers/server/server_function";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { product_list_ } from "@/utils/api_url";


export const GetData = async (token:string) => {
  try {
    let { data } = await axios.post(
      product_list_,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
 
    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) { 
      console.error("Error registering user", error.response?.data.message);
      // toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};


const Campaign = async () => {
  
    const token = await getServerToken()
    const page_data = await GetData(token)

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl mx-auto mt-14 mb-16 p-2 xl:p-0">
          <CampaignClient product_={page_data} />
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default Campaign;

