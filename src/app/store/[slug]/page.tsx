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
  category_details_api,
  list_store_api,
  store_details_api,
} from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";
import toast from "react-hot-toast";

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

  const { store, related_product, related_coupons } = page_data;

  console.log(page_data);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl px-2 mx-auto mt-4 lg:mt-14 mb-16">
          <div className="mt-8 shadow-md p-4 gap-4 rounded flex ">
            <div className="h-24 w-28  justify-center items-center flex border-r-2 pr-4">
              <Image
                src={store.store_img}
                alt="WvzprEv"
                width={500}
                className="w-full h-auto"
                height={500}
              />
            </div>
            <h1 className="text-xl text-secondary font-medium ">
              {store.name}
            </h1>
          </div>
          <div
            className="pt-4 text-sm text-left"
            dangerouslySetInnerHTML={{ __html: store.description || "" }}
          ></div>
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default StoreDetail;
