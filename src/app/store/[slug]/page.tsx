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
import { StoreDesc } from "./store_desc_tc";
import Link from "next/link";
import StoreClientTab from "./store_client_tab";

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

  const { store, related_product, related_coupons,related_stores, top_stores } = page_data;

  console.log(page_data);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="w-full bg-primary px-2 mx-auto ">
          <div className="max-w-6xl py-20 px-2.5 mx-auto relative">
            <div className="grid grid-cols-[10%_90%] gap-5">
              <div className="">
                <Image
                  src={store.store_img}
                  alt="WvzprEv"
                  width={40}
                  className="w-full"
                  height={40}
                />

              </div>
              <div>
                <h1 className="text-2xl capitalize  text-white font-medium ">
                  {store.name}  
                </h1>
               
                <StoreDesc html_={store.description || ""} />
                 <a className="border-[1px] text-base rounded px-6 py-2 text-white inline-block mt-6" href={store.store_link}>Shop & Earn</a>
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto h-12 relative">
          <div className="p-2 px-5   shadow-md bg-white border border-gray-100 -top-4">
            |
            <p><span>Tracking Speed: </span><strong>{store.tracking}</strong></p>

          </div>
        </section>
        <section className="max-w-6xl my-12 mx-auto grid gap-16 min-h-60 grid-cols-4">
          <div className="col-span-1">
            <div className="p-3 border-[1px] rounded shadow-sm border-gray-300 mb-10 ">
              <h3 className="text-center text-xl font-medium mb-3">Top Store</h3>
              {
                top_stores && top_stores.length > 0 && top_stores.map((item, i) => {
                  return (
                   <p className="text-lg capitalize text-secondary mb-2" key={i}> {i+1}. <Link className=" hover:underline" href=''>{item.name}</Link></p>
                  )
                })
              }
            </div>
            <div className="p-3 border-[1px] rounded shadow-sm border-gray-300 mb-10 ">
              <h3 className="text-center text-xl font-medium mb-3">Related Store</h3>
              {
                related_stores && related_stores.length > 0 && related_stores.map((item, i) => {
                  return (
                   <p className="text-lg capitalize text-secondary mb-2" key={i}> {i+1}. <Link className=" hover:underline hover:text-primary" href=''>{item.name}</Link></p>
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
