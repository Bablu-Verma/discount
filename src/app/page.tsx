import BottomToTop from "@/components/BottomToTop";

import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { MainHeading, SubHeading } from "@/components/Heading";
import Featured from "@/components/heropage/Featured";

import Hero from "@/components/heropage/Hero";
import BestSalling from "@/components/homepage/BestSelling";
import HomeBlog from "@/components/homepage/HomeBlog";
import HomeCategories from "@/components/homepage/HomeCategories";
import HomeFlash from "@/components/homepage/HomeFlash";
import SubFooter from "@/components/SubFooter";
import TimeCount from "@/components/TimeCount";
import { getServerToken } from "@/helpers/server/server_function";

import { home_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";


const GetData = async (token:string) => {
  try {
    let { data } = await axios.post(
      home_api,
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
 
    return data;
  } catch (error) {
    if (error instanceof AxiosError) { 
      console.error("Error registering user", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export default async function  Home() {

  const token = await getServerToken()
  const page_data = await GetData(token)

  console.log(page_data)

  return (
    <>
    <TopHeader />
    <MainHeader />
    <Hero />
    <main>
      <SubHeading title="Today's" />
      <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative"
      >
       <MainHeading title="Flash Sales" />
       <TimeCount />
      </div>
      <HomeFlash />
      <SubHeading title="Categories" />
      <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative"
      >
       <MainHeading title="Browse by category"/>
      </div>
      <HomeCategories />
  
      <SubHeading title="This Month" />
      <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative"
      >
       <MainHeading title="Best Selling Products"/>
      </div>
      <BestSalling />
      <div className="max-w-[1400px] mx-auto mt-14">
        <a href="" className="overflow-hidden min-h-[300px] inline-block w-full bg-[url('https://www.bajajmall.in/content/dam/emistoremarketplace/index/10-10-22/geetanjali/mobile-phones-diwali-page/big-banner/desk/MCLP_Row5_1_BigBanner_Desk_vivoT15G_PDP_B2B.jpg')] bg-no-repeat bg-cover">
          {/* <img src="https://www.bajajmall.in/content/dam/emistoremarketplace/index/10-10-22/geetanjali/mobile-phones-diwali-page/big-banner/desk/MCLP_Row5_1_BigBanner_Desk_vivoT15G_PDP_B2B.jpg" alt="" className="w-full" /> */}
        </a>
      </div>
     
      <SubHeading title="Our Product" />
      <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative"
      >
       <MainHeading title="Explore Our Products"/>
      </div>
      <BestSalling />

      <SubHeading title="Featured" />
      <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative"
      >
       <MainHeading title="New Arrival"/>
      </div>
      <Featured /> 

    

      <SubHeading title="Blog" />
      <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative"
      >
       <MainHeading title="Read Our Blog"/>
      </div>
      <HomeBlog />

      
      <SubFooter />
      <BottomToTop />
    </main>
    <Footer />
    </>
  );
}
