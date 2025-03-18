import React from "react";

const SubFooter = () => {
  const sub_footer = [
    {
      id: 1,
      title: "Help & Support",
      link: "/help-support",
    },
    {
      id: 1,
      title: "Help & Support",
      link: "/help-support",
    },
    {
      id: 1,
      title: "Help & Support",
      link: "/help-support",
    },
  ];
  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-14 gap-5 sm:gap-12 mb-5 flex justify-center flex-col sm:flex-row">
      {sub_footer.map((_,i) => (
        <div className="flex justify-center text-center flex-col items-center" key={i}>
          <div className="bg-gray-400 rounded-full w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] flex justify-center items-center mb-2">
            <div className="bg-black rounded-full w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[75px] md:h-[75px] flex justify-center items-center">
              <i className="fa-solid fa-van-shuttle text-2xl sm:text-3xl md:text-4xl text-white"></i>
            </div>
          </div>
          <h3 className="uppercase text:xl md:text-2xl font-bold pb-1 pt-3 text-black">
            Free and fast delivery
          </h3>
          <p className="text-sm sm:text-base font-normal text-gray-700">
            free delivery for all order over $20
          </p>
        </div>
      ))}
    </div>
  );
};

export default SubFooter;
