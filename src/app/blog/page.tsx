import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import React from "react";
import Image from "next/image";
import axios from "axios";
import { get_All_blogs } from "@/utils/api_url";
import ClientBlog from "./_clientblog";


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
    const { data } = await axios.post(get_All_blogs);
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
  // console.log("fetchBlogData==",fetchBlogData)
 const blogs: IBlogCard[] = fetchBlogData.data
//  const pagination = await fetchBlogData.pagination;

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main>
      <div className="max-w-[1400px] mx-auto">
            <Image
              sizes="100vw"
              priority
              unoptimized
              src="https://i.imgur.com/ml6BQvo.jpeg"
              alt="blog"
              height={200}
              width={500}
              className="h-40 object-cover lg:h-auto w-full"
            />
          </div>
        <section className="max-w-[1400px] mx-auto  mb-16 p-2 xl:p-0">
      
         <ClientBlog blog={blogs} />
        </section>

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default AllBlog;
