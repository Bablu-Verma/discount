import BlogCard from '@/components/small_card/BlogCard'

import React from 'react'
import Filter from './_filter'
import { IBlog } from '@/model/BlogModal'


interface CBProps {
    blog:IBlog[]
}

const ClientBlog:React.FC<CBProps> = ({blog}) => {
  return (
    <div className="md:grid grid-cols-8 gap-8 mt-12 lg:mt-20">
    {/* <Filter /> */}
    <div className="col-span-6">
      <div className="max-w-[1400px] mx-auto px-2 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mb-4 gap-3 md:gap-6">
        {blog?.map((item:IBlog, i) => (
          <BlogCard item={item} key={i}/>
        ))}
      </div>
    </div>
  </div>
  )
}

export default ClientBlog