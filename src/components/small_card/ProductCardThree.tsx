import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProp {
  card_data:ICampaign
}


const ProductCardThree:React.FC<CardProp> = ({card_data}) => {
  return (
    <Link href={`/campaign/${card_data.slug}`}  className="block shadow cursor-pointer overflow-hidden rounded-lg relative duration-200 border-[1px] border-transparent hover:border-pink-300 ">
        <Image
          src={card_data?.img[0]}
          className="w-full h-[220px]"
          height={200}
          width={200}
          alt={card_data?.title}
        />
    </Link>
  );
};

export default ProductCardThree;
