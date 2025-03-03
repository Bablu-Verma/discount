"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { RootState } from "@/redux-store/redux_store";
import { category_add_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    images: ["", ""],
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const editorContent = useSelector((state: RootState) => state.editor.content);
  const token = useSelector((state: RootState) => state.user.token);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "innerImage") {
      setFormData((prev) => ({ ...prev, images: [value, prev.images[1]] }));
    } else if (name === "outerImage") {
      setFormData((prev) => ({ ...prev, images: [prev.images[0], value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderImagePreview = (index: number) => {
    return formData.images[index] ? (
      <img
        src={formData.images[index]}
        alt={`Category image ${index + 1}`}
        className="w-24 h-24 object-cover rounded-md"
      />
    ) : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { categoryName, status, images,description } = formData;

    if (!categoryName) return toast.error("Please enter a category name");
    if (!images[0] || !images[1]) return toast.error("Please add both inner and outer category images");


    setLoading(true);

    try {
      const { data } = await axios.post(
        category_add_api,
        {
          name: categoryName,
          // description: editorContent,
          description: description,
          status: status,
          imges: images,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong");
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
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <UploadImageGetLink />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inner Category Image URL
            </label>
            <input
              type="text"
              name="innerImage"
              value={formData.images[0]}
              onChange={handleInputChange}
              placeholder="Enter inner image URL"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex space-x-4">{renderImagePreview(0)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Outer Category Image URL
            </label>
            <input
              type="text"
              name="outerImage"
              value={formData.images[1]}
              onChange={handleInputChange}
              placeholder="Enter outer image URL"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex space-x-4">{renderImagePreview(1)}</div>
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
                  value="ACTIVE"
                  checked={formData.status === "ACTIVE"}
                  onChange={handleInputChange}
                  className="focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="INACTIVE"
                  checked={formData.status === "INACTIVE"}
                  onChange={handleInputChange}
                  className="focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2">Inactive</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Description
            </label>
            {/* <TextEditor /> */}
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-right">
            <button
              type="reset"
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:ring-2 focus:ring-red-500 mr-6"
              onClick={() => window.location.reload()}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "In Progress" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
