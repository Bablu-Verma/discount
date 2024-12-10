import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";

export default function ContactUs() {
  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-[1400px] mx-auto px-4 my-24  relative">
          <h1 className="text-3xl font-semibold text-center text-gray-800">Contact Us</h1>
          <div className="grid grid-cols-4 gap-14 w-full mt-16">
            <div className="col-span-1 pr-6">
              <div className="mb-6 border-b-2 pb-2">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                  <i className="fa-solid fa-phone text-primary mr-3"></i> Call to Us
                </h2>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  We are availbable 24/7,7 days a week.
                </p>
                <p className="text-sm text-gray-500 ml-3 mb-2">Phone: +91 857657567</p>
              </div>
              <div className="mb-6 border-b-2 pb-2">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                <i className="fa-solid fa-envelope text-primary mr-3"></i> Wright to us
                </h2>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Find out our form and we will connact you within 24 hours.
                </p>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Email: customer@help.com
                </p>
                <p className="text-sm text-gray-500 ml-3 mb-2">
                  Email: discount@help.com
                </p>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-secondary capitalize mb-3">
                 <i className="fa-solid fa-location-pin text-primary mr-3"></i> Address
                </h2>
                <address className="text-sm text-gray-500 ml-3 mb-2">
                  Street: 123 Main St, New York, NY 10001
                </address>
              
              </div>
            </div>
            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-5 w-full mb-1 ">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    placeholder="Your Email"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    placeholder="Subject"
                  />
                </div>
              </div>
              <textarea
                id="message"
                name="message"
                className="w-full px-3 py-2 text-sm border min-h-60 border-gray-300 rounded-md focus:outline-none focus:border-primary"
                placeholder="Your Message"
              ></textarea>
              <div className="flex justify-end w-full mt-4">
                <button className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
