
import React from "react";

const AdminLogin = () => {
  return (
    <>
   
    <main className="">
      <div className="max-w-[1400px] m-auto h-screen flex items-center justify-center ">
       
      <div className="w-full max-w-[400px]">
            <h2 className="text-2xl font-semibold b-3">Hi' Admin 👋</h2>
            <p className="text-sm font-normal mb-10">
              Login your account
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                id="email"
                name="Email"
                placeholder="Your email"
                className="w-full bg-gray-100 px-3 py-2 outline-none text-base  text-black border-b-2 border-gray-500 "
              />
              <input
                type="password"
                id="Password"
                name="Password"
                placeholder="Secure Password"
                className="w-full bg-gray-100 px-3 py-2 outline-none text-base text-black border-b-2 border-gray-500"
              />
            </div>
            <div className="flex justify-between gap-2 my-10 ">
              <button className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[160px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl">
                Submit
              </button>
              <button className="bg-white text-gray-800 text-base font-normal duration-200 p-2  hover:text-blue-500 ">
                Forgot Password?
              </button>
            </div>
           
          </div>
      </div>
     
    </main>
   
    </>
    
  );
};

export default AdminLogin;
