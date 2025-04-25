"use client";


import StoreCard from "@/components/small_card/StoreCard";
import { FaStore } from "react-icons/fa";

import { useState } from "react";

export default function StoreClient({ page_data }) {

  return (
    <>
      <div className="mt-4">

        <div className="flex justify-center items-center h-[200px]">
          <h1 className="text-5xl uppercase text-secondary flex gap-3 font-medium">CashBack <span className="text-primary ">Store </span> <FaStore className="text-primary" /></h1>
        </div>

        {page_data.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {page_data.map((item, i) => {
              return <StoreCard item={item} key={i} />;
            })}
          </div>
        )}

        <div className="flex justify-center items-center pt-10 ">
          <button className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary ">More Store</button>
        </div>
      </div>
    </>
  );
}
