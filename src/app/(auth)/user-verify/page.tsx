"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { resend_otp_api, user_verify_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";

interface UserRegisterInfo {
  email: string;
  name: string;
  token: string;
}

const UserVerify = () => {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [userData, setUserData] = useState<UserRegisterInfo | undefined>(
    undefined
  );

  const route = useRouter();

  useEffect(() => {
    let data = sessionStorage.getItem("UserRegisterInfo");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post(
        resend_otp_api,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      const UserRegisterInfo = {
        token: data.token,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      };

      sessionStorage.setItem(
        "UserRegisterInfo",
        JSON.stringify(UserRegisterInfo)
      );

      setResendTimer(30);
      toast.success("OTP has been resent successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to resend OTP. Please try again.");
      }
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const SubmitData = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      const { data } = await axios.post(
        user_verify_api,
        {
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      console.log(data);
      toast.success("Your Email Verified!");
      setTimeout(()=>{
        route.push('/login')
      },1000)
      route.push('/login')
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error verify user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to verify");
      }
    }
  };

  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

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
            <div className="w-full max-w-[400px]">
              <h2 className="text-3xl font-semibold b-3">Verify Account</h2>
              <p className="text-sm font-normal mb-10 mt-2 text-gray-600">
                <i className="fa-regular fa-envelope text-lg text-gray-600"></i>{" "}
                Check your Email Inbox, verify your account <br />
                <span className="text-secondary font-medium">
                  {userData && userData.email}
                </span>
              </p>

              <div className="flex flex-col gap-4">
                <OtpInput
                  value={otp}
                  onChange={handleOtpChange}
                  numInputs={4}
                  shouldAutoFocus={true}
                  containerStyle={"verify_input_container"}
                  inputStyle={"verify_input"}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <div className="mt-6">
                <span className="text-sm font-normal w-10 inline-block">
                  {resendTimer}s
                </span>
                <button
                  className="text-sm underline ml-2"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  style={{
                    opacity: resendTimer > 0 ? 0.5 : 1,
                    cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Resend OTP
                </button>
              </div>
              <div className="my-10">
                <button
                  onClick={SubmitData}
                  className="bg-primary text-white text-base font-medium duration-800 p-1.5 min-w-[240px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default UserVerify;
