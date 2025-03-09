

import React from "react";
import BlogCard from "../small_card/BlogCard";
import Link from "next/link";
import { IBlogCard } from "@/app/blog/page";


const HomeBlog: React.FC<{blogs: IBlogCard[]}> = ({blogs}) => {
  
  return (
    <div className="max-w-[1400px] mx-auto pt-2 mb-4 relative">
      <div className="absolute right-4 top-[-44px]">
        <Link
          href="/blog"
          className="text-white bg-primary py-2 px-5 sm:px-8 rounded-sm uppercase font-medium text-[11px] sm:text-sm hover:shadow-sm hover:rounded-md duration-200"
        >
          View All
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-2 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
        {blogs.map((item, i) => (
         <BlogCard item={item} key={i}/>
        ))}
      </div>
    </div>
  );
};

export default HomeBlog;
