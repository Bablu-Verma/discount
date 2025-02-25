"use client";

import React from "react";
import { ICampaign } from "@/model/CampaignModel";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { create_order_api } from "@/utils/api_url";

interface IShopNowProps {
  page_data: ICampaign;
}
const ShopNowButton: React.FC<IShopNowProps> = ({ page_data }) => {
  const token = useSelector((state: RootState) => state.user.token);

  const shop_now = async () => {
    if (!token) {
      toast.error("You need to login to proceed");

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

    try {
      let { data } = await axios.post(
        create_order_api,
        {
          product_id: page_data.campaign_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  return (
    <button
      onClick={shop_now}
      className=" w-[180px] py-2 text-base text-center rounded-md outline-none border-none text-white  duration-200 bg-primary"
    >
      Shop Now
    </button>
  );
};

export default ShopNowButton;
