"use client";

import { RootState } from "@/redux-store/redux_store";
import { login } from "@/redux-store/slice/userSlice";
import { edit_profile_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IUser } from "@/common_type";

interface IFormData {
  name: string;
  phone: string;
  profileImage: File | null;
  dob: Date;
  gender: string;
}


const ProfileEdit = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<IFormData>({
    name: "",
    phone: "",
    profileImage: null,
    dob: new Date(),
    gender: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profileImage: null,
        dob: user.dob ? new Date(user.dob) : new Date(),
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "profileImage" && files ? files[0] : value,
    }));
  };

  const handel_date_change = (date: Date | null) => {
    if (date) {
      setFormData((prevData) => ({
        ...prevData,
        dob: date,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fdata = new FormData();
    fdata.append("name", formData.name);
    fdata.append("phone", formData.phone);
    fdata.append("dob", formData.dob.toISOString());
    fdata.append("gender", formData.gender);
    if (formData.profileImage) {
      fdata.append("profile", formData.profileImage);
    }
    call_db(fdata);
  };

  const call_db = async (fdata: FormData) => {
    console.log("fdata_ client call", fdata);
    setLoading(true);
    try {
      const { data } = await axios.post(edit_profile_api, fdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data.message);
      dispatch(login({ user: data.data, token: token || "" }));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error login user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <>
      <h3 className="font-semibold mb-4 text-xl sm:text-2xl text-primary">
        Edit Your Profile
      </h3>
      <div className="max-w-[600px] m-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-3 justify-center items-center flex">
            <label
              htmlFor="user_profile"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              <img
                src={
                  formData.profileImage
                    ? URL.createObjectURL(formData.profileImage)
                    : user?.profile ||
                      "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                }
                alt="Profile"
                className="max-w-[100px] max-h-[100px] rounded-full"
              />
            </label>
            <input
              type="file"
              id="user_profile"
              name="profileImage"
              className="hidden"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={user?.email}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="912344556"
            />
          </div>

          <div className="flex justify-between mb-5 ">
            
            <div className="">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <DatePicker
                selected={formData.dob}
                onChange={(date) => handel_date_change(date)}
                className="px-3 py-2 text-sm border border-gray-300 max-w-[150px] rounded-md focus:outline-none focus:border-primary"
              />
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-0"
                  />
                  <span className="text-sm">Male</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-0"
                  />
                  <span className="text-sm">Female</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-0"
                  />
                  <span className="text-sm">Other</span>
                </label>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-10 my-10">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white text-gray-800 text-base font-normal duration-200 p-2 min-w-[120px] md:min-w-[150px] px-10 hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[120px] md:min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Wait..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileEdit;
