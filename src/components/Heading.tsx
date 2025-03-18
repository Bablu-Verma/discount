import React from "react";

interface SubHeadingProps {
  title: string;
}
interface MainHeadingProps {
  title: string;
}

export const MainHeading:React.FC<MainHeadingProps> = ({title}) => {
  return (
    <div className="max-w-6xl mx-auto px-2 flex mt-2 lg:mt-4 md:mt-3 justify-start items-end mb-4 relative">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 capitalize pr-5 md:pr-10 gap-10">
      {title}
    </h2>
    </div>
  );
};

export const SubHeading: React.FC<SubHeadingProps> = ({title}) => {
  return (
    <div className="max-w-6xl mx-auto px-2 flex pt-5 lg:pt-7">
      <span className="bg-primary px-2 lg:px-2.5 rounded"></span>
      <h3 className="text-primary font-semibold text-lg md:text-xl capitalize ml-2 lg:ml-4">
        {title}
      </h3>
    </div>
  );
};
