import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Image from "next/image";
import React from "react";
import Campaign_banner from "./_campaign_banner";
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
        <section className="max-w-[1400px] mx-auto mt-6 sm:mt-14 mb-16 p-2 xl:p-0">
          <div className="md:grid md:grid-cols-2 gap-5">
            <div>
              <Campaign_banner campaign_data={campaign_data} />
              <div className="rounded grid grid-cols-2 border-2 border-gray-200 my-12 mb-5 p-3 py-5">
                <div className="flex justify-center gap-2 sm:gap-5 items-center border-r-2">
                  <i className="fa-solid fa-note-sticky text-secondary text-xl sm:text-4xl"></i>
                  <div>
                    <h4 className="text-secondary text-sm sm:text-base font-normal">Tream and Condition</h4>
                    <a href="" className="text-[12px] sm:text-sm text-blue-500  hover:underline">Click to link</a>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 sm:gap-5 items-center">
                  <i className="fa-solid fa-circle-exclamation text-secondary text-xl sm:text-4xl"></i>
                  <div>
                    <h4 className="text-secondary text-sm sm:text-base font-normal">More Information</h4>
                    <a href="" className="text-[12px] sm:text-sm text-blue-500  hover:underline">Click to link</a>
                  </div>
                </div>
                
              </div>
            </div>

            <div>
              <h1 className="text-lg sm:text-xl text-secondary font-medium  mb-3">
                Toys R Us Fastlane 3D Super Transparent Car 360 Mechanical
                Rotation with Sound &Light Toys for Kids (Multicolor)
              </h1>
              <div className="flex gap-3 mb-4 items-center">
                <div className="flex gap-1">
                  <i className="fa-solid fa-star text-base  text-yellow-500"></i>
                  <i className="fa-solid fa-star text-base text-yellow-500"></i>
                  <i className="fa-solid fa-star text-base text-yellow-500"></i>
                  <i className="fa-solid fa-star-half-stroke text-base text-yellow-500"></i>
                  <i className="fa-regular fa-star text-base text-yellow-500"></i>
                </div>
                <p className="text-gray-800 text-sm font-normal">
                  (90 Review) |{" "}
                  <span className="text-green-400 font-medium">Active</span>{" "}
                </p>
              </div>
              <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-secondary">
                ₹ 7576/-
              </h2>
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

// https://www.shutterstock.com/image-vector/colorful-game-controller-icon-vector-600nw-2489844309.jpg
// https://www.shutterstock.com/image-vector/joystick-gamepad-game-console-controller-600nw-2137131861.jpg
// https://banner2.cleanpng.com/20231111/ibg/transparent-cartoon-characters-colorful-cartoon-style-video-game-controller-1711023988390.webp
