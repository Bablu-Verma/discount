"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, A11y } from "swiper/modules";
import ProductCard from "../small_card/ProductCard";

const BestSalling = () => {
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
    <div className="max-w-[1400px] mx-auto px-4 pt-2 mb-4 relative">
      <div className="absolute right-4 top-[-44px]">
        <a
          href=""
          className="text-white bg-primary py-2 px-5 sm:px-8 rounded-sm uppercase font-medium text-[11px] sm:text-sm hover:shadow-sm hover:rounded-md duration-200"
        >
          View All
        </a>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
        {fleah_data.map((item, i) => (
          <ProductCard />
        ))}
      </div>
    </div>
  );
};

export default BestSalling;
