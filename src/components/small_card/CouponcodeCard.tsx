"use client";

import { ICoupon } from "@/model/CouponModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CouponcodeCardProps {
  item: ICoupon;
}
const CouponcodeCard: React.FC<CouponcodeCardProps> = ({ item }) => {
  console.log(item);
  return (
    <Link
      href={`/coupons/${item._id}`}
      className="shadow-sm rounded rounded-tr-3xl rounded-bl-3xl relative hover:shadow-lg duration-200 border-[1px] border-gray-200 py-8 px-7  bg-[#fff]"
    >
      <Image
        src={item.store.store_img}
        alt={item.store.name}
        width={70}
        height={50}
        className="rounded-md ml-1 mb-3"
      />
      <h2 className="text-lg text-secondary font-semibold tracking-wide mb-3">
        Flat ₹{item.discount} Off
      </h2>
      <h4 className="text-base text-green-500 font-medium line-clamp-2 capitalize">
        {item.title}
      </h4>

      <div className="bg-gray-100 border-dashed relative border-2 h-12 mt-8 rounded-md flex justify-end items-center p-2  ">
        <span className="absolute -top-[1px] -left-[1px] w-[96%] bg-primary h-12 rounded-md text-base text-white items-center font-medium tracking-wide flex justify-center">
          Show Coupon
        </span>
        <p className="text-base font-medium">00000</p>
      </div>
    </Link>
  );
};

export default CouponcodeCard;
