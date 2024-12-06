import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import React from "react";

const UserCart = () => {
  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto mt-14 mb-16">
          <div>
            <span>Home</span> / <span>Cart</span>
          </div>

          <div className="grid grid-cols-10 w-full mt-10 py-2 text-xl font-semibold mb-2 select-none px-4">
            <h3>S No.</h3>
            <h3 className="col-span-3">Product</h3>
            <h3 className="col-span-2">Partner</h3>
            <h3>Price</h3>
            <h3>Offer Price</h3>
            <h3>Offer Link</h3>
            <h3>Conditions</h3>
          </div>
          <div className="grid grid-cols-10 w-full mt-3 py-2 text-base font-normal mb-2 hover:bg-gray-200 items-center px-4 rounded">
            <span>1.</span>
            <div className="col-span-3 flex items-center">
              <img
                src="https://api.thechennaimobiles.com/1719121334790.webp"
                className="max-h-14 aspect-auto"
                alt=""
              />{" "}
              <span className="inline-block ml-3">Led TV 43 inch</span>
            </div>
            <span className="col-span-2">
              <a href="">Flipkart</a>
            </span>
            <span>20$</span>
            <span>15$</span>
            <a
              href="/"
              className="text-blue-600 underline"
              title="Go to partner Website"
            >
              Link To Website
            </a>
            <span>
              <b
                className="text-green-700 italic"
                title="Bye this product use link"
              >
                Active
              </b>
            </span>
          </div>
          <div className="grid grid-cols-10 w-full mt-3 py-2 text-base font-normal mb-2 hover:bg-gray-200 items-center px-4 rounded">
            <span>1.</span>
            <div className="col-span-3 flex items-center">
              <img
                src="https://api.thechennaimobiles.com/1719121334790.webp"
                className="max-h-14 aspect-auto"
                alt=""
              />{" "}
              <span className="inline-block ml-3">Led TV 43 inch</span>
            </div>
            <span className="col-span-2">
              <a href="">Flipkart</a>
            </span>
            <span>20$</span>
            <span>15$</span>
            <a
              href="/"
              className="text-blue-600 underline"
              title="Go to partner Website"
            >
              Link To Website
            </a>
            <span>
              <b className="text-red-700 italic" title="Don't bye this product">
                Expire
              </b>
            </span>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto mt-14 mb-16">
          <a href="" className="overflow-hidden inline-block w-full">
            <img src="https://i.pinimg.com/originals/74/e5/62/74e562795e6ac1e3fee61307e09c3040.jpg" alt="" className="w-full" />
          </a>
        </div>

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default UserCart;
