import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import store_image from '../../../public/storeimage.png'
import { getServerToken } from "@/helpers/server/server_function";
import { list_store_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import StoreClient from "./store_client";
import Image from "next/image";
import { FaStore } from "react-icons/fa";

export const GetData = async (token: string) => {
  try {
    let { data } = await axios.post(list_store_api,{store_status:"ACTIVE"}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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

export default async function Stores() {
  const token = await getServerToken();
  const page_data = await GetData(token);

  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-6xl px-2 m-auto mt-4 lg:mt-5 mb-16">
        <div className="flex justify-center items-center h-[130px] sm:h-[200px]">
          <h1 className=" text-3xl md:text-5xl uppercase text-secondary flex gap-3 font-medium">CashBack <span className="text-primary ">Store </span> <FaStore className="text-primary" /></h1>
        </div>
          <StoreClient page_data={page_data} />
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
