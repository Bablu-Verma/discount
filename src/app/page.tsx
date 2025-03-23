import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { MainHeading } from "@/components/Heading";
import Featured from "@/components/heropage/Featured";
import Hero from "@/components/heropage/Hero";
import BestSalling from "@/components/homepage/BestSelling";
import CallApiInHome from "@/components/homepage/CallApiInHome";
import HomeBlog from "@/components/homepage/HomeBlog";
import HomeCategories from "@/components/homepage/HomeCategories";
import HomeFlash from "@/components/homepage/HomeFlash";
import HomePoster from "@/components/homepage/HomePoster";
import HowToWork from "@/components/HowToWork";
import Loginhomepopup from "@/components/Loginhomepopup";

import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import StoreCard from "@/components/small_card/StoreCard";

import { getServerToken } from "@/helpers/server/server_function";
import { ICoupon } from "@/model/CouponModel";
import { IStore } from "@/model/StoreModel";

import { home_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";


export const GetData = async (token: string) => {
  try {
    let data = await axios.post(home_api, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error home data  fatching", error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export default async function Home() {
  const token = await getServerToken();
  const page_data = await GetData(token);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <CallApiInHome />
      
      <Hero
        home_category={page_data.data.category}
        banner={page_data.data.main_banner}
      />
      <main>

      <Loginhomepopup />
      
        <div className="py-7">
          <MainHeading title="Flash Sales" />
          {/* <TimeCount /> */}
          <HomeFlash flashSale={page_data.data.flash_sale} />
        </div>

        <div className="py-7">
          <MainHeading title="Best Selling Products" />
          <BestSalling best_product={page_data.data.best_product} />
        </div>

        <div className="border-[1px solid #e7e7e7] mt-10">
          <MainHeading title="Explore Our Products" />
          <BestSalling best_product={page_data.data.offer_deal} />
        </div>
        <div className="max-w-6xl mx-auto mt-14">
          <HomePoster poster={page_data.data.long_poster} />
        </div>
        <div className="max-w-6xl m-auto bg-gradient-to-b from-[#f1f5f8] to-[#dfe8ef] py-3 px-2 rounded-xl mt-4 lg:mt-14">
          <MainHeading title="Cashback store" />
          <div className="max-w-6xl relative  m-auto  mb-12">
            <div className="absolute right-4 top-[-44px]">
              <a
                href="/store"
                className="text-primary  py-2 px-5 sm:px-8 rounded-sm capitalize font-medium text-sm hover:shadow-sm duration-200"
              >
                View All
              </a>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 mt-3 lg:mt-5">
              {page_data.data.store.map((item: IStore) => (
                <StoreCard item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="py-7">
          <MainHeading title="New Arrival" />
          <Featured arrival={page_data.data.premium_product} />
        </div>

        <div className="py-7">
          <MainHeading title="New Coupon" />
          <div className="max-w-6xl px-2 m-auto mt-2 lg:mt-8 mb-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-6 lg:mt-10">
              {page_data.data.coupon.map((item: ICoupon) => (
                <CouponcodeCard item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl m-auto py-3 lg:px-2 rounded-xl bg-[#f5c4d0]">
          <MainHeading title="Browse by category" />
          <HomeCategories category={page_data.data.category} />
        </div>

        <div className="py-7">
          <MainHeading title="Read Our Blog" />
          <HomeBlog blogs={page_data.data.blog} />
        </div>
        <BottomToTop />
        <div className="py-7">
          <MainHeading title="How We are Work" />
          <HowToWork />
        </div>
        
      </main>
      <Footer />
    </>
  );
}
