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
  const [openForm, setOpenForm] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    whatsapp_number: "",
    subject: "",
    message: "",
    location: "",
  });
  const router = useRouter();

const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;



  const input_handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!formData.whatsapp_number) {
      toast.error("Please enter whatsapp/Phone number");
      return;
    }
    if (formData.whatsapp_number.length != 10) {
      toast.error("Please enter a valid whatsapp/Phone number");
      return;
    }
   
    if (!formData.subject) {
      toast.error("Please add your subject");
      return;
    }
    if (!formData.location) {
      toast.error("Please add your Full address");
      return;
    }
    if (!formData.message) {
      toast.error("Please add your message");
      return;
    }

    try {
      const { data } = await axios.post(
        "",
        {
          subject: formData.subject,
          user_message: formData.message,
          location: formData.location,
          whatsapp_number: formData.whatsapp_number,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(data.message);
      setFormData({
        location: "",
        subject: "",
        message: "",
        whatsapp_number: "",
      });
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

        <button
          onClick={() => user ? setOpenForm(true) : router.push('/login')}
          type="button"
          className="flex justify-center gap-2 sm:gap-5 py-5 items-center cursor-pointer"
        >
          <i className="fa-solid fa-circle-exclamation text-green-500 text-xl sm:text-4xl"></i>
          <h4 className="text-secondary text-sm sm:text-base font-normal">
            Need Healp..
          </h4>
        </button>
      </div>

      {opentc && (
        <div className="fixed top-0 left-0 w-full h-screen  flex justify-center items-center z-50 bg-[rgba(0,0,0,.3)] ">
          <div className=" md:max-w-[700px] max-h-[700px] overflow-y-auto bg-white p-5 rounded-md">
            <h3 className="text-xl font-medium mb-3 text-secondary select-none">
              Tream and Condition
            </h3>

            <div dangerouslySetInnerHTML={{ __html: campaign_data?.t_and_c }}>
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

      {openForm && (
        <div className="fixed top-0 left-0 w-full h-screen  flex justify-center items-center z-50 bg-[rgba(0,0,0,.3)] ">
          <div className=" md:max-w-[700px] max-h-[700px] overflow-y-auto bg-white p-5 pt-7 rounded-md relative">
            <h3 className="text-xl font-medium mb-3 text-secondary select-none">
              Need Healp..
            </h3>
            <p className="text-base text-gray-800 leading-7 tracking-wide">
              {campaign_data?.title}
            </p>

            <hr className="leading-4 mt-5" />
            <button
              onClick={() => setOpenForm(false)}
              className="mt-2 underline hover:text-red-500 absolute right-4 top-2"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>

            <form onSubmit={SubmitForm} className="col-span-3 mt-6">
              <div className="grid grid-cols-2 gap-5 w-full">
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"  
                    value={user?.name}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    readOnly
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Campaign ID
                  </label>
                  <input
                    type="text"
                    value={`#${campaign_data?.product_id}`}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    placeholder="Campaign Id"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 w-full">
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    value={user?.email}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    placeholder="Email"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Whatsapp Number / Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    maxLength={10}
                    value={formData.whatsapp_number}
                    onChange={input_handle}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    placeholder="Whatsapp Number / Number"
                  />
                </div>
                
              </div>
              <div className="mb-5">
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Subject (Problem)
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={input_handle}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  placeholder="Subject"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Address
                </label>

                <textarea
               id="location"
               name="location"
                value={formData.location}
                onChange={input_handle}
                className="w-full px-3 py-2 text-sm border min-h-32 border-gray-300 rounded-md focus:outline-none focus:border-primary"
                placeholder="Your Full Address"
              ></textarea>
              </div>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={input_handle}
                className="w-full px-3 py-2 text-sm border min-h-60 border-gray-300 rounded-md focus:outline-none focus:border-primary"
                placeholder="Your Message"
              ></textarea>
              <div className="flex justify-end w-full mt-4">
                <button
                  type="submit"
                  className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Campaign_user_event;
