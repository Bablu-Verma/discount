"use client";

import { RootState } from "@/redux-store/redux_store";
import { logout } from "@/redux-store/slice/userSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface LayoutProps {
  children: ReactNode;
}

export interface IAdmin {
  name: string;
  email: string;
}

const DashboardUI: React.FC<LayoutProps> = ({ children }) => {
  const [activeSidebar, setActiveSidebar] = useState(true);
  const admin_data = useSelector(
    (state: RootState) => state.user.user
  ) as IAdmin | null;

  const pathname = usePathname();
  const dispatch = useDispatch();

  const togelsidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  const admin_logOut = () => {
    setTimeout(() => {
      dispatch(logout());
      window.location.href = "/login";
    }, 1000);
  };

  const url_path = [
    {
      id: 1,
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 2,
      name: "Add Product",
      url: "/admin/dashboard/add-product",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 3,
      name: "Add Category",
      url: "/admin/dashboard/add-category",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 4,
      name: "All Product ",
      url: "/admin/dashboard/all-products",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 5,
      name: "All Category ",
      url: "/admin/dashboard/all-category",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 6,
      name: "Order List ",
      url: "/admin/dashboard/all-order",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 7,
      name: "Users",
      url: "/admin/dashboard/all-user",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 8,
      name: "Contact Us Data",
      url: "/admin/dashboard/contact-us/list",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
    {
      id: 9,
      name: "Add Blog",
      url: "/admin/dashboard/add-blog",
      icon: "fas fa-tachometer-alt",
      submenu: [],
    },
  ];

  return (
    <section className="h-screen w-[100%] max-w-[1400px] m-auto">
      <div className="flex justify-between">
        {activeSidebar && (
          <aside className="max-w-[350px] w-[25%] overflow-hidden duration-150 h-screen">
            <div className="overflow-y-auto max-h-screen">
              <h1 className="text-2xl font-semibold text-center  text-secondary_color py-3 mb-3 select-none">
                <span className="text-primary">Admin</span>Board
              </h1>
              <div>
                <Link
                  href="/"
                  className=" block mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in"
                >
                  <div className="px-5 py-2 rounded-lg">
                    <i
                      className={`fa-solid fa-link text-lg text-secondary_color`}
                    ></i>
                    <span className="secondary_color text-sm font-normal ml-4">
                      Website
                    </span>
                  </div>
                </Link>
                {url_path.map((item, i) => {
                  if (item.url == pathname) {
                    return (
                      <div
                        key={i}
                        className="mb-3 px-6 border-l-4 border-primary cursor-pointer duration-100 ease-in"
                      >
                        <div className="bg-primary px-5 py-2 rounded-lg">
                          <i className={`${item.icon} text-lg text-light`}></i>
                          <span className="text-light text-sm font-normal ml-4">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <Link
                        href={item.url}
                        key={i}
                        className=" block mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in"
                      >
                        <div className="px-5 py-2 rounded-lg">
                          <i
                            className={`${item.icon} text-lg text-secondary_color`}
                          ></i>
                          <span className="secondary_color text-sm font-normal ml-4">
                            {item.name}
                          </span>
                        </div>
                      </Link>
                    );
                  }
                })}
                <button
                  onClick={admin_logOut}
                  className="px-6 border-l-4 border-l-transparent cursor-pointer duration-100 ease-in"
                >
                  <div className="px-5 py-2 rounded-lg">
                    <i className="fa-solid fa-power-off text-lg text-red-600"></i>
                    <span className="secondary_color text-sm font-normal ml-4">
                      Logout
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </aside>
        )}

        <div className="w-full px-2">
          <header className="flex w-full justify-between items-center py-2 shadow-md">
            <button
              onClick={togelsidebar}
              className="p-3 rounded-full bg-white hover:bg-gray-100 duration-100 justify-center flex items-center"
            >
              <i className="fas fa-bars text-xl text-secondary_color"></i>
            </button>

            <h4
              title={admin_data?.email}
              className="text-sm capitalize cursor-pointer text-secondary_color font-semibold leading-normal"
            >
              {admin_data?.name}{" "}
              <span className="text-sm text-secondary_color font-normal leading-none">
                (Admin)
              </span>
            </h4>
          </header>
          <div className="w-full h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardUI;
