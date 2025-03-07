import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { MainHeading, SubHeading } from "@/components/Heading";
import Featured from "@/components/heropage/Featured";
import Hero from "@/components/heropage/Hero";
import BestSalling from "@/components/homepage/BestSelling";
import CallApiInHome from "@/components/homepage/CallApiInHome";
import HomeBlog from "@/components/homepage/HomeBlog";
import HomeCategories from "@/components/homepage/HomeCategories";
import HomeFlash from "@/components/homepage/HomeFlash";
import HomePoster from "@/components/homepage/HomePoster";
import SubFooter from "@/components/SubFooter";
import TimeCount from "@/components/TimeCount";
import { getServerToken } from "@/helpers/server/server_function";



import { home_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";


export const GetData = async (token: string) => {
  try {
    let  data  = await axios.post(
      home_api,
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
      console.error("Error home data  fatching", error.response?.data.message);
      
    } else {
      console.error("Unknown error", error);
    }
  }
};

export default async function Home() {
  const token = await getServerToken();
  const page_data = await GetData(token);


  if (page_data) {
    console.log("page_data", page_data.data);
  }

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
        <SubHeading title="Today's" />
        <div className="max-w-[1400px] mx-auto px-2 flex mt-4 lg:mt-7 md:mt-10 justify-start items-end mb-4 relative">
          <MainHeading title="Flash Sales" />
          {/* <TimeCount /> */}
        </div>
        <HomeFlash flashSale={page_data.data.flash_sale} />


        <SubHeading title="This Month" />
        <div className="max-w-[1400px] mx-auto px-2 flex mt-4 lg:mt-7 md:mt-10 justify-start items-end mb-4 relative">
          <MainHeading title="Best Selling Products" />
        </div>
        <BestSalling best_product={page_data.data.best_product} />

        <div className="max-w-[1400px] mx-auto mt-14">
          <HomePoster poster={page_data.data.long_poster} />
        </div>
        <SubHeading title="Our Product" />
        <div className="max-w-[1400px] mx-auto px-2 flex mt-4 lg:mt-7 md:mt-10 justify-start items-end mb-4 relative">
          <MainHeading title="Explore Our Products" />
        </div>
        {/* <BestSalling best_product={page_data.data.hot_product} /> */}

        <SubHeading title="Featured" />
        <div className="max-w-[1400px] mx-auto px-2 flex mt-4 lg:mt-7 md:mt-10 justify-start items-end mb-4 relative">
          <MainHeading title="New Arrival" />
        </div>
        <Featured arrival={page_data.data.premium_product} />
        <SubHeading title="Categories" />
        <div className="max-w-[1400px] mx-auto px-2 flex mt-4 lg:mt-7 md:mt-10 justify-start items-end mb-4 relative">
          <MainHeading title="Browse by category" />
        </div>
        <HomeCategories category={page_data.data.category} />
        <SubHeading title="Blog" />
        <div className="max-w-[1400px] mx-auto px-2 flex mt-4 lg:mt-7 md:mt-10 justify-start items-end mb-4 relative">
          <MainHeading title="Read Our Blog" />
        </div>
        <HomeBlog blogs={page_data.data.blog} />

        <SubFooter />
        <BottomToTop />
      </main>
      <Footer />
    </>
  ); 
}
