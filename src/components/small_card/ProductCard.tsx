import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProp {
  card_data: ICampaign;
}


const getTimeAgo = (createdAt: string | Date) => {
  const now = new Date();
  const createdDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const diffInMs = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};



const ProductCard: React.FC<CardProp> = ({ card_data }) => {
  
  const timeAgo = getTimeAgo(card_data.created_at);

  return (
    <div className="shadow overflow-hidden rounded-lg relative duration-200 border-[1px] border-transparent hover:shadow-lg hover:border-gray-100 hover:border-[1px] ">
      {
        card_data?.new ? <span className="absolute top-2 left-2 bg-green-600 py-[1px] px-5 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
        New
      </span> :  card_data?.hot && <span className="absolute top-2 left-2 bg-red-600 py-[1px] px-5 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
        Hot
      </span>
      }
      <div className=" overflow-hidden relative p-3 flex justify-center items-center">
        <Image
          src={card_data?.img[0]}
          className="w-full  h-[150px] rounded-t-md"
          height={200}
          width={200}
          alt="shose"
        />
      </div>

      <div className="p-3 pt-0">
        <div className='flex justify-between item-center pb-2'>
          <span className="capitalize font-normal text-sm text-gray-500">
            {/* <i className="fa-solid fa-store mr-1"></i> */}
            <i className="fa-solid fa-shop mr-1"></i>
            {card_data?.brand}
          </span>
          <span className="capitalize font-normal text-sm text-gray-500">
            <i className="fa-regular fa-clock mr-1"></i>
            {timeAgo}
          </span>
        </div>

        <h4
          title={card_data?.title}
          className="text-gray-700 font-normal text-sm my-1 capitalize line-clamp-2"
        >
          {card_data?.title}
        </h4>
        <div className="flex items-center mt-1">
          <strong className="text-primary text-xl mr-3 mb-1">
            ₹{card_data?.offer_price}/-
          </strong>
          <span className="text-gray-600 font-medium line-through">
            ₹{card_data?.price}
          </span>
          <small className="text-red-500 text-sm py-.5 px-2 ml-4 border-[1px] border-red-500 ">
            ₹{card_data?.cashback} Off
          </small>
        </div>
        <div className="flex justify-between mt-4 mb-1 items-center">
          <Link
            href={`/campaign/${card_data?.slug}`}
            className="select-none bg-white border-primary border-[1px] rounded-md text-primary font-medium py-1 px-8 text-sm duration-200 ease-in-out
          hover:text-white hover:bg-gradient-to-r hover:from-[#b8cbb8] hover:via-[#b465da] hover:to-[#ee609c]"
          >
            Get offer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
