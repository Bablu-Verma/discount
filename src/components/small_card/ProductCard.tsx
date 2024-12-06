import React from "react";

const ProductCard = () => {
  return (
    <div className="shadow rounded-md overflow-hidden relative hover:shadow-lg duration-200 group">
      {/* <span className="absolute top-2 left-2 bg-red-600 py-[2px] px-2 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
        -40%
      </span> */}
      <span className="absolute top-2 left-2 bg-green-600 py-[2px] px-2 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
        New
      </span>
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button className="text-gray-800 hover:text-primary">
          <i className="fa-regular fa-heart text-xl"></i>
        </button>
        <button className="text-gray-800 hover:text-primary">
          <i className="fa-regular fa-eye text-xl"></i>
        </button>
        <button className="text-gray-800 hover:text-primary">
          <i className="fa-solid fa-trash text-xl"></i>
        </button>
      </div>
      <div className="max-h-[230px] overflow-hidden relative">
        <img
          src="https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-madebymath-90946.jpg&fm=jpg"
          className="w-full"
          alt="shose"
        />
        <button className="select-none w-full bg-black text-white font-normal absolute bottom-[-100px] z-10 group-hover:bottom-0 duration-200 py-1 text-base">
          Add to Cart
        </button>
      </div>

      <div className="pb-2 pt-1 px-2">
        <h4 className="text-gray-700 font-medium text-base py-1 capitalize">
          Havit HV - G63 Game pade - G63 Game pade playe
        </h4>
        <div>
          <strong className="text-primary text-xl mr-3 mb-1">$120</strong>
          <span className="text-gray-600 font-medium line-through">$170</span>
        </div>
        <div className="flex gap-3 py-1">
          <div>
            <i className="fa-solid fa-star text-sm text-yellow-500"></i>
            <i className="fa-solid fa-star text-sm text-yellow-500"></i>
            <i className="fa-solid fa-star text-sm text-yellow-500"></i>
            <i className="fa-solid fa-star-half-stroke text-sm text-yellow-500"></i>
            <i className="fa-regular fa-star text-sm text-yellow-500"></i>
          </div>
          <p className="text-gray-800 font-medium">(90)</p>
        </div>
        <div className="flex gap-3 py-1 pt-1">
          <button className="bg-green-700 h-[12px] w-[12px] rounded-full ring-1 focus:outline-none focus:ring-2 focus:ring-gray-600"></button>
          <button className="bg-red-700 h-[12px] w-[12px] rounded-full ring-1 focus:outline-none focus:ring-2 focus:ring-gray-600"></button>
          <button className="bg-pink-700 h-[12px] w-[12px] rounded-full ring-1 focus:outline-none focus:ring-2 focus:ring-gray-600"></button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
