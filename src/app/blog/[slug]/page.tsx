import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { getServerToken } from "@/helpers/server/server_function";
import { blog_details } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";

import React from "react";
import toast from "react-hot-toast";

interface CategoryDetailsProps {
  params: { slug: string };
}

export const GetData = async (token: string, slug: string) => {
  try {
    let { data } = await axios.post(
      blog_details,
      {
        slug: slug,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error registering user", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

const BlogDetail = async ({ params }: CategoryDetailsProps) => {
  const token = await getServerToken();
  const awaitslug = await params;
  const slug = awaitslug.slug;

  const page_data = await GetData(token, slug);
  console.log("page_data", page_data.data);

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[800px] mx-auto mt-6 sm:mt-14 mb-16 p-2 xl:p-0">
          <div className="mb-10">
            <Image
              src={page_data.data.image}
              alt="blog-img"
              width={200}
              height={200}
              sizes="100vw"
              className="w-full"
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl text-secondary font-medium  mb-3">
              {page_data.data.title}
            </h1>
            <div className="pt-4 text-sm">{page_data.data.short_desc}</div>

            <div
              className="pt-4 text-sm"
              dangerouslySetInnerHTML={{ __html: page_data.data.desc }}
            ></div>
          </div>
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default BlogDetail;
