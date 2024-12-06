"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../small_card/ProductCard";


const Flash = () => {
  const swiperRef = useRef<any>(null);

  //  console.log(deviceWidth)


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
        <div className="absolute right-4 top-[-18%] hidden sm:inline-block">
          <button className="m-2 text-gray-700 opacity-80 hover:opacity-100" onClick={() => swiperRef.current?.slidePrev()}>
            <i className="fa-solid fa-arrow-left text-base md:text-xl"></i>
          </button>
          <button className="m-2 text-gray-700 opacity-80 hover:opacity-100"  onClick={() => swiperRef.current?.slideNext()}>
            <i className="fa-solid fa-arrow-right text-base md:text-xl"></i>
          </button>
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={1.3}
          breakpoints={{
            520: {
              slidesPerView: 2.2,
              
            },
            768: {
              slidesPerView: 3,
              
            },
            1024: {
              slidesPerView: 4,
            
            },
          }}
          
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={() => console.log("slide change")}
          className="home_flash_"
        >
          {fleah_data.map((item, i) => (
            <SwiperSlide key={i}>
              <ProductCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="max-w-[1400px] mx-auto flex justify-center text-center p-6">
        <a
          href=""
          className="text-white bg-primary py-2 px-8 rounded-sm uppercase font-medium text-sm hover:shadow-sm hover:rounded-md duration-200"
        >
          View All Products
        </a>
      </div>
    </>
  );
};

export default Flash;
