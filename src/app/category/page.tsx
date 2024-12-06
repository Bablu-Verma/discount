import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import CategorieCard from "@/components/small_card/CategorieCard";


const fleah_data = [
  {
    id: 1,
    image: "/images/flash/flash1.jpg",
    title: "Flash Sale: Off 50% on All Swimsuits",
    description:
      "Summer Sale for all swim suits and free delivery - off 50%!",
    link: "/flash-sale",
  },
  {
    id: 1,
    image: "/images/flash/flash1.jpg",
    title: "Flash Sale: Off 50% on All Swimsuits",
    description:
      "Summer Sale for all swim suits and free delivery - off 50%!",
    link: "/flash-sale",
  },
  {
    id: 1,
    image: "/images/flash/flash1.jpg",
    title: "Flash Sale: Off 50% on All Swimsuits",
    description:
      "Summer Sale for all swim suits and free delivery - off 50%!",
    link: "/flash-sale",
  },
  {
    id: 1,
    image: "/images/flash/flash1.jpg",
    title: "Flash Sale: Off 50% on All Swimsuits",
    description:
      "Summer Sale for all swim suits and free delivery - off 50%!",
    link: "/flash-sale",
  },
  {
    id: 1,
    image: "/images/flash/flash1.jpg",
    title: "Flash Sale: Off 50% on All Swimsuits",
    description:
      "Summer Sale for all swim suits and free delivery - off 50%!",
    link: "/flash-sale",
  },
  {
    id: 1,
    image: "/images/flash/flash1.jpg",
    title: "Flash Sale: Off 50% on All Swimsuits",
    description:
      "Summer Sale for all swim suits and free delivery - off 50%!",
    link: "/flash-sale",
  },
];

export default function Home() {
  return (
    <>
    <TopHeader />
    <MainHeader />
    <main>
      <div className="max-w-[1400px] m-auto mt-14 mb-16">
         <div>
            <span>Home</span> / <span>Category</span>
          </div>
        <div className="grid grid-cols-5 gap-8 mt-10">
          {
            fleah_data.map((item) => (
              <CategorieCard />
            ))
          }
        </div>
      </div>
      <BottomToTop />
    </main>
    <Footer />
    </>
  );
}
