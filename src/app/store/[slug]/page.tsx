import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Image from "next/image";
import React from "react";
import { MainHeading } from "@/components/Heading";
import BestSalling from "@/components/homepage/BestSelling";
import axios, { AxiosError } from "axios";
import {
  store_details_api,
} from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";
import toast from "react-hot-toast";
import { Store_tc, StoreDesc } from "./store_desc_tc";
import Link from "next/link";
import StoreClientTab from "./store_client_tab";
import tracking_image from '../../../../public/track.webp'



interface IStoreDetailsProps {
  params: { slug: string };
}

export const GetData = async (token: string, slug: string) => {
  try {
    let { data } = await axios.post(
      store_details_api,
      {
        slug: slug,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error registering user", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

const StoreDetail = async ({ params }: IStoreDetailsProps) => {
  const token = await getServerToken();
  const awaitslug = await params;
  const slug = awaitslug.slug;

  const page_data = await GetData(token, slug);

  const { store, related_product, related_coupons, related_stores, top_stores } = page_data;

  // console.log(page_data);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="w-full bg-primary px-2 mx-auto ">
          <div className="max-w-6xl py-20 px-2.5 mx-auto relative">
            <div className="sm:grid  sm:grid-cols-[15%_85%] lg:grid-cols-[10%_90%] gap-5 ">
              <div className=" flex items-end pb-3 sm:pb-0 sm:inline gap-3">
                <Image
                  src={store.store_img}
                  alt="WvzprEv"
                  width={40}
                  className="w-20 sm:w-full"
                  height={40}
                />
                <div className="sm:hidden ">
                  <h1 className="  text-lg capitalize  text-white font-normal ">
                    {store.name}
                  </h1>
                  <p className="text-2xl text-center font-medium text-light pt-1 ">
                    {store.cashback_type == "FLAT_AMOUNT" && <>Up to ₹{store.cashback_amount}.00</>}
                    {store.cashback_type == "PERCENTAGE" && <>Up to {store.cashback_amount}%</>} Off
                  </p>

                </div>
              </div>
              <div>
                <h1 className="hidden sm:block text-2xl capitalize  text-white font-medium ">
                  {store.name}
                </h1>

                <StoreDesc html_={store.description || ""} />
                <div className="sm:flex gap-5  mt-6">
                  <a className="border-[1px] text-base rounded px-6 py-2 text-white inline-block" href={store.store_link}>Shop & Earn</a>
                  <p className="hidden sm:inline-block text-xl text-center font-medium text-light pt-1 ">
                    {store.cashback_type == "FLAT_AMOUNT" && <>Up to ₹{store.cashback_amount}.00</>}
                    {store.cashback_type == "PERCENTAGE" && <>Up to {store.cashback_amount}%</>} Off
                  </p>
                </div>

              </div>
            </div>
            <Store_tc store_tc={store.tc} />
          </div>
        </section>
        <section className="max-w-6xl mx-auto h-12 relative">
          <div className="p-2 px-5 flex justify-center items-center gap-5">
            <span className="text-base text-secondary">Tracking Speed: </span>
            <Image
              src={tracking_image}
              alt="WvzprEv"
              sizes="100vw"
              width={10}
              className="h-auto w-10"
              height={10}
            />

            <strong className="text-xl text-secondary tracking-wider capitalize">{store.tracking}</strong>

          </div>
        </section>
        <section className="max-w-6xl px-2.5 my-12 mx-auto flex   flex-col-reverse sm:grid lg:gap-16 sm:gap-5 min-h-60 grid-cols-4">
          <div className="col-span-1 mt-12 sm:mt-0 ">
            <div className="p-3 border-[1px] rounded shadow-sm border-gray-300 mb-10 ">
              <h3 className="text-center text-xl font-medium mb-3">Top Store</h3>
              {
                top_stores && top_stores.length > 0 && top_stores.map((item, i) => {
                  return (
                    <p className="text-lg capitalize text-secondary mb-2" key={i}> {i + 1}. <Link className=" hover:underline" href=''>{item.name}</Link></p>
                  )
                })
              }
            </div>
            <div className="p-3 border-[1px] rounded shadow-sm border-gray-300 mb-10 ">
              <h3 className="text-center text-xl font-medium mb-3">Related Store</h3>
              {
                related_stores && related_stores.length > 0 && related_stores.map((item, i) => {
                  return (
                    <p className="text-lg capitalize text-secondary mb-2" key={i}> {i + 1}. <Link className=" hover:underline hover:text-primary" href=''>{item.name}</Link></p>
                  )
                })
              }
            </div>
          </div>
          <div className="col-span-3 ">
            <StoreClientTab relatedProducts={related_product} relatedCoupons={related_coupons} />
          </div>
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default StoreDetail;
