"use client";

import { category_details_api, category_edit_api, edit_store_api, store_details_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import { RootState } from "@/redux-store/redux_store";
import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";



const EditCategory: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
 const [formData, setFormData] = useState({
     name: "",
     store_img: "",
     cashback_status: "" ,
     store_link: "",
     cashback_type: "" ,
     cashback_amount: "",
     store_status: "" ,
   });
  const [editorContent, setEditorContent] = useState("");
  const urlslug = pathname.split("/").pop() || "";


  const getstoredetail = async () => {
    try {
      const { data } = await axios.post(
        store_details_api,
        { slug: urlslug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        name: data.data.name || '',
        store_img: data.data.store_img || '',
        cashback_status: data.data.cashback_status || '',
        store_link: data.data.store_link || '',
        cashback_type: data.data.cashback_type || '',
        cashback_amount: data.data.cashback_amount || "",
        store_status: data.data.store_status || '',
      })
      setEditorContent(data.data.description)

    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching category");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getstoredetail();
  }, [urlslug]);

  // Handle Input Changes

  // Handle Submit
  const handleSubmit = async () => {
  

    try {
      setLoading(true);
      const { data } = await axios.post(
        edit_store_api,
        {
          slug: urlslug,
          name:formData.name,
          description: editorContent,
          store_img:formData.store_img,
          cashback_status:formData.cashback_status,
          store_link:formData.store_link,
          cashback_type:formData.cashback_type,
          cashback_amount:formData.cashback_amount,
          store_status:formData.store_status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("store updated successfully! Redirecting...");
      setTimeout(() => router.push("/dashboard/all-stores"), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Edit Store
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
      <UploadImageGetLink />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Store Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Link</label>
              <input
                type="text"
                name="store_link"
                value={formData.store_link}
                onChange={handleInputChange}
                placeholder="Enter store link"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Store Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
              <input
                type="text"
                name="store_img"
                value={formData.store_img}
                onChange={handleInputChange}
                placeholder="Add store image link"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Amount/Percentage</label>
              <input
                type="number"
                name="cashback_amount"
                value={formData.cashback_amount}
                onChange={handleInputChange}
                placeholder="Enter cashback amount/percentage"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cashback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Type</label>
              <select
                name="cashback_type"
                value={formData.cashback_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">PERCENTAGE</option>
                <option value="FLAT_AMOUNT">FLAT_AMOUNT</option>
              </select>
            </div>

            {/* Cashback Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Status</label>
              <select
                name="cashback_status"
                value={formData.cashback_status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE_CASHBACK">ACTIVE_CASHBACK</option>
                <option value="INACTIVE_CASHBACK">INACTIVE_CASHBACK</option>
              </select>
            </div>
          </div>

          {/* Store Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Status</label>
            <select
              name="store_status"
              value={formData.store_status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
            <TextEditor editorContent={editorContent} setEditorContent={setEditorContent} />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg" disabled={loading}>
              {loading ? "In Progress" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
