"use client";

import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import ProductCard from "@/components/small_card/ProductCard";
import StoreCard from "@/components/small_card/StoreCard";
import React, { useState } from "react";

const CategoryClientTab = ({ relatedProducts, relatedCoupons, relatedStore }) => {
  const [openTab, setOpenTab] = useState("Product");

  return (
    <div className="mt-16">
      <div className="grid grid-cols-3 gap-[1px] mb-10 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenTab("Product")}
          className={` ${openTab == "Product" ? 'bg-gray-600' :'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Product
        </button>
        <button
          type="button"
          onClick={() => setOpenTab("Coupons")}
          className={` ${openTab == "Coupons" ? 'bg-gray-600' :'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Coupons
        </button>
        <button
          type="button"
          onClick={() => setOpenTab("Store")}
          className={` ${openTab == "Store" ? 'bg-gray-600' :'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Store
        </button>
        
      </div>
      {openTab == "Product" &&
        relatedProducts &&
        relatedProducts.length > 0 && (
          <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((item, i) => {
              return <ProductCard card_data={item} key={i} />;
            })}
          </div>
        )}
      {openTab == "Coupons" && relatedCoupons && relatedCoupons.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {relatedCoupons.map((item, i) => {
            return <CouponcodeCard item={item} />;
          })}
        </div>
      )}
     {openTab == "Store" && relatedStore && relatedStore.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 mt-6 lg:mt-10">
          {relatedStore.map((item, i) => {
            return <StoreCard item={item} />;
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryClientTab;
