"use client"

import ProductCard from "@/components/small_card/ProductCard";

import React, { useEffect, useState } from "react";
import Filter from "./_filter";
import { ICampaign } from "@/model/CampaignModel";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { product_list_ } from "@/utils/api_url";
import toast from "react-hot-toast";
import { defaultFilterData } from "@/redux-store/slice/ProductFilterSlice";



interface productProps {
    product_: ICampaign[]
}

const CampaignClient:React.FC<productProps> = ({product_}) => {
  
  const [products, setProducts] = useState(product_);
  const token = useSelector((state: RootState) => state.user.token);
  const pfilter = useSelector((state: RootState) => state.pfilter);


  console.log("pfilter", pfilter);
  console.log("products", products);

  const isDefaultFilter = JSON.stringify(pfilter) === JSON.stringify(defaultFilterData);

  const getProduct = async () => {
    try {
      const { data } = await axios.post(
        product_list_,
        {filterData: pfilter},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(data.data)
    
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };
    
  useEffect(()=>{
    if(!isDefaultFilter){
      getProduct()
    } 
  },[pfilter])


 
  return (
    <div className="md:grid grid-cols-8 gap-8">
    <Filter />
     <div className="col-span-6">
       <div className="max-w-[1400px] mx-auto px-4 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mb-4 gap-3 md:gap-6">
        {
            products.map((item,i)=>{
                return <ProductCard key={i} card_data={item}/>

            })
        }
       </div>
     </div>
   </div>
  );
};

export default CampaignClient;

