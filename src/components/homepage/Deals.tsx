"use client";

import React, { useRef, useState } from "react";

import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";


interface DealsProps {
  best_product: ICampaign[]
}
const Deals: React.FC<DealsProps> = ({ best_product }) => {
  const [openTab, setOpenTab] = useState('hot_deals')

  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
      <div className="flex justify-start items-center py-4 gap-6">
      <button onClick={()=>setOpenTab('hot_deals')} className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary  ${openTab == 'hot_deals'? 'text-white bg-primary ':'text-primary bg-white'}`}>Hot Deals</button>
        <button onClick={()=>setOpenTab('live_offer')} className={`text-sm py-1 transition-all duration-300 ease-in-out px-6  rounded-full border-2 border-primary  ${openTab == 'live_offer'? 'text-white bg-primary ':'text-primary bg-white'}`}>Live Deals</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
        {best_product.length > 0 &&
          best_product.map((item, i) => (
            <ProductCard card_data={item} />
          ))}
      </div>
      <div className="flex justify-center items-center pt-10 ">
        <button className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary ">More Deals</button>
      </div>
    </div>
  );
};

export default Deals;
