
'use client'


import Image from "next/image";
import React, { useState } from "react";

// Define the types for the campaign data
interface CampaignImage {
  src: string;
  alt: string;
}

interface CampaignData {
  image: CampaignImage[];
}

interface CampaignBannerProps {
  campaign_data: CampaignData;
}

const CampaignBanner: React.FC<CampaignBannerProps> = ({ campaign_data }) => {
  const [activeImage, setActiveImage] = useState<string >(campaign_data.image[0]?.src || 'https://i.imgur.com/AZoKCRT.png')


  return (
    <div>
        <div className=" h-[400px] w-[100%] sm:h-[500px] sm:w-[80%] p-2 rounded shadow justify-center items-center flex overflow-hidden">
        <Image
          src={activeImage}
          alt={campaign_data.image[0].alt || "Default Alt Text"}
          height={400}
          width={400}
          className="w-full"
        />

        </div>
     
      <div className="flex gap-2 mt-6">
        {campaign_data.image.map((item, i) => (
          <div
            key={i}
            onClick={()=>setActiveImage(item.src)}
            className=" w-12 h-12 sm:w-16 sm:h-16 rounded opacity-80 hover:opacity-100 overflow-hidden shadow-lg border-2 border-gray-100 p-0.5 duration-150 hover:border-gray-200 cursor-pointer"
          >
            {item.src ? (
              <Image
                height={300}
                width={300}
                src={item.src}
                alt={item.alt || "Default Alt Text"}
                 className="w-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded"></div> 
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignBanner;
