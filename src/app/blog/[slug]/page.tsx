import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { getServerToken } from "@/helpers/server/server_function";
import { blog_details } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";

import styles from './blog_page.module.css';

import React from "react";
import toast from "react-hot-toast";
import TableOfContents from "./TableOfContents";

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
  

  const formate_date = (item:string)=>{
    const create_d = new Date(item);
    return create_d.toDateString();
  }

const simpal_data = [
  {
    title: "Amazon Great Freedom Festival 2024: Get Ready to Save Big",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sem sed felis malesuada malesuada. Sed vel sem sed felis malesuada malesuada.",
    slug:''
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sem sed felis malesuada malesuada. Sed vel sem sed felis malesuada malesuada.",
    slug:''
  },
  {
    title: "Great Freedom Festival 2024: Get Ready to Save Big",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sem sed felis malesuada malesuada. Sed vel sem sed felis malesuada malesuada.",
    slug:''
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sem sed felis malesuada malesuada. Sed vel sem sed felis malesuada malesuada.",
    slug:''
  },
  {
    title: "Lorem ipsum dolor sit amet, consectetur",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sem sed felis malesuada malesuada. Sed vel sem sed felis malesuada malesuada.",
    slug:''
  },
  {
    title: "Amazon Great Freedom Festival 2024: Get Ready to Save Big",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sem sed felis malesuada malesuada. Sed vel sem sed felis malesuada malesuada.",
    slug:''
  },
]



  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[1100px] mx-auto mt-6 sm:mt-14 mb-16 p-2 xl:p-0">
          <div className="grid grid-cols-7 gap-8">
          <div className="col-span-5">
            <div className="text-gray-600 uppercase flex gap-2"><span>By: {page_data.data.writer_email}</span> / <span>{page_data.data.blog_type}</span> / <span>{formate_date(page_data.data.updatedAt)}</span></div>
            <h1 className="text-3xl font-medium mb-8 mt-2 text-secondary capitalize">{page_data.data.title}</h1>
            <Image src={page_data.data.image[0]} width={500} height={200} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="w-full max-w-[700px] mb-2 rounded-sm shadow-sm" alt={page_data.data.title} />
           
            <div className="text-base border-[1px] text-gray-700 border-gray-200 rounded-md mt-10 bg-pink-200 p-4" dangerouslySetInnerHTML={{ __html: page_data.data.short_desc }}></div>
            <div className={`${styles.blog_style} mt-16`} dangerouslySetInnerHTML={{ __html: page_data.data.desc }}>

            </div>

          </div>
          <div className="col-span-2">
          <div className="border-[1px] border-gray-600 px-2 py-3 mb-12">
              <h3 className="text-2xl text-center mb-4 font-medium text-gray-800 capitalize">Table of Contents</h3>
              <div>
              <TableOfContents  contents={page_data.data.desc}/>
              </div>
            </div>


            <div className="border-[1px] border-gray-600 px-2 py-3">
              <h3 className="text-2xl text-center mb-4 font-medium text-gray-800 capitalize">Latest Articles</h3>
              <div>
                {simpal_data.map((item,i) => (
                  <div key={i+1} className="mb-4 flex justify-start gap-1">
                   <span>{i+1}.</span> <Link href={`/blog/${item.slug}`} className="text-base font-normal text-gray-700  hover:text-gray-900 hover:underline line-clamp-2">{item.title}</Link>
                  </div>
                ))}
              </div>
              <div className="p-[0.5px] my-6 w-full bg-gray-300"></div>
              <Image alt="" width={100} height={100} sizes="100vw" src={page_data.data.image} className="w-full h-auto rounded-sm" />
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

export default BlogDetail;

{/* <div className="mb-10">
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
          </div> */}