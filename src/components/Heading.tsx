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
    <div className="max-w-6xl mx-auto px-2 flex pt-5 lg:pt-7">
      <span className="bg-primary px-2 lg:px-2.5 rounded"></span>
      <h3 className="text-primary font-semibold text-xl md:text-2xl capitalize ml-2 lg:ml-4">
        {title}
      </h3>
    </div>
  );
};
