"use client";

import BlogCard from "@/components/small_card/BlogCard";
import React, { useEffect, useState } from "react";
import { IBlog } from "@/model/BlogModal";
import { IBCategory } from "@/model/BlogCategoryModel";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { MainHeading } from "@/components/Heading";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { get_All_blogs } from "@/utils/api_url";
import axios, { AxiosError } from "axios";

interface CBProps {
  blog: IBlog[];
  category: IBCategory[];
}

const ClientBlog: React.FC<CBProps> = ({ blog, category }) => {
  const [menu, setMenu] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [bloglist, setBloglist] = useState<IBlog[]>(blog);

  const token = useSelector((state: RootState) => state.user.token);

  const getCblogs = async (page: number, acategory: string | null = '') => {
    try {
      const { data } = await axios.post(
        get_All_blogs,
        { page, category: acategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (page === 1) {
        setBloglist(data.data.blogs);  // new category selected → replace blogs
      } else {
        setBloglist(prev => [...prev, ...data.data.blogs]); // load more → append
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching blogs:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  // Handle category change
  useEffect(() => {
    if (activeCategory !== null) {
      getCblogs(1, activeCategory);
    }
  }, [activeCategory]);

  // Handle page change
  useEffect(() => {
    if (page > 1) {
      getCblogs(page, activeCategory);
    }
  }, [page]);

  const handleCategoryClick = (id: string) => {
    setPage(1);
    setActiveCategory(id);
  };

  return (
    <>
      {/* Category Selector */}
      <div className="px-2.5 py-8 flex justify-start items-center gap-8">
        {category.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => handleCategoryClick(item._id)}
              className="rounded-full border-4 border-primary duration-200 ease-in-out hover:border-gray-400 cursor-pointer"
            >
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
            className="rounded-full border-4 w-20 h-20 flex justify-center items-center duration-200 ease-in-out border-gray-400 cursor-pointer"
          >
            <HiDotsHorizontal className="text-gray-600 text-4xl" />
          </button>
          <h4 className="text-center text-lg text-secondary capitalize">See all</h4>
        </div>
      </div>

      {/* Blog List */}
      <div>
        <MainHeading title="Latest Blog" link={null} />
        <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-6 md:gap-6">
          {bloglist.map((item, i) => (
            <BlogCard item={item} key={i} />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center items-center pt-10">
          <button
            onClick={() => setPage(prev => prev + 1)}
            className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary"
          >
            More Blogs
          </button>
        </div>
      </div>

      {/* Modal for All Categories */}
      {menu && (
        <div
          style={{ background: "rgba(0,0,0,0.3)" }}
          className="fixed z-[10] top-0 left-0 right-0 bottom-0 flex justify-center items-center"
        >
          <div className="bg-white relative rounded-lg shadow-md min-h-[500px] w-full max-w-6xl">
            <button
              title="close"
              className="absolute -top-9 right-1 bg-slate-100 p-1 rounded-full"
              onClick={() => setMenu(false)}
            >
              <IoMdClose className="text-lg text-primary" />
            </button>
            <div className="p-8 flex justify-start items-center gap-8 flex-wrap">
              {category.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => {
                      setMenu(false);
                      handleCategoryClick(item._id);
                    }}
                    className="rounded-full border-4 border-primary duration-200 ease-in-out hover:border-gray-400 cursor-pointer"
                  >
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
