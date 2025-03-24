import React from "react";
import BlogCard from "../small_card/BlogCard";
import Link from "next/link";
import { IBlogCard } from "@/app/blog/page";

const HomeBlog: React.FC<{ blogs: IBlogCard[] }> = ({ blogs }) => {
  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
      <div className="absolute right-4 top-[-33px] lg:top-[-44px]">
        <a
          href="/blog"
          className="text-primary  py-2 px-5 sm:px-8 rounded-sm capitalize font-medium text-sm hover:shadow-sm duration-200"
        >
          View All
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-2 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
        {blogs.map((item, i) => (
          <BlogCard item={item} key={i} />
        ))}
      </div>
    </div>
  );
};

export default HomeBlog;
