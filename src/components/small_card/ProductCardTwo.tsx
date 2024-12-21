import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface CardProp {
  card_data: ICampaign;
}

const ProductCardTwo: React.FC<CardProp> = ({ card_data }) => {
  const [remainingTime, setRemainingTime] = useState<string>("00:00:00");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!card_data?.expire_time) return; 

    const expireTime = card_data?.expire_time instanceof Date ? card_data?.expire_time : new Date(card_data?.expire_time); 

    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expireTime.getTime() - now;

      if (distance <= 0) {
        clearInterval(countdownInterval);
        setIsExpired(true); // Mark the deal as expired
        setRemainingTime("EXPIRED");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setRemainingTime(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [card_data?.expire_time]);

  // If the deal is expired, return null to not render the card
  if (isExpired) return null;

  return (
    <Link href={`/campaign/${card_data?.slug}`}
      title=""
      className="shadow max-h-[230px] block overflow-hidden rounded-lg relative duration-200 border-[1px] cursor-pointer border-transparent hover:border-pink-300"
    >
      <div
        style={{
          borderBottomRightRadius: "30px",
          backgroundImage: "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
        }}
        className=" absolute top-2 left-4 text-[14px] font-normal text-white py-.5 px-2 rounded-md shadow flex justify-center items-center gap-2 pr-3"
      >
        <span>Limited time offer</span> | {remainingTime != "EXPIRED" && <span className="">{remainingTime}</span>}
      </div>

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

export default ProductCardTwo;
