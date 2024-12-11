import Link from "next/link";
import React from "react";

const BlogCard = () => {
  return (
    <div className="shadow rounded-md overflow-hidden relative hover:shadow-lg duration-200 group">
      <span className="absolute top-2 left-2 bg-green-600 py-[2px] px-2 text-[12px] rounded-md shadow-md text-white font-medium z-20 select-none">
        New
      </span>
      <div className="max-h-[200px] overflow-hidden relative">
        <span className="w-full h-auto bg-[rgba(0,0,0,.2)] absolute top-0 left-0 bottom-0 right-0 z-10"></span>
        <img
          src="https://i.imgur.com/x8AGeNt.jpeg"
          className="w-full"
          alt="shose"
        />
      </div>
      <div className="pb-2 pt-1 px-2">
        <h4 className="text-gray-800 font-medium text-sm py-1 line-clamp-3">
          Havit HV - G63 Game pade - G63 Game pade playe
        </h4>
        <div className="flex justify-between items-center">
          <div>
          <span style={{fontSize:'14px'}} className="text-gray-500 mr-3">
            <i className="fa-regular fa-eye"></i> 90
          </span>
          <span style={{fontSize:'14px'}} className="text-gray-500">
           <i className="fa-regular fa-clock"></i> 10 Dec 2024
          </span>
          </div>
          <Link href='/blog/:jhgj' className="text-primary text-base hover:pr-1 duration-200" >Read More</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;