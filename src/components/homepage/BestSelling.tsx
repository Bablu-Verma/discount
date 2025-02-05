"use client";

import React from "react";

import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";

interface SellingProps {
  best_product:ICampaign[]
}
const BestSalling:React.FC<SellingProps > = ({best_product}) => {
  

  return (
    <div className="max-w-[1400px] mx-auto lg:px-4 pt-2 mb-4 relative">
      <div className="absolute right-4 top-[-44px]">
        <a
          href=""
          className="text-white bg-primary py-2 px-5 sm:px-8 rounded-sm uppercase font-medium text-[11px] sm:text-sm hover:shadow-sm hover:rounded-md duration-200"
        >
          View All
        </a>
      </div>

      <div className="max-w-[1400px] mx-auto px-2 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
        {best_product?.map((item, i) => (
          <ProductCard card_data={item} key={i} />
        ))}
      </div>
    </div>
  );
};

export default BestSalling;
