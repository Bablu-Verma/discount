import BottomToTop from '@/components/BottomToTop'
import Footer from '@/components/Footer'
import MainHeader from '@/components/header/MainHeader'
import TopHeader from '@/components/header/TopHeader'
import { SubHeading } from '@/components/Heading'
import BestSalling from '@/components/homepage/BestSelling'
import ProductCard from '@/components/small_card/ProductCard'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

const Wishlist = () => {
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
    <TopHeader />
    <MainHeader />
    <main className="">
    <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-between items-end mb-4 relative"
      >
        <h2
          className="text-2xl md:text-3xl font-semibold text-gray-700 capitalize pr-5 md:pr-10 gap-10"
        >
          Wishlist(6)
        </h2>
        <a
          href=""
          className="text-gray-700 bg-white py-2 px-5 sm:px-8 rounded capitalize font-medium text-[11px] border-2 border-gray-400 sm:text-sm hover:shadow-sm hover:rounded-md duration-200"
          >Move All To Bag</a>
      </div>

      <div
        className="max-w-[1400px] mx-auto px-4 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6"
      >
        
             {fleah_data.map((item, i) => (
                <ProductCard />
             ))}
        
      </div>

      <SubHeading title="Today's" />
     
      <BestSalling />


      <div className="max-w-[1400px] mx-auto my-16">
        <a href="" className="overflow-hidden inline-block w-full">
          <img src="https://www.bajajmall.in/content/dam/emistoremarketplace/index/10-10-22/geetanjali/mobile-phones-diwali-page/big-banner/desk/MCLP_Row5_1_BigBanner_Desk_vivoT15G_PDP_B2B.jpg" alt="" className="w-full" />
        </a>
      </div>

      <BottomToTop />
    </main>
    <Footer /> 



    </>
  )
}

export default Wishlist