import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";

import React from "react";
import Filter from "./_filter";
import BlogCard from "@/components/small_card/BlogCard";
import Image from "next/image";
import axios from "axios";
import { get_All_blogs } from "@/utils/api_url";


export interface IBlogCard {
  title: string;
  slug: string;
  image: string;
  short_desc: string;
  createdAt: string;
  views: string;
}

const fetchData = async () => {
  try {
    const { data } = await axios.get(get_All_blogs);
    if (!data.success) {
      throw new Error("Failed to fetch data");
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

const AllBlog = async () => {
  const fetchBlogData = await fetchData();
 const blogs: IBlogCard[] = await fetchBlogData.data;
 const pagination = await fetchBlogData.pagination;

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto  mb-16 p-2 xl:p-0">
          <div>
            <Image
              style={{ objectFit: "contain" }}
              sizes="100vw"
              priority
              unoptimized
              src="https://i.imgur.com/ml6BQvo.jpeg"
              alt="blog"
              height={200}
              width={500}
              className="h-auto w-full"
            />
          </div>
          <div className="md:grid grid-cols-8 gap-8 mt-20">
            <Filter />
            <div className="col-span-6">
              <div className="max-w-[1400px] mx-auto px-4 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mb-4 gap-3 md:gap-6">
                {blogs.map((item, i) => (
                  <BlogCard item={item} key={i}/>
                ))}
              </div>
            </div>
          </div>
        </section>

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default AllBlog;
