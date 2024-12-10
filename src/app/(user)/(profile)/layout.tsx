"use client"

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/redux-store/slice/userSlice";
import { usePathname } from 'next/navigation'
import Loader_ from "@/components/Loader_";

interface LayoutProps {
  children: ReactNode;
}

export interface User {
  name: string;
  email: string;
  role: string
}


const ProfileLayout: React.FC<LayoutProps> =  ({ children }) => {
  const user_data = useSelector((state: RootState) => state.user.user) as User | null;

  const dispatch = useDispatch();
  const pathname = usePathname();


  const logOut_user = () =>{
    setTimeout(() =>{
      dispatch(logout())
      window.location.href = '/login';
    },1000)
  }
  
  if (!user_data) {
    return (
     <Loader_ />
    );
  }


  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="max-w-[1400px] mx-auto mt-14 mb-16">
        <section>
          <div className="flex justify-between mb-16">
           
            <h4 className="text-base pl-2">
              Welcome! <span className="text-primary capitalize">{user_data?.name || "Guest"}</span>
            </h4>
          </div>

          <div className="my-12 px-2 flex gap-[2%] justify-between ">
            <div className=" hidden md:block w-[18%] capitalize">
              <h2 className="text-xl font-semibold mb-2 text-dark">
                <i className="text-base text-dark fa-solid fa-link"></i> Links
              </h2>
              <Link href='/profile-edit' className={`text-sm ${pathname == '/profile-edit'? 'text-primary':'text-gray-500'} hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block`}>
                Profile
              </Link>
              <Link href='/address' className={`text-sm ${pathname == '/address'? 'text-primary':'text-gray-500'} hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block`}>
                Address
              </Link>
              <Link href='/order-list' className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block">
                All Order
              </Link>
              <Link href='/cart' className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block">
                Cart
              </Link>
              <Link href='/wishlist' className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block">
                Wishlist
              </Link>
              {
                user_data.role == 'admin' &&   <Link href='/admin/dashboard' className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5 block">
                Admin
              </Link>
              }
            
              <button onClick={logOut_user}  className="text-sm text-red-600 font-medium hover:pl-1 cursor-pointer border-t-2  duration-200 my-1 mt-5 py-1 block">
              <i className="fa-solid fa-right-from-bracket"></i>  Logout
              </button>
            </div>
            <div className="w-full md:w-[80%] shadow rounded md:bg-gray-200 p-6 md:p-8">
              {children}
            </div>
          </div>
        </section>
      </main>
      <BottomToTop />
      <Footer />
    </>
  );
};

export default ProfileLayout;
