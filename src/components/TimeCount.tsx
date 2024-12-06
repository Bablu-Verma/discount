import React from "react";

const TimeCount = () => {
  return (
    <div className="flex justify-center items-end">
      <div className="flex flex-col px-0.5 sm:px-1">
        <span className="text-[10px] md:text-[12px] font-medium text-gray-600">
          Days
        </span>
        <strong className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-900">
          03
        </strong>
      </div>
      <span className="px-0.5 md:px-2 text-xl md:text-2xl text-primary inline-block pb-2">
        :
      </span>
      <div className="flex flex-col px-1">
        <span className="text-[10px] md:text-[12px] font-medium text-gray-600">
          Hours
        </span>
        <strong className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-900">
          03
        </strong>
      </div>
      <span className="px-0.5 md:px-2 text-xl md:text-2xl text-primary inline-block pb-2">
        :
      </span>
      <div className="flex flex-col px-1">
        <span className="text-[10px] md:text-[12px] font-medium text-gray-600">
          Minutes
        </span>
        <strong className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-900">
          03
        </strong>
      </div>
      <span className="px-0.5 md:px-2 text-xl md:text-2xl text-primary inline-block pb-2">
        :
      </span>
      <div className="flex flex-col px-1">
        <span className="text-[10px] md:text-[12px] font-medium text-gray-600">
          Second
        </span>
        <strong className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-900">
          03
        </strong>
      </div>
    </div>
  );
};

export default TimeCount;
