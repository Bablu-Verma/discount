import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Image from "next/image";
import React from "react";

import axios, { AxiosError } from "axios";
import { category_details_api, coupons_detail_api } from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";
import toast from "react-hot-toast";
import CouponDetailsClient from "./CouponDetailsClient";

interface CouponDetailsProps {
  params: { id: string };
}

export const GetData = async (token: string, slug: string) => {
  console.log("slug", slug);
  try {
    let { data } = await axios.post(
      coupons_detail_api,
      {
        status: "ACTIVE",
        coupon_id: slug,
      },
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
      console.error("Error get coupon detail", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

const CouponDetail = async ({ params }: CouponDetailsProps) => {
  const token = await getServerToken();
  const awaitslug = await params;

  console.log("awaitslug ", awaitslug);

  const slug = awaitslug.id;

  const page_data = await GetData(token, slug);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl min-h-[70vh] px-2 mx-auto mt-4 lg:mt-14 mb-16">
           <CouponDetailsClient page_data={page_data}/>
          <div className="max-w-[700px] mt-6 m-auto shadow-sm rounded rounded-tr-3xl rounded-bl-3xl relative  border-[1px] border-gray-200 py-8 px-7  bg-[#fff]">
            <h3 className="text-lg text-secondary font-semibold tracking-wide mb-3">More Detail</h3>
           <div dangerouslySetInnerHTML={{ __html: page_data.description }}>

           </div>
          </div>
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default CouponDetail;
