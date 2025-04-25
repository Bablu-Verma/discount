"use client";

import React, { useRef } from "react";

import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCardThree from "../small_card/ProductCardThree";

interface SellingProps {
  best_product:ICampaign[]
}
const BestSalling:React.FC<SellingProps > = ({best_product}) => {
  
const swiperRef = useRef<any>(null);
// console.log("Home data log", best_product);

  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
    {/* <div className="absolute right-4 top-[-28%] hidden sm:inline-block">
      <button
        className="m-2 text-gray-700 opacity-80 hover:opacity-100"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <i className="fa-solid fa-arrow-left text-base md:text-xl"></i>
      </button>
      <button
        className="m-2 text-gray-700 opacity-80 hover:opacity-100"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <i className="fa-solid fa-arrow-right text-base md:text-xl"></i>
      </button>
    </div> */}
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        520: {
          slidesPerView: 1.2,
        },
        768: {
          slidesPerView: 2.5,
        },
        1024: {
          slidesPerView: 3.3,
        },
      }}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onSlideChange={() => console.log("slide change")}
      className="home_flash_"
    >
      {best_product.length > 0 &&
        best_product.map((item, i) => (
          <SwiperSlide key={i}>
            <ProductCardThree card_data={item} />
          </SwiperSlide>
        ))}
    </Swiper>
  </div>
  );
};

export default BestSalling;
