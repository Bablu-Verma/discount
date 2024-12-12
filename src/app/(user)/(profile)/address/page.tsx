"use client";

import { RootState } from "@/redux-store/redux_store";
import { edit_user_address_api, user_profile_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface FormData {
  house_no: string;
  landmark: string;
  street: string;
  area: string;
  city_village: string;
  state: string;
  pincode: string;
  country: string;
}

const UserAddress: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    house_no: "",
    landmark: "",
    street: "",
    area: "",
    city_village: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);
 const [user_address, setUser_address]=useState({})

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.house_no) {
      toast.error("Add house number/name");
      return;
    }
    if (!formData.landmark) {
      toast.error("Add your landmark");
      return;
    }
    if (!formData.city_village) {
      toast.error("Add your Village/City name");
      return;
    }
    if (!formData.state) {
      toast.error("Add your State");
      return;
    }
    if (!formData.pincode) {
      toast.error("Add area Pincode");
      return;
    }
    if (!formData.country) {
      toast.error("Add your Country");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        edit_user_address_api,
        {
          house_no: formData.house_no,
          landmark: formData.landmark,
          street: formData.street,
          area: formData.area,
          city_village: formData.city_village,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const cancle_ = () => {
    window.location.reload();
  };
  


  const getaddress = async ()=>{
   try {
    const { data } = await axios.post(
      user_profile_api,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(data.data)
   } catch (error) {
     if (error instanceof AxiosError) {
        console.error("Error user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
   }

  }

  useEffect(()=>{
    getaddress()
  },[])












  return (
    <>
      <h3 className="font-semibold mb-4 text-2xl text-primary">Your Address</h3>
      <div className="max-w-[600px] m-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              House No./Name*
            </label>
            <input
              type="text"
              name="house_no"
              value={formData.house_no}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter house number"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Landmark*
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter landmark"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter street"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Area
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter area"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              City/Village*
            </label>
            <input
              type="text"
              name="city_village"
              value={formData.city_village}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter city / village"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              State*
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter state"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Pincode*
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter pincode"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Country*
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter country"
            />
          </div>
          <div className="flex justify-end gap-10 my-10">
            <button
              type="button"
              onClick={cancle_}
              className="bg-white text-gray-800 text-base font-normal duration-200 p-2 px-10 hover:text-primary"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
            >
              {loading ? "Wait.." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserAddress;
