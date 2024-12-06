"use client"

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import ProductCard from "@/components/small_card/ProductCard";
import Image from "next/image";
import React, { useState } from "react";
import Filter from "./_filter";

const Campaign = () => {
  


  const fleah_data = [
    {
      id: 1,
      image: "/images/flash/flash1.jpg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
    {
      id: 1,
      image: "/images/flash/flash1.jpg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
    {
      id: 1,
      image: "/images/flash/flash1.jpg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
    {
      id: 1,
      image: "/images/flash/flash1.jpg",
      title: "Flash Sale: Off 50% on All Swimsuits",
      description:
        "Summer Sale for all swim suits and free delivery - off 50%!",
      link: "/flash-sale",
    },
  ];

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto mt-14 mb-16 p-2 xl:p-0">
          <div className="md:grid grid-cols-8">
           <Filter />
            <div className="col-span-6">
              <div className="max-w-[1400px] mx-auto px-4 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mb-4 gap-3 md:gap-6">
                {fleah_data.map((item, i) => (
                  <ProductCard />
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

export default Campaign;

// https://www.shutterstock.com/image-vector/colorful-game-controller-icon-vector-600nw-2489844309.jpg
// https://www.shutterstock.com/image-vector/joystick-gamepad-game-console-controller-600nw-2137131861.jpg
// https://banner2.cleanpng.com/20231111/ibg/transparent-cartoon-characters-colorful-cartoon-style-video-game-controller-1711023988390.webp
