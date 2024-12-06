import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import TopHeader from "@/components/header/TopHeader";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <TopHeader />
      <MainHeader />
      <main className="">
        <section className="max-w-[1400px] mx-auto mt-14 mb-16">
          <div className="min-h-[68vh] justify-center items-center flex ">
            <div className="flex justify-center items-center flex-col">
              <h1 className="text-9xl text-gray-900">404</h1>
              <h2 className="text-2xl text-gray-600">Page Not Found</h2>
              <div className="h-5"></div>
              <Link className="text-primary hover:underline" href="/">
                Go to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
