"use client";

import React from "react";

import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";

interface SellingProps {
  best_product:ICampaign[]
}
const BestSalling:React.FC<SellingProps > = ({best_product}) => {
  

  return (
    <div className="max-w-6xl mx-auto lg:px-4 pt-2 mb-4 relative">
      <div className="absolute right-4 top-[-44px]">
        <a
          href="/campaign"
          className="text-blue-300  py-2 px-5 sm:px-8 rounded-sm capitalize font-medium text-sm hover:shadow-sm duration-200"
        >
          View All
        </a>
      </div>

      <div className="max-w-6xl mx-auto  pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
        {best_product?.map((item, i) => (
          <ProductCard card_data={item} key={i} />
        ))}
      </div>
    </div>
  );
};

export default BestSalling;
