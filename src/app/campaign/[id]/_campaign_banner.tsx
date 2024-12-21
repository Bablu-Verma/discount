'use client'

import Image from "next/image";
import React, { useState } from "react";

interface CampaignBannerProps {
  campaign_data: string[]; 
}

const CampaignBanner: React.FC<CampaignBannerProps> = ({ campaign_data }) => {

  const [activeImage, setActiveImage] = useState<string>(campaign_data[0] || 'https://i.imgur.com/AZoKCRT.png');

  return (
    <div>
      <div className="h-[400px] w-[100%] sm:h-[500px] sm:w-[80%] p-2 rounded shadow justify-center items-center flex overflow-hidden">
        <Image
          src={activeImage}
          alt="Active Product Image"
          height={400}
          width={400}
          className="w-full"
        />
      </div>

      <div className="flex gap-2 mt-6">
        {campaign_data.map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveImage(item)}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded opacity-80 hover:opacity-100 overflow-hidden shadow-lg border-2 border-gray-100 p-0.5 duration-150 hover:border-gray-200 cursor-pointer"
          >
            <Image
              height={300}
              width={300}
              src={item}
              alt={`Product Image ${i + 1}`}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignBanner;
