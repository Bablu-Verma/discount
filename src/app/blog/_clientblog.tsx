'use client'

import BlogCard from '@/components/small_card/BlogCard'

import React from 'react'
// import Filter from './_filter'
import { IBlog } from '@/model/BlogModal'
import { IBCategory } from '@/model/BlogCategoryModel'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import menu_image from '../../../public/menu_image.png'

interface CBProps {
  blog: IBlog[]
  category: IBCategory[]
}

const ClientBlog: React.FC<CBProps> = ({ blog, category }) => {
  return (

    <>
      <div className=" px-2.5 py-8 flex justify-start items-center gap-8">
        {category && category.length > 0 && category.map((item, i) => (
          <div>
            <button className='rounded-full border-[4px] border-primary  hover:border-secondary cursor-pointer  '>
              <Image
                alt=''
                sizes='100vw'
                className='w-20 h-20 rounded-full'
                src={item.imges[0]}
                width={20}
                height={20}
              />
            </button>
            <h4 className='text-center text-lg text-secondary capitalize'>{item.name}</h4>
          </div>
        ))}
         <div>
            <button className='rounded-full border-[4px]  border-secondary cursor-pointer  '>
              <Image
                alt=''
                sizes='100vw'
                className='w-20 h-20 rounded-full'
                src={menu_image}
                width={20}
                height={20}
              />
            </button>
            <h4 className='text-center text-lg text-secondary capitalize'>See all</h4>
          </div>
      </div>
      <div className="mx-auto px-2 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
        {blog?.map((item: IBlog, i) => (
          <BlogCard item={item} key={i} />
        ))}
      </div>
    </>



  )
}

export default ClientBlog