import { ICategory } from "@/model/CategoryModel";
import Link from "next/link";
import React from "react";

interface CategoryCard {
  item: ICategory;
}

const CategorieCard: React.FC<CategoryCard> = ({item}) => {
  return (
    <Link href={`category/${item.slug}`} className="shadow group rounded-md overflow-hidden relative bg-white hover:bg-primary hover:border-primary duration-200 border-[2px] border-gray-700 flex justify-center items-center flex-col py-8">
      <i className={`${item.font_awesome_class} text-gray-700 text-6xl group-hover:text-white`}></i>
      <p className="text-gray-700 text-md font-medium pt-2 group-hover:text-white">
        {item.name}
      </p>
    </Link>
  );
};

export default CategorieCard;
