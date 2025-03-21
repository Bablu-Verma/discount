import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Image from "next/image";
import React from "react";
import Campaign_banner from "./_campaign_banner";
import { MainHeading } from "@/components/Heading";
import BestSalling from "@/components/homepage/BestSelling";
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

interface DetailsProps {
  params: { id: string };
}

export const GetData = async (token: string, slug: string) => {
  try {
    let { data } = await axios.post(
      product_details_,
      {
        product_slug: slug,
        product_status:'ACTIVE'
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

  // console.log('slug__',slug)

  const page_data = await GetData(token, slug);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl mx-auto mt-6 sm:mt-14 mb-16 p-2 xl:p-0">
          <div className="md:grid md:grid-cols-2 gap-5">
            <div>
              <Campaign_banner campaign_data={page_data.img_array} />
              <Campaign_user_event campaign_data={page_data} />
            </div>

            <div>
              <h1 className="text-lg sm:text-xl text-secondary font-medium  mb-3">
                {page_data?.title}
              </h1>
              <div className="flex gap-3 mb-4 items-center">
                <p>
                  <i className="fa-regular fa-clock mr-1 "></i>
                  <span>{getTimeAgo(page_data.createdAt)}</span>
                </p>  |  {page_data?.flash_sale[0].is_active && (
                <Offer_end_component time_data={page_data?.flash_sale[0].end_time} />
              )}
                
              </div>
              <div className="flex items-center mt-1">
                <strong className="text-secondary text-3xl mr-3">
                  ₹{page_data?.offer_price}/-
                </strong>
                <span className="text-gray-600 text-xl font-medium line-through">
                  ₹{page_data?.actual_price}
                </span>
                <small className="text-red-500 text-base py-.5 px-2 ml-4 border-[1px] border-red-500 ">
                  ₹{page_data?.calculated_cashback} Off
                </small>
              </div>
              <div className="py-7 flex justify- gap-5 items-center">
               <ShopNowButton page_data={page_data} />
                {/* <button className=" py-2 px-5 capitalize text-base text-center outline-none border-none text-secondary hover:underline duration-200 ">
                  Help to Avail this offer?
                </button> */}
                <Watchlistadd oneitem={page_data} />
              </div>
             

              <div className="flex justify-start gap-10 items-center">
                <p className="text-base text-gray-700 capitalize">
                  {" "}
                  <small>Brand:</small>
                  <span className="text-secondary text-xl">
                    {page_data?.store}
                  </span>
                </p>
                <p className="text-base text-gray-700 capitalize">
                  {" "}
                  <small>Category:</small>{" "}
                  <span className="text-secondary text-xl">
                    {page_data?.category}
                  </span>
                </p>
              </div>
              <div className="max-h-[700px] overflow-y-auto w-full border-[1px] mt-6 border-gray-300 p-3 rounded">
                <div
                  className={`${styles.product_style} text-base text-gray-500`}
                  dangerouslySetInnerHTML={{ __html: page_data.description }}
                ></div>
              </div>
            </div>
          </div>

          {/* <SubHeading title="This Month" />
          <div className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative">
            <MainHeading title="Best Selling Products" />
          </div> */}
          {/* <BestSalling /> */}
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default CampaignDetail;
