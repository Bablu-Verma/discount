'use client'


import { ICoupon } from "@/model/CouponModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CouponcodeCardProps {
  item: ICoupon;
}
const CouponcodeCard: React.FC<CouponcodeCardProps> = ({ item }) => {
  
  return (
    <Link href={`/coupons/${item._id}`} className="shadow rounded-md overflow-hidden relative hover:shadow-lg duration-200 group bg-[#fff]">
      <div className="pb-2 pt-1 px-2">
       <h3>{item.title}</h3>
      </div>
    </Link>
  );
};

export default CouponcodeCard;
