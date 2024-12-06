import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Image from "next/image";
import React from "react";
import { MainHeading, SubHeading } from "@/components/Heading";
import BestSalling from "@/components/homepage/BestSelling";

const CampaignDetail = () => {
  const campaign_data = {
    title: "Campaign Title",
    description: "Campaign Description",
    image: [
      {
        src: "https://i.imgur.com/c9tRQmQ.jpeg",
        alt: "Campaign Image 1",
      },
      {
        src: "https://i.imgur.com/HKKwp63.jpeg",
        alt: "Campaign Image 1",
      },
      {
        src: "https://i.imgur.com/JMV7EJ4.png",
        alt: "Campaign Image 1",
      },
    ],
    buttonText: "Learn More",
    buttonLink: "/campaign/details",
    // Add more properties as needed
  };

  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto mt-14 mb-16">
        <div>
            <span>Home</span> / <span>Category</span> / <span>Health</span>
          </div>
        <div className="mt-8 text-center items-center">
            <div className="h-48 w-48 rounded-full overflow-hidden justify-center items-center flex shadow-lg m-auto mb-10 bg-[url('')]">
                <Image
                  src='https://i.imgur.com/WvzprEv.png'
                  alt='WvzprEv'
                  width={500}
                  className="w-full h-auto"
                  height={500}
                />
  
            </div>
              <h1 className="text-xl text-secondary font-medium  mb-3">
                Toys R Us Fastlane 3D Super Transparent Car 360 Mechanical
                Rotation with Sound &Light Toys for Kids (Multicolor)
              </h1>
              
              <div className="pt-4 text-sm">
                Toys R Us 360 Degree Rotating Transparent Concept Racing Car
                with 3D Flashing Led Light.Multi-functional, colorful lighting,
                clone gear mechanical system, awesome sound effects. Transparent
                Design. Can view the gear inside, and help the child to know the
                mechanical concept earlier. Gear driving effect. Enhance Brain
                Development and build a Child’s Curiosity for New Things.
                Different Color helps a child's cognitive ability. Made from
                heavy-duty plastic, the toy has no small parts to it so that
                children can enjoy it. To operate a toy car you need to have 3 x
                AA batteries (Not Included).
              </div>
            </div>
          
      <SubHeading title="This Month" />
      <div
        className="max-w-[1400px] mx-auto px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative"
      >
       <MainHeading title="Best Selling Products"/>
      </div>
        <BestSalling />
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default CampaignDetail;

