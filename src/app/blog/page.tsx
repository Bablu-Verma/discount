import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { get_All_blogs } from "@/utils/api_url";
import ClientBlog from "./_clientblog";
import { getServerToken } from "@/helpers/server/server_function";
import blogbanner from "../../../public/blog_home.svg";
import Link from "next/link";

const fetchData = async (token: string) => {
  try {
    const { data } = await axios.post(get_All_blogs, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data.success) {
      throw new Error("Failed to fetch data");
    }
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

const AllBlog = async () => {
  const token = await getServerToken();
  const fetchBlogData = await fetchData(token);

  const { blogs, blog_type, f_blog, category } = fetchBlogData;

  console.log(f_blog);

  return (
    <>
    
      <MainHeader />
      <main className="pt-3">
        {/* <div className="max-w-6xl mx-auto  mb-16">
          <Image
            sizes="100vw"
            priority
            src={blogbanner}
            alt="blog"
            height={200}
            width={500}
            className="h-40 object-cover lg:h-auto w-full"
          />
        </div> */}
        <section className="max-w-6xl mx-auto  mb-5 p-2 xl:p-0">
          <div className="grid grid-cols-2 gap-4 border-b-[1px] pb-14 border-b-gray-200">
            <div className="pt-20 pr-5">
              <small className="text-primary uppercase text-base mb-3">
                FEATURED
              </small>
              <h3 className="text-3xl leading-4 line font-medium mb-6 mt-2 text-secondary capitalize">{f_blog.title}</h3>
              <div
                className="text-base line-clamp-6 text-gray-700  "
                dangerouslySetInnerHTML={{ __html: f_blog.short_desc || "" }}
              ></div>
              <div className=" mt-14">
              <Link className="text-sm bg-primary rounded-sm text-light px-5 py-2" href={`/blog/${f_blog?.slug}`} >Read More</Link>
              </div>
              
            </div>
            <Image
              height={200}
              width={500}
              className="w-[100%] h-auto"
              alt={f_blog.title}
              src={f_blog.image[0]}
            />
          </div>
        </section>
        <section className="max-w-6xl mx-auto  mb-16 p-2 xl:p-0">
          <ClientBlog blog={blogs} category={category} />
        </section>

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default AllBlog;
