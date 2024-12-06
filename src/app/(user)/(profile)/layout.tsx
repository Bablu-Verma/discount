import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import React, { ReactNode } from "react";


interface LayoutProps {
  children: ReactNode;
}

const ProfileLayout: React.FC<LayoutProps> =  ({ children }) => {

  

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="max-w-[1400px] mx-auto mt-14 mb-16">
        <section>
          <div className="flex justify-between mb-16">
           
            <h4 className="text-base pl-2">
              Welcome! <span className="text-primary">Bablu Verma</span>
            </h4>
          </div>

          <div className="my-12 px-2 flex gap-[2%] justify-between ">
            <div className=" hidden md:block w-[18%] capitalize">
              <h2 className="text-xl font-semibold mb-2 text-dark">
                <i className="text-base text-dark fa-solid fa-link"></i> Links
              </h2>
              <p className="text-sm text-primary hover:pl-1 cursor-pointer duration-200 my-1 py-0.5">
                Profile
              </p>
              <p className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5">
                Address
              </p>
              <p className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5">
                All Order
              </p>
              <p className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5">
                Cancellations
              </p>
              <p className="text-sm text-gray-500 hover:pl-1 cursor-pointer duration-200 my-1 py-0.5">
                Wishlist
              </p>
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
