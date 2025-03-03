"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";


interface IUserData {
  email: string;
}

const ForgotPassword = () => {
  const [userData, setUserData] = useState<IUserData>({
    email: "",
  });

  const SubmitData = (): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData.email) {
      toast.error("Email is required");
      return;
    }

    if (!emailRegex.test(userData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    call_db();
  };

  const call_db = async () => {
    try {
      const { data } = await axios.post(
        '',
        {
          email: userData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUserData({
        email: "",
      });

      toast.success("Chack Your Register success!");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error login user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  const textChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "email") {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main>
        <div className="max-w-[1400px] m-auto min-h-screen sm:grid grid-cols-2 lg:grid-cols-3 gap-8 pb-10 md:pb-3">
          <div className="col-span-1 lg:col-span-2">
            <img
              src="https://img.freepik.com/premium-vector/woman-red-jacket-holding-shopping-bag-with-quotsalequot-it-second-bag-her-other-hand_150234-136431.jpg"
              className="w-full h-auto max-h-screen"
              alt="Woman holding shopping bags"
            />
          </div>
          <div className="col-span-1 flex justify-center items-center">
            <div className="w-full max-w-[400px] px-2">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-2 mt-4">
                Forgot your Password
              </h2>
              <p className="text-sm font-normal mb-10">
                Don't worry your accout is safe
              </p>

              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  name="email"
                  onChange={textChange}
                  placeholder="Your register email"
                  className="w-full bg-gray-100 px-3 py-2 outline-none text-base text-black border-b-2 border-gray-500"
                />
              </div>
              <div className="flex justify-between mt-6 mb-8">
                <button
                  onClick={SubmitData}
                  className="bg-primary text-white text-sm lg:text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
                >
                  Submit
                </button>
              </div>
              <p className="text-sm font-thin text-center">
                Back you? 
                <Link
                  href="/login"
                  className="text-blue-400 font-normal hover:underline"
                >
                  login
                </Link>
              </p>
            </div>
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;
