"use client";

import React from "react";
import BlogCard from "../small_card/BlogCard";
import Link from "next/link";

const HomeBlog = () => {
  
  const fleah_data = [
    {
      id: 1,
      image: "https://i.imgur.com/x8AGeNt.jpeg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
    {
      id: 1,
      image: "https://i.imgur.com/x8AGeNt.jpeg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
    {
      id: 1,
      image: "https://i.imgur.com/x8AGeNt.jpeg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
    {
      id: 1,
      image: "https://i.imgur.com/x8AGeNt.jpeg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-2 mb-4 relative">
      <div className="absolute right-4 top-[-44px]">
        <Link
          href="/blog"
          className="text-white bg-primary py-2 px-5 sm:px-8 rounded-sm uppercase font-medium text-[11px] sm:text-sm hover:shadow-sm hover:rounded-md duration-200"
        >
          View All
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
        {fleah_data.map((item, i) => (
         <BlogCard key={i}/>
        ))}
      </div>
    </div>
  );
};

export default HomeBlog;
