import { ICategory } from "@/model/CategoryModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoryCard {
  item: ICategory;
}

const CategorieCard: React.FC<CategoryCard> = ({item}) => {

  return (
    <Link href={`category/${item.slug}`} className="shadow group rounded-md overflow-hidden relative bg-white hover:bg-primary hover:border-primary duration-200 border-[2px] flex justify-center items-center flex-col py-3 lg:py-8">
    <Image src={item.imges[0]} alt={item.name} width={100} height={100} sizes="100vw" className="rounded-md mb-3"  />
    
      <p className="text-gray-700 text-md font-medium pt-2 capitalize group-hover:text-white">
        {item.name}
      </p>
    </Link>
  );
};

export default CategorieCard;
