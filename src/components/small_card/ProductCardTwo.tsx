import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProp {
  card_data:ICampaign
}


const ProductCardTwo:React.FC<CardProp> = ({card_data}) => {
  return (
    <div title="" className="shadow max-h-[230px] overflow-hidden rounded-lg relative duration-200 border-[1px] cursor-pointer border-transparent hover:border-pink-300 ">
      <span style={{borderBottomRightRadius:'30px', backgroundImage: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)'}} className=" absolute top-2 left-4 text-[14px] font-normal text-white  py-.5 px-2  rounded-md shadow">Limated time offer</span>
  
     <Image
        src={card_data?.img[0]}
          className="w-full h-[220px]"
          height={200}
          width={200}
          alt={card_data?.title}
        />
       
    </div>
  );
};

export default ProductCardTwo;
