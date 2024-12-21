"use client";

import TextEditor from "@/app/admin/_admin_components/TextEditor";
import { generateSlug } from "@/helpers/client/client_function";
import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import { add_product, category_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface IFormData {
  product_name: string;
  brand_name: string;
  price: string;
  cashback: string;
  category: string;
  product_status: string;
  banner_status: string;
  images: FileList | null;
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
  slug_url_name: string;
  flash_time:Date | null;
}

const AddProduct = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const editorContent = useSelector((state: any) => state.editor.content);

  const [categoryList, setCategoryList] = useState([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [loding, setLoading] = useState<boolean>(false);

  const [form_data, setForm_data] = useState<IFormData>({
    product_name: "",
    brand_name: "",
    price: "",
    cashback: "",
    hot_p: "",
    category: "",
    product_status: "active",
    banner_status: "active",
    images: null,
    terms: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    new_p: "",
    featured_p: "",
    tags: "",
    add_poster: "",
    arrival: "",
    slug_url_name: "",
    flash_time: null,
  });


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      if (files.length < 3) {
        toast.error("Please select at least 3 images.");
      } else if (files.length > 5) {
        toast.error("You can select a maximum of 5 images.");
      } else {
        setImages(files);
        setForm_data((prev) => ({
          ...prev,
          images: files,
        }));
      }
    }
  };

  const renderImagePreview = () => {
    if (!images) return null;

    const fileArray = Array.from(images);
    return fileArray.map((file, index) => {
      const objectUrl = URL.createObjectURL(file);
      return (
        <img
          key={index}
          src={objectUrl}
          alt={`Product image ${index + 1}`}
          className="w-24 h-24 object-cover rounded-md"
          onLoad={() => URL.revokeObjectURL(objectUrl)}
        />
      );
    });
  };

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        category_list_api,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    setForm_data((prev) => {
      if (target instanceof HTMLInputElement) {
        if (target.type === "checkbox") {
          return { ...prev, [target.name]: target.checked };
        } else if (target.type === "file") {
          return { ...prev, [target.name]: target.files };
        } else if (target.name === "flash_time") {
          return { ...prev, [target.name]: new Date(target.value) };
        }
        else {
          return { ...prev, [target.name]: target.value };
        }
      } else if (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return { ...prev, [target.name]: target.value };
      }
      return prev;
    });
  };




  const handleSubmit = async () => {
    try {
      const requiredFields = [
        "product_name",
        "brand_name",
        "price",
        "cashback",
        "category",
        "product_status",
        "banner_status",
        "terms",
        "tags",
        "meta_title",
        "meta_description",
        "meta_keywords",
        "tags",
      ];

      for (const field of requiredFields) {
        if (!form_data[field as keyof typeof form_data]) {
          toast.error(`${field.replace("_", " ")} is required.`);
          return;
        }
      }

      if (!editorContent.trim()) {
        toast.error("Description is required.");
        return;
      }

      if (form_data.images == null) {
        toast.error("Please select at least Three image.");
        return;
      }

      const formPayload = new FormData();
      if (form_data.images && isFileList(form_data.images)) {
        Array.from(form_data.images).forEach((file) =>
          formPayload.append("images", file)
        );
      } else if (form_data.images !== null) {
        toast.error("Invalid file input.");
        return;
      }

      Object.entries(form_data).forEach(([key, value]) => {
        if (key !== "images" && value !== undefined && value !== null) {
          formPayload.append(key, String(value));
        }
      });
      formPayload.append("description", editorContent);
      const slug_url = generateSlug(form_data.slug_url_name);
      formPayload.append("slug_url", slug_url);

      setLoading(true);

      const { data } = await axios.post(add_product, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("data==>", data);

      toast.success("Product added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 4000);
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

  const isFileList = (value: unknown): value is FileList => {
    return value instanceof FileList;
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
              htmlFor="slug_url_name"
              className="block text-sm font-medium text-gray-700"
            >
              Slug Url name
            </label>
            <input
              type="text"
              id="slug_url_name"
              name="slug_url_name"
              value={form_data.slug_url_name}
              onChange={handleChange}
              placeholder="Slug Url name"
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

          <div className="grid grid-cols-2 gap-5">
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
                name="cashback"
                value={form_data.cashback}
                onChange={handleChange}
                placeholder="Enter cashback percentage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              onChange={handleImageChange}
            />

            <div id="imagePreview" className="mt-4 flex space-x-4">
              {renderImagePreview()}
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
              <input
                type="datetime-local"
                name="flash_time"
                value={form_data.flash_time ? form_data.flash_time.toISOString().split('T')[0] : ''}
                onChange={handleChange}
                placeholder="Expire time"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
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
