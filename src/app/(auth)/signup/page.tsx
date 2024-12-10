"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { register_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface IUserData {
  email: string;
  password: string;
  name: string;
  site_policy_conditions: boolean;
}

const Signup = () => {
  const [userData, setUserData] = useState<IUserData>({
    email: "",
    password: "",
    name: "",
    site_policy_conditions: false,
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const SubmitData = (): void => {

    if (!userData.name) {
      toast.error("Name is required");
      return;
    }
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

    if (!/[A-Z]/.test(userData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[0-9]/.test(userData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*]/.test(userData.password)) {
      toast.error(
        "Password must contain at least one special character (!@#$%^&*)"
      );
      return;
    }

    if (!userData.site_policy_conditions) {
      toast.error("Agree to site Terms & Conditions, Privacy Policy");
      return;
    }
     register_user()
  };

  const textChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const passwordToggle = (): void => {
    setShowPassword(!showPassword);
  };


  const register_user = async () => {
    try {
      const {data} = await axios.post(register_api,
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          accept_terms_conditions_privacy_policy: userData.site_policy_conditions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        })
        
        toast.success(data.message);
        setUserData({
          email: "",
          password: "",
          name: "",
          site_policy_conditions: false,
        })

        const UserRegisterInfo = {
             token:data.token,
             email:data.user.email,
             name:data.user.name,
             role:data.user.role
        }

        sessionStorage.setItem("UserRegisterInfo", JSON.stringify(UserRegisterInfo));
        setTimeout(()=>{
          router.push('/user-verify')
        },500)
    } catch (error) {
        if (error instanceof AxiosError) { 
          console.error("Error registering user", error.response?.data.message);
          toast.error(error.response?.data.message);
        } else {
          console.error("Unknown error", error);
        }
    }
  }

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <div className="max-w-[1400px] m-auto min:h-screen  pb-10 lg:pb-2 sm:grid grid-cols-2 lg:grid-cols-3 gap-8  ">
          <div className="col-span-1 lg:col-span-2">
            <img
              src="https://img.freepik.com/premium-vector/woman-red-jacket-holding-shopping-bag-with-quotsalequot-it-second-bag-her-other-hand_150234-136431.jpg"
              className="w-full h-auto max-h-screen"
              alt=""
            />
          </div>
          <div className="col-span-1 flex justify-center items-center ">
            <div className="w-full max-w-[400px]">
              <h2 className="text-3xl font-semibold b-3">Create an account</h2>
              <p className="text-sm font-normal mb-10">
                Enter your details below
              </p>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={textChange}
                  value={userData.name}
                  placeholder="Name"
                  className="w-full bg-gray-100 px-3 py-2 outline-none text-base m-  text-black border-b-2 border-gray-500 "
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={textChange}
                  value={userData.email}
                  placeholder="Your email"
                  className="w-full bg-gray-100 px-3 py-2 outline-none text-base m-  text-black border-b-2 border-gray-500 "
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    name="password"
                    onChange={textChange}
                    value={userData.password}
                    placeholder="Secure Password"
                    className="w-full bg-gray-100 px-3 py-2 outline-none text-base m-  text-black border-b-2 border-gray-500 "
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

                <div  className="flex items-center mt-3 ml-4">
                  <input
                    type="checkbox"
                    id="site_policy_conditions"
                    name="site_policy_conditions"
                    checked={userData.site_policy_conditions}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        site_policy_conditions: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="site_policy_conditions" className="select-none cursor-pointer text-sm">
                    I agree to the site's
                  </label>
                  <Link href="/terms_conditions" className="text-blue-400 hover:underline pl-1 inline-block text-sm">Terms & Conditions </Link> ,
                  <Link href="/privacy_policy" className="text-blue-400 hover:underline pl-1 inline-block text-sm"> Privacy Policy</Link>
                </div>
              </div>
              <div className="flex flex-col gap-2 my-10 ">
                <button type="button" onClick={SubmitData} className="bg-primary text-white text-base font-medium duration-200 p-2 border-[1px] border-primary rounded shadow-sm hover:shadow-2xl">
                  Create Account
                </button>
                <button className="bg-white text-gray-800 text-base font-medium duration-200 p-2 rounded border-[1px] border-gray-600 mt-4 shadow-sm hover:shadow-2xl ">
                  <i className="fa-brands fa-google"></i> Sign up with Google
                </button>
              </div>
              <p className="text-sm font-thin text-center">
                Already have account?{" "}
                <Link
                  href="/login"
                  className="text-blue-400 font-normal hover:underline"
                >
                  Login
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

export default Signup;
