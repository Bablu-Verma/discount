import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Image from "next/image";
import React from "react";

import { getServerToken } from "@/helpers/server/server_function";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { product_details_ } from "@/utils/api_url";
import { getTimeAgo } from "@/helpers/client/client_function";
import Campaign_user_event from "./_campaign_user_event";
import Offer_end_component from "./_offer_end_component";
import Watchlistadd from "./_watchlistadd";
import styles from "./product_page.module.css";
import ShopNowButton from "./_shop_now";
import Link from "next/link";

interface DetailsProps {
  params: { id: string };
}

export const GetData = async (token: string, slug: string) => {
  try {
    let { data } = await axios.post(
      product_details_,
      {
        product_slug: slug,
        product_status: "ACTIVE",
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
      console.error("Error registering user", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

const CampaignDetail = async ({ params }: DetailsProps) => {
  const token = await getServerToken();

  let { id } = await params;
  let slug = id;

  

  const page_data = await GetData(token, slug);

  const { product, relatedProducts, relatedcoupons } = page_data;

  return (
    <>
      <MainHeader />
      <main className="">
        <section className="max-w-6xl mx-auto mt-6 sm:mt-14 mb-16 p-2 xl:p-0">
          <div className="md:grid md:grid-cols-[42%_55%] gap-[3%] bg-white rounded-md p-4">
            <div>
             
              <div className=" w-[100%]  rounded-md  justify-center shadow-sm items-center flex overflow-hidden">
                <Image
                  src={product.product_img || "https://i.imgur.com/AZoKCRT.png"}
                  alt="Active Product Image"
                  height={400}
                  width={400}
                  className="w-full md:min-h-80"
                />
              </div>
              <div className="hidden md:flex  justify-start gap-10 items-center pt-10 ">
                <Link
                  href={`/store/${product.store.slug}`}
                  className="text-secondary text-xl inline-flex items-center gap-3 ml-3"
                >
                  <Image
                    src={product.store.store_img}
                    alt=""
                    className="w-16 h-16 rounded-full"
                    width={100}
                    height={100}
                  />
                  <span className="mt-1">{product?.store.name}</span>
                </Link>
                <Campaign_user_event campaign_data={product} />
              </div>
            </div>

            <div className="mt-8 md:mt-0">
              <h1 className="text-lg sm:text-xl text-secondary font-medium  mb-3">
                {product?.title}
              </h1>
              <div className="flex gap-3 mb-4 items-center">
                <p>
                  <i className="fa-regular fa-clock mr-1 "></i>
                  <span>{getTimeAgo(product.createdAt)}</span>
                </p>{" "}
                |{" "}
                {product?.flash_sale[0].is_active && (
                  <Offer_end_component
                    time_data={product?.flash_sale[0].end_time}
                  />
                )}
              </div>
              <div className="flex items-center mt-1">
                <strong className="text-secondary text-3xl mr-3">
                  ₹{product?.offer_price}/-
                </strong>
                <span className="text-gray-600 text-xl font-medium line-through">
                  ₹{product?.actual_price}
                </span>
                <small className="text-red-500 text-sm py-1 px-3 ml-4 border-[1px] border-red-500 rounded-full ">
                  ₹{product?.calculated_cashback} Off
                </small>
              </div>
              <div className="py-7 flex justify- gap-5 items-center">
                <ShopNowButton page_data={product} />

                <Watchlistadd oneitem={product} />
              </div>

              <div className="flex md:hidden   justify-start gap-10 items-center md:pt-10 ">
                <Link
                  href={`/store/${product.store.slug}`}
                  className="text-secondary  inline-flex items-center gap-3"
                >
                  <Image
                    src={product.store.store_img}
                    alt=""
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                    width={100}
                    height={100}
                  />
                  <span className="mt-1 text-base sm:text-xl">
                    {product?.store.name}
                  </span>
                </Link>
                <Campaign_user_event campaign_data={product} />
              </div>

              <div className=" w-full  mt-6  rounded">
                <div
                  className={`${styles.product_style} text-base text-gray-500`}
                  dangerouslySetInnerHTML={{
                    __html: product.description || "",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default CampaignDetail;
