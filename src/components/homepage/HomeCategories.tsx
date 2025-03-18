"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import CategorieCard from "../small_card/CategorieCard";
import { ICategory } from "@/model/CategoryModel";


interface CategoryProps {
  category: ICategory[];
}

const HomeCategories: React.FC<CategoryProps> = ({category}) => {


  const swiperRef = useRef<any>(null);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-2 mb-4 relative">
        <div className="absolute right-4 top-[-30%] hidden sm:inline-block">
          <button className="m-2 text-gray-700 opacity-80 hover:opacity-100" onClick={() => swiperRef.current?.slidePrev()}>
            <i className="fa-solid fa-arrow-left text-base md:text-xl"></i>
          </button>
          <button className="m-2 text-gray-700 opacity-80 hover:opacity-100"  onClick={() => swiperRef.current?.slideNext()}>
            <i className="fa-solid fa-arrow-right text-base md:text-xl"></i>
          </button>
        </div>
        <Swiper
          spaceBetween={12}
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
          {category.map((item, i) => (
            <SwiperSlide key={i} className="my-1">
              <CategorieCard item={item}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
     
    </>
  );
};

export default HomeCategories;
