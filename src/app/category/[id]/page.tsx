import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Image from "next/image";
import React from "react";
import { MainHeading } from "@/components/Heading";
import BestSalling from "@/components/homepage/BestSelling";
import axios, { AxiosError } from "axios";
import { category_details_api } from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";
import toast from "react-hot-toast";


interface CategoryDetailsProps {
  params : {id: string};
}

export const GetData = async (token:string, slug:string) => {
  try {
    let { data } = await axios.post(
      category_details_api,
      {
        slug:slug
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


const CategoryDetail = async ({params}: CategoryDetailsProps) => {
  const token = await getServerToken();
  const awaitslug = await params;
  const slug = awaitslug.id



  const page_data = await GetData(token, slug);
  // console.log("page_data",page_data);

  const {category_details, relatedProducts , relatedCoupons} =  page_data 

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl  px-2 mx-auto mt-4 lg:mt-14 mb-16">
          <div className="text-sm lg:text-base">
            <span>Home</span> / <span>Category</span> / <span>{category_details.name}</span>
          </div>
          <div className="mt-8 text-center items-center">
            <div className="h-32 w-32 rounded-full overflow-hidden justify-center items-center flex shadow-lg m-auto mb-10]">
              <Image
                src={category_details.imges[0]}
                alt="WvzprEv"
                width={500}
                className="w-full h-auto"
                height={500}
              />
            </div>
            <h1 className="text-xl text-secondary capitalize font-medium  my-3">
              {category_details.name}
            </h1>
            <div className="pt-4 text-sm"  dangerouslySetInnerHTML={{ __html: category_details.description || ''}}>
            </div>
          </div>

        
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default CategoryDetail;
