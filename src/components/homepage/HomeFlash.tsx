"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../small_card/ProductCard";
import ProductCardTwo from "../small_card/ProductCardTwo";
import ProductCardThree from "../small_card/ProductCardThree";
import { ICampaign } from "@/model/CampaignModel";

interface IfleasProp {
  featured: ICampaign[]
}

const Flash:React.FC<IfleasProp> = ({featured}) => {
  const swiperRef = useRef<any>(null);


  return (
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
      slidesPerView={1}
      breakpoints={{
        520: {
          slidesPerView: 1,
          
        },
        768: {
          slidesPerView: 2,
          
        },
        1024: {
          slidesPerView: 2,
        
        },
      }}
      
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onSlideChange={() => console.log("slide change")}
      className="home_flash_"
    >
      {featured.map((item, i) => (
        <SwiperSlide key={i}>
          <ProductCardTwo card_data={item}/>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
  );
};

export default Flash;
