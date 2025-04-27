"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import { IUser } from "@/common_type";
import logo from "../../../public/logo_.png";
import { GiTwoCoins } from "react-icons/gi";
import SearchAnimation from "../SearchAnimation";











const MainHeader = () => {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const token_ = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const summary = useSelector((state: RootState) => state.cashbackSummary.summary)
  const userlogin = token_ ? true : false;

  const showtoggle = () => {
    setToggleMenu(!toggleMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {

        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);



  return (
    <nav
      className={`border-b-2 border-gray-200 z-50 bg-white sticky top-0 transition-transform duration-500 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div className="max-w-6xl m-auto py-1 flex justify-between items-center max-lg:px-4">
        <Link href="/">
          {/* <Image
            src={logo}
            className="w-[125px] lg:w-[140px] h-auto"
            alt="logo"
          /> */}
          <h1 className="text-secondary py-2 text-3xl font-semibold tracking-wider">Bachat<span className="text-primary">Jar</span></h1>
        </Link>
        <ul className="hidden lg:flex justify-center select-none">
          <li className="mx-1">
            <Link
              className={`${pathname == "/" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
              href="/"
            >
              Home
            </Link>
          </li>

          <li className="mx-1">
            <Link
              className={`${pathname == "/store" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
              href="/store"
            >
              Store
            </Link>
          </li>

          <li className="mx-1">
            <Link
              href="/coupons"
              className={`${pathname == "/coupons" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
            >
              Coupons
            </Link>
          </li>
          <li className="mx-1">
            <Link
              href="/blog"
              className={`${pathname == "/blog" ? "text-primary" : "text-gray-700"
                } font-medium duration-200 px-2 hover:text-gray-900`}
            >
              Blog
            </Link>
          </li>
        </ul>

        <div className="flex justify-center items-center">
          {pathname != "/search" && (
            <Link
              href="/search"
              className=" relative mr-7 hidden lg:block md:min-w-[350px] min-w-[200px] w-[25%] rounded-sm overflow-hidden cursor-pointer"
            >
             <SearchAnimation />
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
            className="select-none text-primary p-1 px-1.5  hover:bg-gray-100 flex justify-center items-center rounded relative"
          >
            <i className="fa-regular fa-heart text-xl"></i>
            {userlogin && wishlist.length > 0 && (
              <span className="w-4 h-4 justify-center flex items-center rounded-full bg-green-300 absolute top-0 -right-2 text-[12px] text-secondary ">
                {wishlist.length}
              </span>
            )}
          </Link>

          {userlogin ? (
            <>

              <div className="py-.5 lg:py-[2px] pl-2 pr-3 sm:pl-3 sm:pr-4 rounded-full border-[1px] border-primary flex justify-center gap-3 ml-1 sm:ml-3 items-center">
                <GiTwoCoins style={{ color: '#FFD700' }} className="text-lg sm:text-2xl" />
                <span className="text-base sm:text-lg text-primary font-medium">₹{summary?.total_cb ?? 0}</span>
              </div>


              <Link
                href="/profile"
                className={` font-medium rounded-full duration-200 mx-2 lg:ml-5 shadow cursor-pointer hover:opacity-80`}
              >
                <Image
                  src={
                    user?.profile ||
                    "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                  }
                  alt={user?.email || "User profile"}
                  height={100}
                  width={100}
                  className="w-8 h-8 lg:w-9  lg:h-9 rounded-full"
                />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="select-none text-secondary p-1 px-1.5 mx-3 hover:bg-gray-100 relative flex justify-center items-center gap-1 rounded"
            >
              <i className="fa-solid text-xl fa-user"></i>
              <span className="text-sm hidden lg:block text-secondary font-medium">
                Login/SignUp
              </span>
            </Link>
          )}

          <button
            onClick={showtoggle}
            className="lg:hidden p-2 text-gray-700 w-[30px] flex justify-center items-center hover:text-black"
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
              {pathname != "/search" && (
                <Link
                  href="/search"
                  className="relative mb-7 lg:hidden inline-block w-full rounded-sm overflow-hidden"
                >
                
                   <SearchAnimation />
                  <button
                    type="button"
                    disabled
                    className="absolute right-2 top-[6px]"
                  >
                    <i className="fa-solid fa-search"></i>
                  </button>
                </Link>
              )}

             
              <div>
                <h2 className="text-lg pl-2 mb-2 text-secondary font-medium">
                  <span className="pr-4">Redirect</span>{" "}
                  <i className="fa-solid fa-caret-down"></i>
                </h2>
                <ul className="select-none border-[1px] border-gray-200 rounded-lg p-2">
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    {!userlogin && <Link
                        href="/login"
                        className="text-gray-700 font-normal pl-2  block"
                      >
                        Login / Register
                      </Link> }
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  block"
                      href="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  block"
                      href="/store"
                    >
                      Store
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  block"
                      href="/coupons"
                    >
                      Coupons
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  block"
                      href="/about-su"
                    >
                      About Us
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  block"
                      href="/blog"
                    >
                      blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <h2 className="text-lg pl-2 mb-2 text-secondary font-medium">
                  <span className="pr-4">Help & Support</span>{" "}
                  <i className="fa-solid fa-caret-down"></i>
                </h2>
                <ul className="select-none border-[1px] border-gray-200 rounded-lg p-2">
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  block"
                      href="/contact-us"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li className="mx-1 my-1 hover:pl-2 duration-150">
                    <Link
                      className="text-gray-700 font-normal pl-2  block"
                      href="/faq"
                    >
                      FAQ
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
