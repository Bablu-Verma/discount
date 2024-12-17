"use client";


import React, { useState } from "react";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";


const TextEditor = dynamic(() => import("@/app/admin/_admin_components/TextEditor"), { ssr: false });



const AddProduct = () => {
  
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState<string>("");

  const editorContent = useSelector((state: any) => state.editor.content);

  const handleBannerToggle = () => {
    setIsBannerActive(!isBannerActive);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length < 3) {
        setError("Please select at least 3 images.");
      } else if (files.length > 5) {
        setError("You can select a maximum of 5 images.");
      } else {
        setError("");
      }
      setImages(files);
    }
  };

  const renderImagePreview = () => {
    if (!images) return null;

    const fileArray = Array.from(images);
    return fileArray.map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
        alt={`Product image ${index + 1}`}
        className="w-24 h-24 object-cover rounded-md"
      />
    ));
  };



  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Add Product
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              htmlFor="product_name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="brand_name"
              className="block text-sm font-medium text-gray-700"
            >
              Brand Name
            </label>
            <input
              type="text"
              id="brand_name"
              placeholder="Enter brand name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              placeholder="Enter product price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cashback"
              className="block text-sm font-medium text-gray-700"
            >
              Cashback (%)
            </label>
            <input
              type="number"
              id="cashback"
              placeholder="Enter cashback percentage"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              placeholder="Enter stock quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              Product Images (min 3)
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleImageChange}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div id="imagePreview" className="mt-4 flex space-x-4">
              {renderImagePreview()}
            </div>
          </div>

          {/* <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled selected>
                Select a category
              </option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Garden</option>
              <option value="beauty">Beauty & Health</option>
              <option value="sports">Sports</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="product_status"
                  value="active"
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                  
                />
                <span className="ml-2 text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="product_status"
                  value="inactive"
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Inactive</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Show Banner
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="banner_active"
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                  checked={isBannerActive}
                  onChange={handleBannerToggle}
                />
                <span className="ml-2 text-gray-700">Active Banner</span>
              </label>
            </div>
          </div>

          {isBannerActive && (
            <div id="bannerImageWrapper">
              <label
                htmlFor="banner_image"
                className="block text-sm font-medium text-gray-700"
              >
                Banner Image
              </label>
              <input
                type="file"
                id="banner_image"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Product Description
            </label>

            <TextEditor />

          </div>

          <div>
            <label
              htmlFor="terms"
              className="block text-sm font-medium text-gray-700"
            >
              Terms & Conditions
            </label>
            <textarea
              id="terms"
              placeholder="Enter terms & conditions"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="text-right">
            <button
              type="reset"
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 mr-6"
            >
              Clear
            </button>
            <button
              type="button"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
