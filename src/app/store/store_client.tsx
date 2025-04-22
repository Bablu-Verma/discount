"use client";


import StoreCard from "@/components/small_card/StoreCard";


import { useState } from "react";

export default  function StoreClient({page_data}) {

  return (
    <>
      <div className="mt-16">

        <div>
          
        </div>
       
       
      { page_data.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {page_data.map((item, i) => {
                return <StoreCard item={item} key={i} />;
              })}
            </div>
          )}
      </div>
    </>
  );
}
