import { getTimeAgo } from "@/helpers/client/client_function";
import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProp {
  card_data: ICampaign;
}

const ProductCard: React.FC<CardProp> = ({ card_data }) => {

  const timeAgo = getTimeAgo(card_data.createdAt);

  return (
    <div className="shadow overflow-hidden rounded-lg relative duration-200 border-[1px] border-transparent hover:shadow-lg hover:border-gray-100 hover:border-[1px] bg-[#fff]">
      {card_data?.product_tags && card_data.product_tags.includes("new") ? (
        <span className="absolute top-2 left-2 bg-green-600 py-[1px] px-5 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
          New
        </span>
      ) : card_data?.product_tags && card_data.product_tags.includes("hot") ? (
        <span className="absolute top-2 left-2 bg-red-600 py-[1px] px-5 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
          Hot
        </span>
      ) : null}
      <div className=" overflow-hidden relative p-3 flex justify-center items-center">
        <Image
          src={card_data?.img_array[0]}
          className="w-full  h-[150px] rounded-t-md"
          height={200}
          width={200}
          alt="shose"
        />
      </div>

      <div className="p-3 pt-0">
        <div className="flex justify-between item-center pb-2">
          <span className="capitalize font-normal text-sm text-gray-500">
            {/* <i className="fa-solid fa-store mr-1"></i> */}
            <i className="fa-solid fa-shop mr-1"></i>
            {card_data?.store}
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
            ₹{card_data?.actual_price}
          </span>
          <small className="text-red-500 text-sm py-.5 px-2 ml-4 border-[1px] border-red-500 ">
            ₹{card_data?.calculated_cashback} Off
          </small>
        </div>
        <div className="flex justify-between mt-4 mb-1 items-center">
          <Link
            style={{ background: "rgb(204 43 82 / 52%)" }}
            href={
              card_data.slug_type === "INTERNAL"
                ? `/campaign/${card_data?.product_slug}`
                : card_data.redirect_url
            }
            className="select-none bg-white rounded-md text-secondary font-medium py-1 px-8 text-sm duration-200 ease-in-out
           "
          >
            Get offer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
