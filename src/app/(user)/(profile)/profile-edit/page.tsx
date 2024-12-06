import React from "react";



const ProfileEdit = () => {
 
  return (
    <>
      <h3 className="font-semibold mb-4 text-xl sm:text-2xl text-primary ">
        Edit Your Profile
      </h3>
      <div className=" max-w-[600px] m-auto">
        <form className="">
          <div className="mb-3 justify-center items-center flex">
            <label
              htmlFor="user_profile"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                className="max-w-[100px]"
              />
            </label>
            <input type="file" id="user_profile" className=" hidden" />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="abc@email.com"
            />
          </div>
        </form>
        <div className="flex justify-end gap-10 my-10 ">
          <button className="bg-white text-gray-800 text-base font-normal duration-200 p-2  min-w-[120px] md:min-w-[150px] px-10 hover:text-primary ">
            Cancle
          </button>
          <button className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[120px] md:min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileEdit;
