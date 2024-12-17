'use client';
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Autoplay, Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Banner = () => {
  const banner_data = [
    {
      image:
        "https://i.pinimg.com/originals/cd/1c/7c/cd1c7cbd61e5f596d2d59ae2ea7b3d9c.jpg",
      alt: "Banner 1",
      title: "Title 1",
      description: "Description 1",
    },
    {
      image:
        "https://i.pinimg.com/originals/cd/1c/7c/cd1c7cbd61e5f596d2d59ae2ea7b3d9c.jpg",
      alt: "Banner 2",
      title: "Title 2",
      description: "Description 2",
    },
    {
      image:
        "https://i.pinimg.com/originals/cd/1c/7c/cd1c7cbd61e5f596d2d59ae2ea7b3d9c.jpg",
      alt: "Banner 3",
      title: "Title 3",
      description: "Description 3",
    },
  ];

  return (
    <div className="rounded col-span-5 lg:col-span-4 relative">
      <Swiper
        spaceBetween={5}
        slidesPerView={1}
       
        loop={true}
        modules={[Autoplay,Pagination, A11y]}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => ''}
        onSlideChange={() => ''}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="home_banner_"
      >
        {banner_data.map((item, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative h-[270px] rounded bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx>{`
       
      `}</style>
    </div>
  );
};

export default Banner;
