"use client";

import TextEditor from "@/app/admin/_admin_components/TextEditor";
// import { category_add_api } from "@/utils/api_url";
import axios from "axios";
import React, { useState } from "react";


const AddCategory = () => {

    const [formData, setFormData] = useState({
        categoryName: "",
        categorySlug: "",
        iconClass: "",
        description: "",
        image: null as File | null,
        status: "active" as "active" | "inactive",
      });
    
      const [error, setError] = useState<string>("");
    
      // Handle form input changes (all inputs)
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        // Update the formData state with the new value
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      // Handle image change (single image)
      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Get the first file
        if (file) {
          setFormData((prev) => ({
            ...prev,
            image: file, // Set the image in the state
          }));
        }
      };
    
      // Render image preview
      const renderImagePreview = () => {
        if (!formData.image) return null;
        return (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Category image"
            className="w-24 h-24 object-cover rounded-md"
          />
        );
      };
    
      // Handle form submission
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { categoryName, categorySlug, iconClass, description, status, image } = formData;
    
        // Prepare form data to send to the server
        const formDataToSend = new FormData();
        formDataToSend.append("name", categoryName);
        formDataToSend.append("slug", categorySlug);
        formDataToSend.append("iconClass", iconClass);
        formDataToSend.append("description", description);
        formDataToSend.append("status", status);
    
        if (image) {
          formDataToSend.append("image", image); // Add the image if it's selected
        }
    
        console.log(formDataToSend);

    //     try {
    //       const response = await axios.post(category_add_api, {
    //         body: formDataToSend,
    //       });
    
    //       if (!response.ok) {
    //         throw new Error("Something went wrong!");
    //       }
    
    //       // Handle Success
    //       const result = await response.json();
    //       console.log(result.message); // e.g. "Category created successfully!"
    //       alert("Category added successfully!");
    
    //       // Reset form data after success
    //       setFormData({
    //         categoryName: "",
    //         categorySlug: "",
    //         iconClass: "",
    //         description: "",
    //         image: null,
    //         status: "active",
    //       });
    //     } catch (error: any) {
    //       setError(error.message || "An error occurred");
    //     }
      };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Add Category
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              htmlFor="product_name"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
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
              Category Slug
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
            >Category Font Awesome Class
             
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
              htmlFor="images"
              className="block text-sm font-medium text-gray-700"
            >
              Product Images 
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleImageChange}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div id="imagePreview" className="mt-4 flex space-x-4">
              {renderImagePreview()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category Status
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="product_status"
                  value="active"
                  className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                  checked
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
            <label
              htmlFor=""
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

export default AddCategory;
