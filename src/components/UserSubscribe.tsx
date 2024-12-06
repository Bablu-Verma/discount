import React from 'react'

const UserSubscribe = () => {
  return (
    <div className="relative rounded border-[1px] border-white py-1.5 px-2 max-w-[300px]">
    <input
      type="text"
      className="w-full bg-black outline-none border-none text-base text-white"
      placeholder="Enter your email"
    />
    <button className="absolute right-2 top-1 z-10">
      <i className="fa-regular fa-paper-plane text-lg font-thin"></i>
    </button>
  </div>
  )
}

export default UserSubscribe