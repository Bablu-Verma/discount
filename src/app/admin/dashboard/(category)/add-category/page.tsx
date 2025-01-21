"use client";

import TextEditor from "@/app/admin/_admin_components/TextEditor";
import { generateSlug } from "@/helpers/client/client_function";
import { RootState } from "@/redux-store/redux_store";
import { clearEditorData } from "@/redux-store/slice/editorSlice";
import { category_add_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Upload_image_get_link from "@/app/admin/_admin_components/Upload_image_get_link";

const AddCategory = () => {
  const [form_data, setForm_data] = useState({
    categoryName: "",
    iconClass: "", 
    image: null,
    status: "active" as "active" | "inactive",
  });

  const [loading, setLoading] = useState(false);
  const editorContent = useSelector((state: RootState) => state.editor.content);
  const token = useSelector((state: RootState) => state.user.token);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


 

  const renderImagePreview = () => {
    if (!form_data.image) return null;
    return (
      <img
        src={form_data.image}
        alt="Category image"
        className="w-24 h-24 object-cover rounded-md"
      />
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { categoryName, iconClass, status, image } = form_data;
    console.log(form_data)

    if (!categoryName) {
      toast.error("Add Category Name");
      return;
    }
    if (!iconClass) {
      toast.error("Add Font Awesome Class");
      return;
    }
    if (!image) {
      toast.error("Add Category Image");
      return;
    }
    if (!status) {
      toast.error("Select Category Status");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        category_add_api,
        {
          name:categoryName,
          font_awesome_class:iconClass,
          description:editorContent,
          status:status === "active" ? "true" : "false",
          img:image
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setTimeout(()=>{
        window.location.reload()
      },4000)

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

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Add Category
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
        <Upload_image_get_link />

        <div className="grid grid-cols-2 gap-5">
<div>
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              placeholder="Enter category name"
              value={form_data.categoryName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="iconClass"
              className="block text-sm font-medium text-gray-700"
            >
              Category Font Awesome Class
            </label>
            <input
              type="text"
              name="iconClass"
              id="iconClass"
              placeholder="Enter font-awesome class"
              value={form_data.iconClass}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
          
         <div className="grid grid-cols-2 gap-5">
         <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Category Image
            </label>
            <input
              type="text"
              id="image"
              name='image'
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex space-x-4">{renderImagePreview()}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={form_data.status === "active"}
                  onChange={handleInputChange}
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={form_data.status === "inactive"}
                  onChange={handleInputChange}
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Inactive</span>
              </label>
            </div>
          </div>
         </div>
       
          
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Category Description
            </label>
            <TextEditor />
          </div>
          <div className="text-right">
            <button
              type="reset"
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 mr-6"
              onClick={() => window.location.reload()}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
             {
              loading? (
                "In Progress"
              ) : (
                "Submit"
              )
             } 
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
