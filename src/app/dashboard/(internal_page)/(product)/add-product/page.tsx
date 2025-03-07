"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import { add_product, category_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


interface IFormData {
  product_name: string;
  client_url: string;
  brand_name: string;
  price: string;
  cashback: string;
  category: string;
  description: string;
  product_status: string;
  banner_status: string;
  images: string[] | null;
  terms: string;
  hot_p: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  new_p: string;
  featured_p: string;
  tags: string;
  add_poster: string;
  arrival: string;
  banner: string;
  flash_time: Date | null;
  calculation_type: string;
}

const AddProduct = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState([]);
  const [images, setImages] = useState<string>("");
  const [loding, setLoading] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState("");
  const [form_data, setForm_data] = useState<IFormData>({
    product_name: "",
    brand_name: "",
    price: "",
    cashback: "",
    hot_p: "",
    category: "",
    description:"",
    product_status: "active",
    banner_status: "active",
    images: [],
    terms: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    new_p: "",
    featured_p: "",
    tags: "",
    add_poster: "",
    arrival: "",
    flash_time: null,
    banner: "",
    calculation_type: "",
    client_url:'',
   
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.value);
  };

  const addImage = () => {
    if (images.trim() && form_data.images) {
      setForm_data((prev) => ({
        ...prev,
        images: [...prev.images!, images.trim()],
      }));
      setImages("");
    }
  };
  // Remove Image Link
  const removeImage = (index: number) => {
    setForm_data((prev) => ({
      ...prev,
      images: prev.images!.filter((_, i) => i !== index),
    }));
  };

  const renderImagePreview = () => {
    return form_data.images!.map((image: string, index: number) => (
      <div key={index} className="flex items-center space-x-2">
        <img
          src={image}
          alt={`Preview ${index + 1}`}
          className="w-16 h-16 object-cover rounded"
        />
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="text-red-500 text-sm"
        >
          <i className="fa-solid fa-x text-xl"></i>
        </button>
      </div>
    ));
  };

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        category_list_api,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategoryList(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
  
    setForm_data((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      // Required fields validation
      const requiredFields = [
        "product_name",
        "brand_name",
        "price",
        "calculation_type",
        "cashback",
        "category",
        "product_status",
        "banner_status",
        "terms",
        "tags",
        "meta_title",
        "meta_description",
        "meta_keywords",
        "client_url",
      ];
  
      const missingFields = requiredFields.filter((field) => !(form_data as Record<string, any>)[field]);
  
      if (missingFields.length > 0) {
        toast.error(`${missingFields.join(", ")} is required.`);
        setLoading(false);
        return;
      }
  
      if (!editorContent.trim()) {
        toast.error("Description is required.");
        setLoading(false);
        return;
      }
  
      if (!form_data.images || form_data.images.length < 3) {
        toast.error("Please select at least three images.");
        setLoading(false);
        return;
      }
  
      if (form_data.images.length > 5) {
        toast.error("You can select a maximum of five images.");
        setLoading(false);
        return;
      }
  
      // Clone form data
      const formPayload = { ...form_data, description: editorContent };
  
      // Validate and process images (Assuming image URLs are stored)
      if (Array.isArray(form_data.images)) {
        formPayload.images = form_data.images.map((image) => image);
      } else {
        toast.error("Invalid file input.");
        setLoading(false);
        return;
      }
  
      // Validate banner selection
      if (form_data.banner_status === "active" || form_data.featured_p || form_data.add_poster) {
        if (!form_data.banner) {
          toast.error("Please select one banner type image.");
          setLoading(false);
          return;
        }
        formPayload.banner = form_data.banner;
      }
  
      // Validate flash sale time
      if (form_data.featured_p && !form_data.flash_time) {
        toast.error("Flash sale time is required.");
        setLoading(false);
        return;
      }
  
      console.log("Submitting:", formPayload);
  
      // Send JSON payload (file uploads should be handled separately)
      const { data } = await axios.post(add_product, JSON.stringify(formPayload), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      toast.success("Product added successfully!");
  
      setTimeout(() => {
        setForm_data({
          product_name: "",
          brand_name: "",
          price: "",
          cashback: "",
          hot_p: "",
          category: "",
          description: "",
          product_status: "active",
          banner_status: "active",
          images: [],
          terms: "",
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
          new_p: "",
          featured_p: "",
          tags: "",
          add_poster: "",
          arrival: "",
          flash_time: null,
          banner: "",
          calculation_type: "",
          client_url: "",
        }); // Reset form
        setEditorContent("");
      }, 2000);
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
  
  


  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Add Product
      </h1>
      
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
       
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <UploadImageGetLink />

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
              name="product_name"
              value={form_data.product_name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>
          <div>
            <label
              htmlFor="client_url"
              className="block text-sm font-medium text-gray-700"
            >
              Product url
            </label>
            <input
              type="text"
              id="client_url"
              name="client_url"
              value={form_data.client_url}
              onChange={handleChange}
              placeholder="Product url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
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
                name="brand_name"
                value={form_data.brand_name}
                onChange={handleChange}
                placeholder="Enter brand name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
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
                name="price"
                value={form_data.price}
                onChange={handleChange}
                placeholder="Enter product price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <div>
              <label
                htmlFor="cashback"
                className="block text-sm font-medium text-gray-700"
              >
                Cashback{" "}
                <span className="text-red-400">
                  {form_data.calculation_type == "Subtract"
                    ? "Subtract"
                    : form_data.calculation_type == "Division"
                    ? "Division"
                    : ""}
                </span>
              </label>
              <input
                type="number"
                id="cashback"
                name="cashback"
                value={form_data.cashback}
                onChange={handleChange}
                placeholder="Enter cashback"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="calculation_type"
                className="block text-sm font-medium text-gray-700"
              >
                Calculation type
              </label>
              <select
                id="calculation_type"
                name="calculation_type"
                value={form_data.calculation_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Calculation type
                </option>
                <option value="Subtract">By Numbers</option>
                <option value="Division">By Percentage</option>
              </select>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form_data.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                {categoryList.map((item: ICategory, i) => {
                  return (
                    <option key={i} value={item.slug}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-2">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700"
              >
                Product Images
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  id="images"
                  placeholder="add your image link"
                  name="images"
                  value={images}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm"
                >
                  Add
                </button>
              </div>

              <div id="imagePreview" className="mt-4 flex space-x-4">
                {renderImagePreview()}
              </div>
            </div>

            <div>
              <label
                htmlFor="banner"
                className="block text-sm font-medium text-gray-700"
              >
                Banner/Flash/Add
              </label>
              <input
                type="text"
                id="banner"
                name="banner"
                value={form_data.banner}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                onChange={handleChange}
              />

              {form_data.banner && (
                <img
                  src={form_data.banner}
                  alt={`Product image `}
                  className="w-32 h-24 object-cover mt-8 rounded-md"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hot Capmaign
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hot_p"
                    value="active"
                    onChange={handleChange}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Capmaign
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="new_p"
                    value="active"
                    onChange={handleChange}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Arrival
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="arrival"
                    value="active"
                    onChange={handleChange}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Add Poster
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="add_poster"
                    value="active"
                    onChange={handleChange}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Is Banner Deal
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="banner_status"
                    value="active"
                    onChange={handleChange}
                    checked={form_data.banner_status === "active"}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="banner_status"
                    onChange={handleChange}
                    value="inactive"
                    className="text-blue-500  "
                  />
                  <span className="ml-2 text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
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
                    onChange={handleChange}
                    checked={form_data.product_status === "active"}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="product_status"
                    onChange={handleChange}
                    value="inactive"
                    className="text-blue-500  "
                  />
                  <span className="ml-2 text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Flash Product
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured_p"
                    value="active"
                    onChange={handleChange}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                If select Fleah Product, Add Expire time also
              </label>
              {/* <input
                type="datetime-local"
                name="flash_time"
                value={form_data.flash_time ? form_data.flash_time.toISOString().split('T')[0] : ''}
                onChange={handleChange}
                placeholder="Expire time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              /> */}

              <DateTimePicker
                format="dd-MM-yyyy HH:mm:ss"
                onChange={(date: Date | null) =>
                  setForm_data((prevData) => ({
                    ...prevData,
                    flash_time: date ?? new Date(),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                value={form_data.flash_time}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Product Description
            </label>

            <TextEditor editorContent={editorContent} setEditorContent={setEditorContent}/>
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
              name="terms"
              value={form_data.terms}
              onChange={handleChange}
              placeholder="Enter terms & conditions"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                value={form_data.meta_title}
                onChange={handleChange}
                placeholder="Meta Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta keywords
              </label>
              <input
                type="text"
                name="meta_keywords"
                value={form_data.meta_keywords}
                onChange={handleChange}
                placeholder="Meta keyword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Description
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              value={form_data.meta_description}
              onChange={handleChange}
              placeholder="Meta description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="cashback"
              className="block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={form_data.tags}
              onChange={handleChange}
              placeholder="Enter Product Tag"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>

          <div className="text-right pt-20">
            <button
              type="reset"
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:outline-none  mr-6"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loding}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none "
            >
              {loding ? "On Process" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
