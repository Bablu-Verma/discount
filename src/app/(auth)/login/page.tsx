"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { login } from "@/redux-store/slice/userSlice";
import { login_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface IUserData {
  email: string;
  password: string;
}

const Login = () => {
  const [userData, setUserData] = useState<IUserData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch()

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

    if (!userData.password) {
      toast.error("Password is required");
      return;
    }

    if (userData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    call_db();
  };

  const call_db = async () => {
    try {

      const { data } = await axios.post(
        login_api,
        {
          email: userData.email,
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUserData({
        email: "",
        password: "",
      });

      // console.log("user login successfully:", data);
      toast.success("Login success!");


      dispatch(login({ user: data.user, token: data.token }));


      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

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
    if (name === "email" || name === "password") {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const passwordToggle = (): void => {
    setShowPassword(!showPassword);
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
            <div className="w-full max-w-[400px]">
              <h2 className="text-3xl font-semibold b-3">Login your account</h2>
              <p className="text-sm font-normal mb-10">
                Shop your favorite product
              </p>

              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  name="email"
                  onChange={textChange}
                  placeholder="Your email"
                  className="w-full bg-gray-100 px-3 py-2 outline-none text-base text-black border-b-2 border-gray-500"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    value={userData.password}
                    name="password"
                    onChange={textChange}
                    placeholder="Secure Password"
                    className="w-full bg-gray-100 px-3 py-2 outline-none text-base text-black border-b-2 border-gray-500"
                  />

                  <span
                    onClick={passwordToggle}
                    className="absolute top-3 right-3 cursor-pointer opacity-75 hover:opacity-95"
                  >
                    {showPassword ? (
                      <i className="fa-regular fa-eye text-dark text-xl"></i>
                    ) : (
                      <i className="fa-regular fa-eye-slash text-dark text-xl"></i>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-between gap-2 my-10">
                <button
                  onClick={SubmitData}
                  className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[200px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
                >
                  Submit
                </button>
                <Link href='/forgot_password' className="bg-white text-gray-800 text-base font-normal duration-200 p-2 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
              <p className="text-sm font-thin text-center">
                I don't have an account?
                <Link
                  href="/signup"
                  className="text-blue-400 font-normal hover:underline"
                >
                  {" "}
                  SignUp{" "}
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

export default Login;
