"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";



const MainHeader = () => {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const user_data = useSelector((state: RootState) => state.user);
  const pathname = usePathname();

  const userlogin = user_data.token? true : false;
  const isAdmin = user_data.user?.role === "admin"? true : false;

  const showtoggle = () => {
    setToggleMenu(!toggleMenu);
  };

  console.log(user_data)
  

  return (
    <nav className="border-b-2 border-gray-200">
      <div className="max-w-[1400px] m-auto py-3 flex justify-between items-center px-4">
        <h3 className="font-semibold text-black text-2xl md:text-3xl font-mono select-none">
          Discount
        </h3>
        <ul className="hidden lg:flex justify-center select-none">
          <li className="mx-1">
            <Link
              className="font-medium duration-200 px-2 text-primary hover:text-gray-900"
              href="/"
            >
              Home
            </Link>
          </li>
          <li className="mx-1 relative">
            {/* <span className="absolute bottom-4 right-[-4px] text-[8px] py-[1px] px-[4px] text-white rounded bg-primary">
              New
            </span> */}
            <Link
              href="/campaign"
              className="text-gray-700 font-medium duration-200 px-2 hover:text-gray-900"
            >
              Campaign
            </Link>
          </li>
          <li className="mx-1">
            <Link
              href="/contact-us"
              className="text-gray-700 font-medium duration-200 px-2 hover:text-gray-900"
            >
              Contact
            </Link>
          </li>
          <li className="mx-1">
            <Link
              href="about"
              className="text-gray-700 font-medium duration-200 px-2 hover:text-gray-900"
            >
              About
            </Link>
          </li>
          {userlogin && (
            <li className="mx-1">
              <Link
                href="/profile-edit"
                className="text-gray-700 font-medium duration-200 px-2 hover:text-gray-900"
              >
                profile
              </Link>
            </li>
          )}
        </ul>

        <div className="flex justify-center items-center">
          {pathname != "/search" && (
            <Link
              href="/search"
              className=" relative mr-7 hidden lg:block md:min-w-[350px] min-w-[200px] w-[25%] rounded-sm overflow-hidden cursor-pointer"
            >
              <input
                type="text"
                id="search"
                name="search"
                readOnly
                placeholder="What are you looking for"
                className="w-full bg-gray-200 py-1.5 px-3 pr-6 outline-none border-gray-200  text-sm font-normal text-gray-950 border-2"
              />
              <button
                disabled
                type="button"
                className="absolute right-2 top-[6px]"
              >
                <i className="fa-solid fa-search"></i>
              </button>
            </Link>
          )}
          <Link
            href={userlogin ? "/wishlist" : "/login"}
            className="select-none text-primary p-1 px-1.5 mr-3 hover:bg-gray-100 relative flex justify-center items-center rounded"
          >
            <i className="fa-regular fa-heart text-xl"></i>
          </Link>
          {userlogin ? (
            <Link
              href="/cart"
              className="select-none text-gray-600 p-1 relative group"
            >
              <span className="absolute bottom-5 left-7 text-[11px] py-[1px] px-[4px] text-white rounded bg-green-700">
                2
              </span>
              <i className="fa-solid fa-cart-shopping text-xl group-hover:text-primary duration-150"></i>
            </Link>
          ) : (
            <Link
              href="/login"
              className="select-none text-secondary p-1 px-1.5 mr-3 hover:bg-gray-100 relative flex justify-center items-center rounded"
            >
              <i className="fa-solid text-xl fa-user"></i>
            </Link>
          )}

          <button
            onClick={showtoggle}
            className="lg:hidden ml-6 p-2 text-gray-700 w-[30px] flex justify-center items-center hover:text-black"
          >
            <i className="fa-solid fa-bars text-xl" id="menu_icon"></i>
          </button>
        </div>
        {toggleMenu && (
          <div
            id="mobile-menu"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            className="fixed top-[0%] w-full z-[990] left-0 lg:hidden "
          >
            <div className="bg-white max-w-[500px] p-4 pr-8 h-screen relative pt-12">
              <button onClick={showtoggle} className="absolute top-3 right-5">
                <i className="fa-solid fa-times text-xl  text-gray-700"></i>
              </button>
              {
                pathname != "/search" &&  <Link href='/search' className="relative mb-7 lg:hidden inline-block w-full rounded-sm overflow-hidden">
                <input
                  type="text"
                  id="search"
                  name="search"
                  readOnly
                  placeholder="What are you looking for"
                  className="w-full bg-gray-200 py-1.5 px-3 pr-6 outline-none border-gray-200 text-sm font-normal text-gray-950 border-2"
                />
                <button type="button" disabled className="absolute right-2 top-[6px]">
                  <i className="fa-solid fa-search"></i>
                </button>
              </Link>
              }
              <div>
              <h2 className="text-lg pl-2 mb-2 text-secondary font-medium"><span className="pr-4">Link</span> <i className="fa-solid fa-caret-down"></i></h2>
              <ul className="select-none border-[1px] border-gray-200 rounded-lg p-2">
              <li className="mx-1 my-1 hover:pl-2 duration-150">
                  {
                    userlogin ? <Link
                    href="/profile-edit"
                    className="text-gray-700 font-normal pl-2  block"
                  >
                    Profile
                  </Link> : <Link
                    href="/login"
                    className="text-gray-700 font-normal pl-2  block"
                  >
                    Login
                  </Link>
                  }
                  
                </li>
                <li className="mx-1 my-1 hover:pl-2 duration-150">
                  <Link
                    className="text-gray-700 font-normal pl-2  block"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="mx-1 my-1 relative hover:pl-2 duration-150">
                  {/* <span className="absolute bottom-3 left-[90px] text-[8px] py-[1px] px-[4px] text-white rounded bg-primary">
                    New
                  </span> */}
                  <Link
                    href=""
                    className="text-gray-700 font-normal pl-2  block"
                  >
                    Campaign
                  </Link>
                </li>
                <li className="mx-1 my-1 hover:pl-2 duration-150">
                  <Link
                    href=""
                    className="text-gray-700 font-normal pl-2  block"
                  >
                    Contact
                  </Link>
                </li>
                <li className="mx-1 my-1 hover:pl-2 duration-150">
                  <Link
                    href=""
                    className="text-gray-700 font-normal pl-2  block"
                  >
                    About
                  </Link>
                </li>
              </ul>
              </div>
              <div className="mt-6">
              <h2 className="text-lg pl-2 mb-2 text-secondary font-medium"><span className="pr-4">Category</span> <i className="fa-solid fa-caret-down"></i></h2>
              <ul className="select-none border-[1px] border-gray-200 rounded-lg p-2">
                <li className="mx-1 my-1 hover:pl-2 duration-150">
                  <Link
                    className="text-gray-700 font-normal pl-2  block"
                    href=""
                  >
                    Incurance
                  </Link>
                </li>
                <li className="mx-1 my-1 hover:pl-2 duration-150">
                  <Link
                    href=""
                    className="text-gray-700 font-normal pl-2  block"
                  >
                    Health
                  </Link>
                </li>
              </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainHeader;
