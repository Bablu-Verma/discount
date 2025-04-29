"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { scraper_live_deal_admin_api } from "@/utils/api_url";


const LiveDeal = () => {

    const token = useSelector((state: RootState) => state.user.token);
    const [scrape_loading, setScrapeLoading] = useState(false)

    const scrapDeal = async () => {
        setScrapeLoading(true)
        try {
          const { data } = await axios.post(
            scraper_live_deal_admin_api,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(data)
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error("Error ", error.response?.data.message);
            toast.error(error.response?.data.message);
          } else {
            console.error("Unknown error", error);
          }
        }finally{
            setScrapeLoading(false)
        }
      };


  return (
    <div className="p-6">
    <button type="button" className="bg-green-500 w-[200px] py-2 border-2 border-green-400 rounded-lg px-5 text-secondary" onClick={scrapDeal}>{scrape_loading ?'Loading': "Scrape Live Deal"}</button>
    </div>
  );
};

export default LiveDeal;
