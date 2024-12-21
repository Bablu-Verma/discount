import { ICampaign } from "@/model/CampaignModel";
import Link from "next/link";
import React from "react";

interface FeaturedProps {
  arrival: ICampaign[];
}

const Featured: React.FC<FeaturedProps> = ({ arrival }) => {
  const featured_1 = arrival[0];
  const featured_2 = arrival[1];
  const featured_3 = arrival[2];
  const featured_4 = arrival[3];

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-2 md:grid gap-2 md:gap-x-10 gap-y-5 grid-cols-4 mb-5">
      <div
        style={{
          backgroundImage: `url(${featured_1?.img?.[0]})`,
        }}
        className={`row-span-2 min-h-[250px]  col-span-2  bg-cover bg-center bg-no-repeat md:rounded relative`}
      >
        <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
            {featured_1?.brand}
          </h3>
          <p className="text-sm md:text-base text-white line-clamp-2">{featured_1?.title}</p>
          <Link
            href={`/campaign/${featured_1?.slug}`}
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </Link>
        </div>
      </div>
      {
        featured_2 && <div style={{
          backgroundImage: `url(${featured_2?.img?.[0]})`,
        }} className={`bg-green-500 min-h-[250px]  relative md:rounded bg-cover bg-center bg-no-repeat col-span-2`}>
        <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
          {featured_2.brand}
          </h3>
          <p className="text-sm md:text-base text-white line-clamp-2">
          {featured_3?.title}
          </p>
          <Link 
            href={`/campaign/${featured_2?.slug}`}
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </Link>
        </div>
      </div>
      }
      
      {
        featured_3 &&  <div style={{
          backgroundImage: `url(${featured_3?.img?.[0]})`,
        }} className="bg-green-500 min-h-[220px] md:rounded bg-cover bg-center relative bg-no-repeat">
        <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
            {featured_3?.brand}
          </h3>
          <p className="text-sm md:text-base text-white line-clamp-2">
          {featured_3?.title}
          </p>
          <Link
            href={featured_3?.slug}
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </Link>
        </div>
      </div>
      }
     
      {
        featured_4 &&  <div style={{
          backgroundImage: `url(${featured_4?.img?.[0]})`,
        }} className="bg-green-500 min-h-[220px] md:rounded  relative bg-cover bg-center bg-no-repeat">
        <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold text-2xl md:text-3xl text-white tracking-wide pb-2">
          {featured_4?.brand}
          </h3>
          <p className="text-sm md:text-base text-white line-clamp-2">
          {featured_4?.title}
          </p>
          <a
           href={featured_4?.slug}
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </a>
        </div>
      </div>
      }
     
    </div>
  );
};

export default Featured;
