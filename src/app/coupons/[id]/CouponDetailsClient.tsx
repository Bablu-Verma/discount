"use client";

import Image from "next/image";
import React, { useState } from "react";

const CouponDetailsClient = ({ page_data }) => {
  const [showCode, setShowCode] = useState(false);

  const handle_user_click = async () => {
    await navigator.clipboard.writeText(page_data.code);
    setShowCode(!showCode);
  };

  return (
    <div className="max-w-[700px] m-auto shadow-sm rounded rounded-tr-3xl rounded-bl-3xl relative hover:shadow-lg duration-200 border-[1px] border-gray-200 py-8 px-7  bg-[#fff]">
      <div className="flex justify-between items-end">
        <Image
          src={page_data.store.store_img}
          alt={page_data.store.name}
          width={70}
          height={50}
          className="rounded-md ml-1 mb-3"
        />
      </div>
      <h2 className="text-xl text-secondary font-semibold tracking-wide mb-3">
        Flat ₹{page_data.discount} Off
      </h2>
      <h4 className="text-base text-green-500 font-medium line-clamp-2 capitalize">
        {page_data.title}
      </h4>

      <div
        className={`bg-gray-100 border-dashed relative border-2 h-12 mt-8 rounded-md flex ${
          showCode ? "justify-center" : "justify-end"
        } items-center p-2`}
      >
        {showCode ? (
          <span className="absolute -top-[1px] -left-[1px] w-[45%] md:w-[30%] bg-gray-500 h-12 rounded-md text-base text-white items-center font-medium tracking-wide flex justify-center">
            Coppied
          </span>
        ) : (
          <span
            onClick={handle_user_click}
            className="absolute -top-[1px] -left-[1px] w-[96%] bg-primary h-12 rounded-md text-base text-white items-center font-medium tracking-wide flex justify-center"
          >
            Show Coupon
          </span>
        )}

        <p
          className={`${
            showCode ? "text-center ml-24 md:ml-20" : "text-base"
          } font-medium`}
        >
          {showCode ? page_data.code : "00000"}
        </p>
      </div>
    </div>
  );
};

export default CouponDetailsClient;
