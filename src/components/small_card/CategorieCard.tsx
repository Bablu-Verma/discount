import React from "react";

const CategorieCard = () => {
  return (
    <div className="shadow group rounded-md overflow-hidden relative bg-white hover:bg-primary hover:border-primary duration-200 border-[2px] border-gray-700 flex justify-center items-center flex-col py-8">
      <i className="fa-solid fa-mobile-screen-button text-gray-700 text-6xl group-hover:text-white"></i>
      <p className="text-gray-700 text-md font-medium pt-2 group-hover:text-white">
        Phones
      </p>
    </div>
  );
};

export default CategorieCard;
