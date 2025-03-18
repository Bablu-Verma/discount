import { ICategory } from "@/model/CategoryModel";
import Link from "next/link";
import React from "react";

interface HeroCategoryProps{
  category: ICategory[];
}
const HeroCategory:React.FC<HeroCategoryProps> = ({category}) => {
  return (
    <div className="px-4 py-2 bg-highlight_color rounded hidden lg:block col-span-1">
      <ul>
        {
          category.slice(0,6).map((item, i)=>{
            return(
              <li className="py-1" key={i}>
              <Link
                href={`/category/${item.slug}`}
                className="text-gray-700 font-normal capitalize duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
              >
                {item.name}
              </Link>
            </li>
            )
          })
        }
      
        <li className="py-1">
          <Link
            href="/category"
            className="text-primary font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
          <i className="fa-solid fa-angle-right"></i> All Category
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeroCategory;
