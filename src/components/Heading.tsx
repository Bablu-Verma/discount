import React from "react";

interface SubHeadingProps {
  title: string;
}
interface MainHeadingProps {
  title: string;
}

export const MainHeading:React.FC<MainHeadingProps> = ({title}) => {
  return (
    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 capitalize pr-5 md:pr-10 gap-10">
      {title}
    </h2>
  );
};


