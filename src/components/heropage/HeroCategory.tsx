import Link from "next/link";
import React from "react";

const HeroCategory = () => {
  return (
    <div className="px-4 py-2 bg-gray-100 rounded hidden lg:block col-span-1">
      <ul>
        <li className="py-1">
          <Link
            href="/category/jhg"
            className="text-gray-700 font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
            Woman's Fashion
          </Link>
        </li>
        <li className="py-1">
          <Link
            href=""
            className="text-gray-700 font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
            Man's Fashion
          </Link>
        </li>
        <li className="py-1">
          <Link
            href=""
            className="text-gray-700 font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
            Electronic
          </Link>
        </li>
        <li className="py-1">
          <Link
            href=""
            className="text-gray-700 font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
            Home & Lifestyle
          </Link>
        </li>
        <li className="py-1">
          <Link
            href=""
            className="text-gray-700 font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
            Medicine
          </Link>
        </li>
        <li className="py-1">
          <Link
            href=""
            className="text-gray-700 font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
            Baby Toy's
          </Link>
        </li>
        <li className="py-1">
          <Link
            href=""
            className="text-gray-700 font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
            Health & Beauty
          </Link>
        </li>
       
        <li className="py-1">
          <Link
            href="/category"
            className="text-primary font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
          <i className="fa-solid fa-angle-right"></i> All Category
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeroCategory;
