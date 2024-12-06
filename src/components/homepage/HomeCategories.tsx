"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, A11y } from "swiper/modules";

import CategorieCard from "../small_card/CategorieCard";

const HomeCategories = () => {


  const swiperRef = useRef<any>(null);

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
      <div className="max-w-[1400px] mx-auto px-4 pt-2 mb-4 relative">
        <div className="absolute right-4 top-[-30%] hidden sm:inline-block">
          <button className="m-2 text-gray-700 opacity-80 hover:opacity-100" onClick={() => swiperRef.current?.slidePrev()}>
            <i className="fa-solid fa-arrow-left text-base md:text-xl"></i>
          </button>
          <button className="m-2 text-gray-700 opacity-80 hover:opacity-100"  onClick={() => swiperRef.current?.slideNext()}>
            <i className="fa-solid fa-arrow-right text-base md:text-xl"></i>
          </button>
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={2.2}
          breakpoints={{
            520: {
              slidesPerView: 3.2,
             
            },
            768: {
              slidesPerView: 4.1,
            
            },
            1024: {
              slidesPerView: 5.1,
              
            },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={() => console.log("slide change")}
          className="home_flash_"
        >
          {fleah_data.map((item, i) => (
            <SwiperSlide key={i}>
              <CategorieCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
     
    </>
  );
};

export default HomeCategories;
