import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProp {
  card_data:ICampaign
}


const ProductCard:React.FC<CardProp> = ({card_data}) => {
  return (
    <div  className="shadow rounded-md overflow-hidden relative hover:shadow-lg duration-200 group">
      {/* <span className="absolute top-2 left-2 bg-red-600 py-[2px] px-2 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
        -40%
      </span> */}
      <span className="absolute top-2 left-2 bg-green-600 py-[2px] px-2 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
        New
      </span>
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        {/* <button className="text-gray-800 hover:text-primary">
          <i className="fa-regular fa-heart text-xl"></i>
        </button> */}
        <button className="text-gray-800 hover:text-primary" title="Click to More Info">
          <i className="fa-regular fa-circle-question text-xl"></i>
        </button>
        {/* <button className="text-gray-800 hover:text-primary">
          <i className="fa-regular fa-eye text-xl"></i>
        </button>
        <button className="text-gray-800 hover:text-primary">
          <i className="fa-solid fa-trash text-xl"></i>
        </button> */}
      </div>
      <div className="max-h-[230px] overflow-hidden relative">
        <Image
          src={card_data?.img[0]}
          className="w-full h-[180px]"
          height={200}
          width={200}
          alt="shose"
        />
        <Link href={`/campaign/${card_data?.slug}`} className="select-none w-full bg-primary text-center  block text-white font-normal absolute bottom-[-100px] z-10 group-hover:bottom-0 duration-200 py-1 text-base">
          View This Offer
        </Link>
      </div>

      <div className="pb-2 pt-1 px-2">
        <h4 className="text-gray-700 font-medium text-base py-1 capitalize line-clamp-2">
         {card_data?.title}
        </h4>
        <div className="flex justify-between items-center">
        <div>
          <strong className="text-primary text-xl mr-3 mb-1">₹{card_data?.offer_price}/-</strong>
          <span className="text-gray-600 font-medium line-through">₹{card_data?.price}</span>
        </div>
        <span className="capitalize text-sm text-secondary">
          {card_data?.brand}
        </span>
        </div>
        <div>
          <div><i className="fa-regular fa-clock"></i>10 min</div>
          <div><i className="fa-regular fa-eye"></i>10 view</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
