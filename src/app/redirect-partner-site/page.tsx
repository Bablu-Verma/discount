import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Loader_ from "@/components/Loader_";
import Link from "next/link";

export default function RedirectPartnerSite() {
  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto mt-14 mb-16">
          <div className="min-h-[68vh] justify-center items-center flex ">
            <div className="flex justify-center items-center flex-col">
           
              <div className="h-5"></div>
              <Link className="text-primary hover:underline" href="/">
                 redirect to manually
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
