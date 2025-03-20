import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Image from "next/image";
import React from "react";
import { MainHeading } from "@/components/Heading";
import BestSalling from "@/components/homepage/BestSelling";
import axios, { AxiosError } from "axios";
import { category_details_api, list_store_api, store_details_api } from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";
import toast from "react-hot-toast";


interface IStoreDetailsProps {
  params : {slug: string};
}

export const GetData = async (token:string, slug:string) => {
  try {
    let { data } = await axios.post(
      store_details_api,
      {
        slug:slug,
        store_status:"ACTIVE" 
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


const StoreDetail = async ({params}: IStoreDetailsProps) => {
  const token = await getServerToken();
  const awaitslug = await params;
  const slug = awaitslug.slug


  const page_data = await GetData(token, slug);


  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl px-2 mx-auto mt-4 lg:mt-14 mb-16">
         
          <div className="mt-8 text-center items-center">
            <div className="h-36 w-36 rounded-full overflow-hidden justify-center items-center flex shadow-lg m-auto mb-10]">
              <Image
                src={page_data.store_img}
                alt="WvzprEv"
                width={500}
                className="w-full h-auto"
                height={500}
              />
            </div>
            <h1 className="text-xl text-secondary font-medium  my-3">
              {page_data.name}
            </h1>
            <div className="pt-4 text-sm"  dangerouslySetInnerHTML={{ __html: page_data.description }}>
            </div>
          </div>
         
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default StoreDetail;
