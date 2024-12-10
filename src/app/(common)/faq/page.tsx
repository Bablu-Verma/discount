import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import SubFooter from "@/components/SubFooter";
import Link from "next/link";



const data = [
    {
        question: "What is the best discount offer?",
        answer: "The best discount offer is 15%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is  10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer",
        id:1
    },
    {
        question: "What is the best discount offer?",
        answer: "The best discount offer is 15%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is  10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer",
        id:1
    },
    {
        question: "What is the best discount offer?",
        answer: "The best discount offer is 15%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is  10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer",
        id:1
    },
    {
        question: "What is the best discount offer?",
        answer: "The best discount offer is 15%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is  10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer",
        id:1
    },
    {
        question: "What is the best discount offer?",
        answer: "The best discount offer is 15%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is  10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer",
        id:1
    },
    {
        question: "What is the best discount offer?",
        answer: "The best discount offer is 15%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is  10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer is 10%. The best discount offer",
        id:1
    },

]

export default function FAQ() {
  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-[1400px] mx-auto px-4 my-24 relative">
            <h1 className="text-3xl font-bold text-gray-700 text-center">FAQ</h1>
  
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
