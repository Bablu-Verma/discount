import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import CategorieCard from "@/components/small_card/CategorieCard";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import { getServerToken } from "@/helpers/server/server_function";
import { ICategory } from "@/model/CategoryModel";
import { ICoupon } from "@/model/CouponModel";
import { coupons_list_api } from "@/utils/api_url";
import { RiCoupon3Fill } from "react-icons/ri";


import axios, { AxiosError } from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaStore } from "react-icons/fa";


export const GetData = async (token: string) => {
  try {
    let { data } = await axios.post(
      coupons_list_api,
      {
        status: "ACTIVE"
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

export default async function Category() {

  const token = await getServerToken()
  const page_data = await GetData(token)

  return (
    <>

      <MainHeader />
      <main>
        <div className="max-w-6xl  px-2 m-auto mt-4 lg:mt-8 mb-16">
          <div className="flex justify-center items-center h-[200px]">
            <h1 className="text-5xl uppercase text-secondary flex gap-3 font-medium">Best <span className="text-primary ">Coupons </span> <RiCoupon3Fill className="text-primary" /></h1>
          </div>


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-10">
            {
              page_data.map((item: ICoupon) => (
                <CouponcodeCard item={item} />
              ))
            }
          </div>


          <div className="flex justify-center items-center pt-10 ">
          <button className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary ">More Coupon</button>
        </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
