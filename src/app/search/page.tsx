"use client"

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import { useEffect } from "react";

export default function SeatchPage() {

    useEffect(()=>{

    },[])

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="max-w-[1400px] mx-auto relative min-h-screen">
        <div className="flex items-center justify-center py-10">
          <div className="relative  w-[50%] min-w-[350px] rounded-sm overflow-hidden">
            <input
              type="text"
              id="search"
              name="search"
              autoFocus 
              placeholder="What are you looking for"
              className="w-full bg-gray-200 py-1.5 px-3 pr-6 outline-none border-gray-200 focus:border-l-primary text-sm font-normal text-gray-950 border-2"
            />
            <button type="submit" className="absolute right-2 top-[6px]">
              <i className="fa-solid fa-search"></i>
            </button>
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
