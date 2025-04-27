"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";
import axios, { AxiosError } from "axios";
import { home_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

interface DealsProps {
  best_product: ICampaign[];
}

const Deals: React.FC<DealsProps> = ({ best_product }) => {
  const [openTab, setOpenTab] = useState<"hot_deals" | "live_offer">("hot_deals");
  const [page, setPage] = useState(1);
  const [deals, setDeals] = useState<ICampaign[]>(best_product);

  const token = useSelector((state: RootState) => state.user.token);

  const getDeals = async (reset: boolean = false) => {
    try {
      const { data } = await axios.post(
        home_api,
        { page, tabtype: openTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newDeals = data.data?.offer_deal || [];
      setDeals((prev) => (reset ? newDeals : [...prev, ...newDeals]));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching deals:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    if (page > 1) getDeals();
  }, [page]);


  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
      <div className="flex px-2 justify-start items-center py-4 gap-6">
        <button
          onClick={() => setOpenTab("hot_deals")}
          className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary ${openTab === "hot_deals" ? "text-white bg-primary" : "text-primary bg-white"
            }`}
        >
          Hot Deals
        </button>
        <button
          onClick={() => setOpenTab("live_offer")}
          className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary ${openTab === "live_offer" ? "text-white bg-primary" : "text-primary bg-white"
            }`}
        >
          Live Deals
        </button>
      </div>

      <div className="grid px-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-4">
        {deals.map((item, i) => (
          <ProductCard key={item._id || i} card_data={item} />
        ))}
      </div>

      <div className="flex justify-center items-center pt-10">
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary"
        >
          More Deals
        </button>
      </div>
    </div>
  );
};

export default Deals;
