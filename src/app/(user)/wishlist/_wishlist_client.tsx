"use client";

import { ICampaign } from "@/model/CampaignModel";
import { RootState } from "@/redux-store/redux_store";
import { addItem, removeItem } from "@/redux-store/slice/wishlistSlice";
import { wishlist_product_remove_ } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface IWCProps {
  item_: ICampaign[];
}

const Wishlist_client: React.FC<IWCProps> = ({ item_ }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    dispatch(addItem(item_));
  }, [])



  const remover_data = async (id) => {
    try {
      const { data } = await axios.post(
        wishlist_product_remove_,
        { product_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );


      dispatch(removeItem(id));
      // toast.success("Product removed successfully!");
      // console.log('data', data)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((item, i) => (
          <div key={i} className="bg-white border-[1px] rounded overflow-hidden border-gray-300 ">
            <div className='relative '>
              <button
                className="text-red-400 absolute right-2 top-2 p-1 hover:text-red-700"
                title="Remove this item"
                onClick={() => remover_data(item._id ?? 0)}
              >
                <i className="fa-solid fa-trash text-lg"></i>
              </button>
              <Image
                src={item.product_img}
                className="h-28 w-full"
                width={100}
                height={100}
                sizes="100vw"
                alt={item.title}
              />
            </div>
            <div className="p-3">
              <div className="flex justify-end pt-1">
              <Link href={`/store/${item.store.slug}`} className="text-sm inline-block text-gray-600 capitalize  ">
                {item.store.name}
              </Link>
              </div>
              <p className="text-[#16171a] font-normal text-sm my-1 mb-5 capitalize line-clamp-3">{item.title}</p>
              <div className="flex items-center  justify-between gap-4 ">
                <h3 className="text-green-700 text-lg font-medium">Up to ₹{item.calculated_cashback.toString()}</h3>
                <Link
                  href={`/campaign/${item.product_slug}`}
                  className="text-primary text-nowrap text-base hover:underline"
                > Grab Now</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {wishlist.length === 0 && (
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
