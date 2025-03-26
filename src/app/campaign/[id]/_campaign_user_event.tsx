"use client";

import { ICampaign } from "@/model/CampaignModel";
import { IUser } from "@/model/UserModel";
import { RootState } from "@/redux-store/redux_store";
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface campaign__event_props {
  campaign_data: ICampaign;
}

const Campaign_user_event: React.FC<campaign__event_props> = ({
  campaign_data,
}) => {
  const [opentc, setOpentc] = useState<boolean>(false);



const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;



 

  return (
    <>
      <div className="rounded grid grid-cols-2 border-2 border-gray-200  mb-5 my-12  p-3 ">
        <button
          onClick={() => setOpentc(true) }
          type="button"
          className="flex justify-center gap-2 sm:gap-5 items-center py-5 border-r-2 cursor-pointer"
        >
          <i className="fa-solid fa-note-sticky text-red-500 text-xl sm:text-4xl"></i>
          <h4 className="text-secondary text-sm sm:text-base font-normal">
            Tream and Condition
          </h4>
        </button>
      </div>

      {opentc && (
        <div className="fixed top-0 left-0 w-full h-screen  flex justify-center items-center z-50 bg-[rgba(0,0,0,.3)] ">
          <div className=" md:max-w-[700px] max-h-[700px] overflow-y-auto bg-white p-5 rounded-md">
            <h3 className="text-xl font-medium mb-3 text-secondary select-none">
              Tream and Condition
            </h3>

            <div dangerouslySetInnerHTML={{ __html: campaign_data?.t_and_c || ''}}>
            </div>
            <button
              onClick={() => setOpentc(false)}
              className="mt-2 underline hover:text-red-500"
            >
              I am read this Tream and Condition
            </button>
          </div>
        </div>
      )}

     
    </>
  );
};

export default Campaign_user_event;
