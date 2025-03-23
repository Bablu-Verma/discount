import { ICategory } from "@/model/CategoryModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoryCard {
  item: ICategory;
}

const getRandomRGBA = () => {
  const randomValue = () => Math.floor(Math.random() * 200);
  return `rgba(${randomValue()}, ${randomValue()}, ${randomValue()}, 0.7)`;
};

const CategorieCard: React.FC<CategoryCard> = ({ item }) => {

  return (
    <Link href={`category/${item.slug}`} className="hover:shadow rounded-xl relative bg-white duration-200 mx-2 w-[160px]  lg:w-[200px] h-[160px] flex flex-col p-4">
      <div className="h-1 w-16  rounded-r-full" style={{ backgroundColor: getRandomRGBA() }} />
      <div className="w-full flex flex-col mt-4 justify-between items-center">
        <Image src={item.imges[0]} alt={item.name} width={90} height={90} className="mb-4" />

        <p className="text-gray-700 text-base font-medium  uppercase ">
          {item.name}
        </p>
      </div>
    </Link>
  );
};

export default CategorieCard;
