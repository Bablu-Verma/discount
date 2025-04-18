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
  // const [itemList, setItemList] = useState(item_);
  const dispatch = useDispatch();
  const wishlist = useSelector((state:RootState) => state.wishlist.items);

  useEffect(()=>{
    dispatch(addItem(item_));
  },[])



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
      console.log('data', data)
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
      {wishlist.map((item, i) => {
        return (
          <div
            key={i}
            className="grid grid-cols-8 w-full mt-3 py-2 text-base font-normal mb-2 hover:bg-gray-200 rounded-md  items-center px-4 "
          >
            <span className="text-sm text-secondary">{i + 1}.</span>
            <div
             
              className="col-span-3 flex items-center pr-3"
            >
              <Image
                src={item.product_img}
                className="h-12 w-12 aspect-auto "
                width={20}
                sizes="100vw"
                height={20}
                alt={item.title}
              />
              <span className="mx-3 line-clamp-1 text-secondary  text-base">{item.title}</span>
              </div>
            <Link href={`/store/${item.store.slug}`} className="col-span-2 text-base capitalize line-clamp-1">{item.store.name}</Link>
            <span className="text-base font-medium capitalize text-green-500 line-clamp-1">Up to ₹{item.calculated_cashback.toString()}</span>
        
              <span>
              <Link
              href={`/campaign/${item.product_slug}`}
              className="text-primary mr-10 hover:text-blue-500 text-sm hover:underline"
            >
              More Info
            </Link>
              <button
                className="p-1 rounded-md text-red-300 hover:text-red-700 inline"
                title="Remove this item"
                onClick={() => remover_data(item._id ?? 0)}
              >
                <i className="fa-solid fa-trash text-base"></i>
              </button>
              </span>
          </div>
        );
      })}
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
