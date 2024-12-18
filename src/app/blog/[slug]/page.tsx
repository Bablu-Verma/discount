import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";

import React from "react";

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
        <section className="max-w-[800px] mx-auto mt-6 sm:mt-14 mb-16 p-2 xl:p-0">
          
            <div className="mb-10">
              <img src="https://i.imgur.com/x8AGeNt.jpeg" alt="blog-img" className="w-full"/>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl text-secondary font-medium  mb-3">
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
