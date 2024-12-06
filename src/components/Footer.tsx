import React from "react";
import UserSubscribe from "./UserSubscribe";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-2 relative grid pt-16 pb-8 gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

        <div>
          <h1 className="text-2xl font-semibold mb-4">Exclusive</h1>
          <h3 className="text-lg font-normal mb-4">Subscribe</h3>
          <p className="text-base font-thin mb-3">Get 10% off your first order</p>
          <UserSubscribe />
        </div>
        <div>
          <h3 className="text-lg font-normal mb-4">Support</h3>
          <address className="text-sm font-thin mb-3">
            Noida sector 63, <br />
            India-201301
          </address>
          <i className="text-sm font-thin mb-2 inline-block">shop.help@gmail.com</i>
          <p className="text-sm font-thin">+8768968698</p>
        </div>
        <div>
          <h3 className="text-lg font-normal mb-4">Account</h3>
          <div className="flex flex-col gap-1">
            {["My Account", "Login / Register", "Cart", "Shop", "Wishlist"].map(
              (item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-normal mb-4">Quick Link</h3>
          <div className="flex flex-col gap-1">
            {["Contact Us", "Return Policy", "Terms and Conditions", "FAQs"].map(
              (item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm font-thin hover:pl-1 duration-200 py-0.5"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-normal mb-4">Download App</h3>
          <p className="text-base font-thin mb-3">Save $3 with app new user</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="row-span-2 bg-green-400 min-h-[100px]"></div>
            <div className="bg-green-400"></div>
            <div className="bg-green-400"></div>
          </div>
          <div className="flex gap-3 pt-2">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <a
                  key={index}
                  href="#"
                  className="px-1.5 py-1 hover:pt-0.5 duration-200"
                >
                  <i className="fa-brands fa-facebook-f text-xl text-white"></i>
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="py-3 border-t-[0.5px] border-gray-400">
        <p className="text-sm font-medium text-gray-600 text-center">
          <i className="fa-regular fa-copyright"></i> Copyright Bablu 2024. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
