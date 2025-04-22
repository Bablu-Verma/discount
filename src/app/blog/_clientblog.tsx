"use client";

import BlogCard from "@/components/small_card/BlogCard";

import React, { useState } from "react";
// import Filter from './_filter'
import { IBlog } from "@/model/BlogModal";
import { IBCategory } from "@/model/BlogCategoryModel";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";



interface CBProps {
  blog: IBlog[];
  category: IBCategory[];
}

const ClientBlog: React.FC<CBProps> = ({ blog, category }) => {
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className=" px-2.5 py-8 flex justify-start items-center gap-8">
        {category &&
          category.length > 0 &&
          category.map((item, i) => (
            <div>
              <button className="rounded-full border-4 border-primary  duration-200 ease-in-out   hover:border-gray-400 cursor-pointer  ">
                <Image
                  alt=""
                  sizes="100vw"
                  className="w-20 h-20 rounded-full"
                  src={item.imges[0]}
                  width={20}
                  height={20}
                />
              </button>
              <h4 className="text-center text-lg text-secondary capitalize">
                {item.name}
              </h4>
            </div>
          ))}
        <div>
          <button
            onClick={() => setMenu(true)}
            className="rounded-full border-4 w-20 h-20 flex justify-center items-center duration-200 ease-in-out  border-gray-400 cursor-pointer  "
          >

          <HiDotsHorizontal className="text-gray-600 text-4xl" />
          </button>
          <h4 className="text-center text-lg text-secondary capitalize">
            See all
          </h4>
        </div>
      </div>
      <div className=" ">
        <h3 className="text-xl font-medium mb-6 mt-2 text-secondary capitalize">
          Latest Blog
        </h3>
        <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {blog?.map((item: IBlog, i) => (
            <BlogCard item={item} key={i} />
          ))}
        </div>
      </div>
      {menu && (
        <div style={{background:'rgba(0,0,0,0.3)'}} className="fixed z-[10] top-0 left-0 right-0 bottom-0 flex justify-center items-center ">
          <div className="bg-white relative rounded-lg shadow-md min-h-[500px] w-full max-w-6xl">
            <button title="close" className='absolute -top-9 right-1 bg-slate-100 p-1  rounded-full' onClick={()=>setMenu(false)}><IoMdClose className="text-lg text-primary" /></button>
            <div className="  p-8 flex justify-start items-center gap-8">
              {category &&
                category.length > 0 &&
                category.map((item, i) => (
                  <div>
                    <button className="rounded-full border-4 border-primary  duration-200 ease-in-out   hover:border-gray-400 cursor-pointer  ">
                      <Image
                        alt=""
                        sizes="100vw"
                        className="w-20 h-20 rounded-full"
                        src={item.imges[0]}
                        width={20}
                        height={20}
                      />
                    </button>
                    <h4 className="text-center text-lg text-secondary capitalize">
                      {item.name}
                    </h4>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientBlog;
