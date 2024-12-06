import Link from 'next/link'
import React from 'react'

const TopHeader = () => {
  return (
    <section className="bg-black py-2 px-4 mobile:hidden sm:block">
    <div
      className="max-w-[1400px] m-auto flex justify-between capitalize items-center"
    >
      <p className="text-white w-[90%] text-center text-sm">
        Summer Sale for all swim suits and free delivery - off 50%!
        <Link
          href=""
          className="ml-3 underline text-sm text-white hover:text-blue-500 font-medium"
          >Shop Now</Link>
      </p>
      <select
        className="outline-none border-none text-sm rounded px-6 text-white bg-black pointer"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
    </div>
  </section>
  )
}

export default TopHeader