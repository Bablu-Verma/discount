import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import CategorieCard from "@/components/small_card/CategorieCard";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import { getServerToken } from "@/helpers/server/server_function";
import { ICategory } from "@/model/CategoryModel";
import { ICoupon } from "@/model/CouponModel";
import { coupons_list_api } from "@/utils/api_url";

import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";


export const GetData = async (token:string) => {
  try {
    let { data } = await axios.post(
      coupons_list_api,
      {
        status:"ACTIVE"
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


    console.log(page_data)

  return (
    <>

    <MainHeader />
    <main>
      <div className="max-w-6xl  px-2 m-auto mt-4 lg:mt-14 mb-16">
         
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-10">
          {
            page_data.map((item:ICoupon) => (
              <CouponcodeCard item={item}/>
            ))
          }
        </div>
      </div>
      <BottomToTop />
    </main>
    <Footer />
    </>
  );
}
