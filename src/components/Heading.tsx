import React from "react";

interface SubHeadingProps {
  title: string;
}
interface MainHeadingProps {
  title: string;
}

export const MainHeading:React.FC<MainHeadingProps> = ({title}) => {
  return (
    <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 capitalize pr-5 md:pr-10 gap-10">
      {title}
    </h2>
  );
};

export const SubHeading: React.FC<SubHeadingProps> = ({title}) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 flex mt-14">
      <span className="bg-primary px-2.5 rounded"></span>
      <h3 className="text-primary font-semibold text-xl md:text-2xl capitalize ml-4">
        {title}
      </h3>
    </div>
  );
};
