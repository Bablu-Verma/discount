"use client";


import StoreCard from "@/components/small_card/StoreCard";


import { useState } from "react";

export default  function StoreClient({page_data}) {
  const [openTab, setOpenTab] = useState("100_STORE");  // ALL_STORE, 100_STORE

  return (
    <>
      <div className="">
        <div className="grid grid-cols-2 gap-[1px] mb-10 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenTab("100_STORE")}
            className={` ${
              openTab == "100_STORE" ? "bg-gray-600" : "bg-gray-300"
            } py-1.5 text-white capitalize text-center text-lg`}
          >
            Up to 100% STORE
          </button>
          <button
            type="button"
            onClick={() => setOpenTab("ALL_STORE")}
            className={` ${
              openTab == "ALL_STORE" ? "bg-gray-600" : "bg-gray-300"
            } py-1.5 text-white capitalize text-center text-lg`}
          >
            ALL STORE
          </button>
        </div>
        {openTab == "100_STORE" &&
          page_data &&
          page_data.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {page_data.map((item, i) => {
                return <StoreCard item={item} key={i} />;
              })}
            </div>
          )}
        {openTab == "ALL_STORE" &&
          page_data &&
          page_data.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {page_data.map((item, i) => {
                return <StoreCard item={item} />;
              })}
            </div>
          )}
      </div>
    </>
  );
}
