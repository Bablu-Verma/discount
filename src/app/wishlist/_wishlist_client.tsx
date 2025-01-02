"use client";

import { ICampaign } from "@/model/CampaignModel";
import { RootState } from "@/redux-store/redux_store";
import { wishlist_product_remove_ } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface IWCProps {
  item_: ICampaign[];
}

const Wishlist_client: React.FC<IWCProps> = ({ item_ }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const [itemList, setItemList] = useState(item_);

  const remover_data = async (id: number) => {
    try {
      const { data } = await axios.post(
        wishlist_product_remove_,
        { campaign_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the state to remove the item from the list
      setItemList((prevList) => prevList.filter((item) => item.campaign_id !== id));

      toast.success("Product removed successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error Product remove ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to remove product. Please try again.");
      }
    }
  };

  return (
    <>
      {itemList.map((item, i) => {
        return (
          <div
            key={item.campaign_id}
            className="grid grid-cols-10 w-full mt-3 py-2 text-base font-normal mb-2 hover:bg-gray-200 items-center px-4 rounded"
          >
            <span className="text-sm text-secondary">{i + 1}.</span>
            <div className="col-span-3 flex items-center pr-3">
              <Image
                src={item.img[0]}
                className="h-12 w-12 aspect-auto "
                width={20}
                sizes="100vw"
                height={20}
                alt={item.title}
              />
              <span className="mx-3 line-clamp-1 text-sm text-secondary">{item.title}</span>
            </div>
            <span className="col-span-2 text-sm capitalize line-clamp-1">{item.brand}</span>
            <span className="text-base font-medium capitalize line-clamp-1">₹{item.cashback}</span>
            <span>
              {item.active ? (
                <b className="text-green-700 text-sm ">Active</b>
              ) : (
                <b className="text-red-700 text-sm ">Expire</b>
              )}
            </span>
            <Link
              href={`/campaign/${item.slug}`}
              className="text-primary hover:text-blue-500 text-sm hover:underline"
            >
              More Info
            </Link>
            <div className="flex justify-center">
              <button
                className="bg-red-200 hover:bg-red-300 py-1 px-5 rounded-md text-secondary inline-block"
                title="Remove this item"
                onClick={() => remover_data(item.campaign_id)}
              >
                <i className="fa-solid fa-trash text-sm"></i>
              </button>
            </div>
          </div>
        );
      })}
      {itemList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base text-gray-600 mb-3">No products in your wishlist.</p>
          <Link
            href="/campaign"
            className="text-primary hover:text-blue-500 text-sm hover:underline"
          >
            Explore more campaigns
          </Link>
        </div>
      )}
    </>
  );
};

export default Wishlist_client;
