"use client"

import React, { ReactNode, useState } from 'react'


interface LayoutProps {
  children: ReactNode;
}


const DashboardUI:React.FC<LayoutProps> = ({children}) => {

  const [activeSidebar, setActiveSidebar] = useState(true);

const togelsidebar = () => {
  setActiveSidebar(!activeSidebar);
};


  return (
    <section className="h-screen w-[100%] max-w-[1400px] m-auto">
      <div className="flex justify-between">
        {activeSidebar && (
          <aside className="max-w-[350px] w-[25%] overflow-hidden duration-150 h-screen">
            <div className="overflow-y-auto max-h-screen">
              <h1 className="text-3xl font-semibold text-center text-secondary_color py-3 mb-3 select-none">
                <span className="text-primary">Dash</span>Stack
              </h1>
              <div>
                <div className="mb-3 px-6 border-l-4 border-primary cursor-pointer duration-100 ease-in">
                  <div className="bg-primary px-5 py-3 rounded-lg">
                    <i className="fas fa-shop text-lg text-light"></i>
                    <span className="text-light text-lg font-normal ml-4">
                      Dashboard
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fas fa-table-cells-large text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Products
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fa-regular fa-heart text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Favorites
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fa-regular fa-message text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Inbox
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fa-solid fa-list-check text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Order List
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="pl-12 text-gray-500 text-base font-semibold">
                Pages
              </h2>
              <div className="pt-3">
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fas fa-table-cells-large text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Pricing
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fa-regular fa-heart text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Calender
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fa-regular fa-message text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      To Do
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-3 rounded-lg">
                    <i className="fa-solid fa-list-check text-lg text-secondary_color"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Contact
                    </span>
                  </div>
                </div>
                <div className="mb-3 px-6 border-l-4 border-l-transparent cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-2 rounded-lg">
                    <i className="fa-solid fa-gear text-lg text-green-500"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Settings
                    </span>
                  </div>
                </div>
                <div className="px-6 border-l-4 border-l-transparent cursor-pointer duration-100 ease-in">
                  <div className="px-5 py-2 rounded-lg">
                    <i className="fa-solid fa-power-off text-lg text-red-600"></i>
                    <span className="secondary_color text-lg font-normal ml-4">
                      Logout
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        <div className="w-full px-2">
          <header className="flex w-full justify-between items-center py-2">
            <button
              onClick={togelsidebar}
              className="p-3 rounded-full bg-white hover:bg-gray-100 duration-100 justify-center flex items-center"
            >
              <i className="fas fa-bars text-xl text-secondary_color"></i>
            </button>
            <div className="w-[40%] max-w-[600px] overflow-hidden relative rounded-full shadow-md">
              <input
                name="search"
                placeholder="search"
                id="header_search"
                value=""
                type="text"
                className="w-full text-base py-1.5 pl-3 pr-10 rounded-full text-light_gray_color outline-none font-sans focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-b-gray-300 duration-100"
              />
              <button className="absolute right-4 top-2 justify-center flex items-center">
                <i className="fa-solid fa-magnifying-glass text-lg text-secondary_color"></i>
              </button>
            </div>

            <div className="flex justify-between items-center gap-5">
              <button className="relative p-2 rounded-full duration-100 justify-center flex items-center">
                <span className="absolute top-1 right-1 bg-green-600 h-4 text-[11px] flex justify-center items-center w-4 rounded-full text-secondary_color">
                  12
                </span>
                <i className="fa-regular fa-bell text-2xl text-secondary_color"></i>
              </button>
              <select
                id="language"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-[120px] py-1 px-2.5"
              >
                <option value="language" selected disabled>
                  language
                </option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
              <div className="flex gap-3 justify-end items-center w-[180px]">
                <span className="h-10 rounded-full overflow-hidden inline-block w-10">
                  <img
                    src="https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classNamey-users-icon.png"
                    alt=""
                    className="w-full"
                  />
                </span>
                <div className="pr-1 items-center">
                  <h4 className="text-sm text-secondary_color leading-normal">
                    Moni roy
                  </h4>
                  <span className="text-sm text-secondary_color font-semibold leading-none">
                    Admin
                  </span>
                </div>
                <button className="p-0.5">
                  <i className="fa-solid fa-angle-down text-secondary_color text-xl"></i>
                </button>
              </div>
            </div>
          </header>
          <div className="w-full h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardUI