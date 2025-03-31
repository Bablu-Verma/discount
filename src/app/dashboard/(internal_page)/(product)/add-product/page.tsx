"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { RootState } from "@/redux-store/redux_store";
import {
  add_product,
  category_list_api,
  category_list_dashboard_api,
  list_store_api,
  list_store_dashboard_api,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export interface IClintCampaign {
  title: string;
  product_id: number;
  actual_price: number;
  cashback_: number | string;
  calculation_mode: "PERCENTAGE" | "FIX"; 
  store: string;
  category: string;
  redirect_url: string;
  img_array: string[];
  product_tags: string[];
  long_poster: { is_active: boolean; image: string }[];
  main_banner: { is_active: boolean; image: string }[];
  premium_product: { is_active: boolean; image: string }[];
  flash_sale: { is_active: boolean; image: string; end_time: Date | null }[];
  slug_type: "INTERNAL" | "EXTERNAL";
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  meta_robots: "index, follow" | "noindex, nofollow";
  canonical_url: string;
  structured_data: string;
  og_image: string;
  og_title: string;
  og_description: string;
  product_status: "ACTIVE" | "PAUSE";
}

const AddProduct = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState<
    { name: string; _id: string }[]
  >([]);
  const [storeList, setStoreList] = useState<{ name: string; _id: string }[]>(
    []
  );
  const [loding, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [editorT_and_c, setEditor_t_and_c] = useState("");
  const [images, setImages] = useState("");
  const [form_data, setForm_data] = useState<IClintCampaign>({
    title: "",
    product_id:0,
    actual_price: 0,
    cashback_: 0,
    calculation_mode: "" as "PERCENTAGE" | "FIX",
    store: "",
    category: "",
    redirect_url: "",
    img_array: [],
    product_tags: [],
    long_poster: [
      {
        is_active: false,
        image: "",
      },
    ],
    main_banner: [
      {
        is_active: false,
        image: "",
      },
    ],

    premium_product: [
      {
        is_active: false,
        image: "",
      },
    ],

    flash_sale: [
      {
        is_active: false,
        image: "",
        end_time: null,
      },
    ],
    slug_type: "INTERNAL" as "INTERNAL" | "EXTERNAL",
    meta_title: "",
    meta_description: "",
    meta_keywords: [],
    meta_robots: "index, follow" as "index, follow" | "noindex, nofollow",
    canonical_url: "",
    structured_data: "{}",
    og_image: "",
    og_title: "",
    og_description: "",
    product_status: "ACTIVE" as "ACTIVE" | "PAUSE",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, categoryRes] = await Promise.all([
          axios.post(
            list_store_dashboard_api,
            { store_status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(
            category_list_dashboard_api,
            { status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setStoreList(storeRes.data.data || []);
        setCategoryList(categoryRes.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

      const requiredFields = [
        "title",
        "actual_price",
        "cashback_",
        "calculation_mode",
        "store",
        "category",
        "redirect_url",
        "img_array",
        "product_tags",
        "slug_type",
        "meta_title",
        "meta_description",
        "meta_keywords",
        "product_status",
        "og_title",
        "og_image",
        "og_description",
        "canonical_url",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(form_data as Record<string, any>)[field]
      );

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
      if (!editorT_and_c.trim()) {
        toast.error("T and C is required.");
        setLoading(false);
        return;
      }

      // Clone form data
      const formPayload = { ...form_data, description: editorContent, t_and_c:editorT_and_c };

      // console.log("Submitting:", formPayload);

      // Send JSON payload (file uploads should be handled separately)
      const { data } = await axios.post(
        add_product,
        JSON.stringify(formPayload),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Product added successfully!");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.value);
  };
  const addImage = () => {
    if (images.trim() && form_data.img_array) {
      setForm_data((prev) => ({
        ...prev,
        img_array: [...prev.img_array!, images.trim()],
      }));
      setImages("");
    }
  };

  // Remove Image Link
  const removeImage = (index: number) => {
    setForm_data((prev) => ({
      ...prev,
      img_array: prev.img_array!.filter((_, i) => i !== index),
    }));
  };

  const renderImagePreview = () => {
    return form_data.img_array!.map((image: string, index: number) => (
      <div key={index} className="flex items-center space-x-2">
        <img
          src={image}
          alt={`Preview ${index + 1}`}
          className="w-16 h-16 object-cover rounded"
        />
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="text-red-500 flex justify-center items-center bg-gray-200 rounded-full w-5 h-5"
        >
          <i className="fa-solid fa-x text-[12px]"></i>
        </button>
      </div>
    ));
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Add Product
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form_data.title}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>
          <div>
            <label
              htmlFor="redirect_url"
              className="block text-sm font-medium text-gray-700"
            >
              Redirect url
            </label>
            <input
              type="text"
              id="redirect_url"
              name="redirect_url"
              value={form_data.redirect_url}
              onChange={handleChange}
              placeholder="Product url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="store"
                className="block text-sm font-medium text-gray-700"
              >
                Store Name
              </label>
              <select
                id="store"
                name="store"
                value={form_data.store}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Slected Store
                </option>
                {storeList.map((item, i) => {
                  return <option value={item._id}>{item.name}</option>;
                })}
              </select>
            </div>
            <div className="">
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
                {categoryList.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="actual_price"
                className="block text-sm font-medium text-gray-700"
              >
                Actual Price
              </label>
              <input
                type="number"
                id="actual_price"
                name="actual_price"
                value={form_data.actual_price}
                onChange={handleChange}
                placeholder="Enter Actual product price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>

            <div>
              <label
                htmlFor="Cashback_"
                className="block text-sm font-medium text-gray-700"
              >
                Cashback
                <span className="text-red-400">
                  {form_data.calculation_mode == "PERCENTAGE"
                    ? " - PERCENTAGE"
                    : form_data.calculation_mode == "FIX"
                    ? " - FIX"
                    : ""}
                </span>
              </label>
              <input
                type="number"
                id="Cashback_"
                name="cashback_"
                value={form_data.cashback_}
                onChange={handleChange}
                placeholder="Enter  Amount / Persantage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="calculation_mode"
                className="block text-sm font-medium text-gray-700"
              >
                Calculation mode
              </label>
              <select
                id="calculation_mode"
                name="calculation_mode"
                value={form_data.calculation_mode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  calculation_mode
                </option>
                <option value="PERCENTAGE">PERCENTAGE</option>
                <option value="FIX">FIX</option>
              </select>
            </div>
          </div>
          <div className="">
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
                className="px-4 py-2 ml-5 w-[260px] bg-blue-500 text-white rounded-lg shadow-sm"
              >
                Add
              </button>
            </div>

            <div id="imagePreview" className="mt-4 flex space-x-6">
              {renderImagePreview()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="product_tags"
                className="block text-sm font-medium text-gray-700"
              >
                Product tags - "new" | "hot" | "best"
              </label>
              <input
                type="text"
                name="product_tags"
                value={form_data.product_tags.join(", ")}
                onChange={(e) =>
                  setForm_data({
                    ...form_data,
                    product_tags: e.target.value.split(","),
                  })
                }
                placeholder="Product Tags Keywords (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>

            <div>
              <label
                htmlFor="slug_type"
                className="block text-sm font-medium text-gray-700"
              >
                Slug type
              </label>
              <select
                id="slug_type"
                name="slug_type"
                value={form_data.slug_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  slug_type
                </option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="EXTERNAL">EXTERNAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Long Poster Section */}
            <div>
              <label
                htmlFor="long_poster"
                className="block text-sm font-medium text-gray-700"
              >
                Long Poster
              </label>
              {/* Yes Radio */}
              <input
                type="radio"
                id="long_posterYes"
                name="long_poster"
                checked={form_data.long_poster[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    long_poster: [{ ...prev.long_poster[0], is_active: true }],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="long_posterYes">
                Yes
              </label>

              {/* No Radio */}
              <input
                type="radio"
                id="long_posterNo"
                name="long_poster"
                value="No"
                checked={!form_data.long_poster[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    long_poster: [
                      { ...prev.long_poster[0], is_active: false, image: "" },
                    ],
                  }))
                }
              />
              <label htmlFor="long_posterNo">No</label>

              {/* Image Input (Visible only if Yes is selected) */}
              {form_data.long_poster[0].is_active && (
                <input
                  type="text"
                  name="long_poster_image"
                  value={form_data.long_poster[0].image}
                  onChange={(e) =>
                    setForm_data((prev) => ({
                      ...prev,
                      long_poster: [
                        { ...prev.long_poster[0], image: e.target.value },
                      ],
                    }))
                  }
                  placeholder="Enter Long Poster Image Link"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              )}
            </div>

            {/* Main Banner Section */}
            <div>
              <label
                htmlFor="main_banner"
                className="block text-sm font-medium text-gray-700"
              >
                Main Banner
              </label>
              {/* Yes Radio */}
              <input
                type="radio"
                id="main_bannerYes"
                name="main_banner"
                checked={form_data.main_banner[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    main_banner: [{ ...prev.main_banner[0], is_active: true }],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="main_bannerYes">
                Yes
              </label>

              {/* No Radio */}
              <input
                type="radio"
                id="main_bannerNo"
                name="main_banner"
                value="No"
                checked={!form_data.main_banner[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    main_banner: [
                      { ...prev.main_banner[0], is_active: false, image: "" },
                    ],
                  }))
                }
              />
              <label htmlFor="main_bannerNo">No</label>

              {/* Image Input (Visible only if Yes is selected) */}
              {form_data.main_banner[0].is_active && (
                <input
                  type="text"
                  name="main_banner_image"
                  value={form_data.main_banner[0].image}
                  onChange={(e) =>
                    setForm_data((prev) => ({
                      ...prev,
                      main_banner: [
                        { ...prev.main_banner[0], image: e.target.value },
                      ],
                    }))
                  }
                  placeholder="Enter Main Banner Image Link"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="premium_product"
                className="block text-sm font-medium text-gray-700"
              >
                Premium Product
              </label>
              <input
                type="radio"
                id="premium_productYes"
                name="premium_product"
                checked={form_data.premium_product[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    premium_product: [
                      { ...prev.premium_product[0], is_active: true },
                    ],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="premium_productYes">
                Yes
              </label>

              <input
                type="radio"
                id="premium_productNo"
                name="premium_product"
                value="No"
                checked={!form_data.premium_product[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    premium_product: [
                      {
                        ...prev.premium_product[0],
                        is_active: false,
                        image: "",
                      },
                    ],
                  }))
                }
              />
              <label htmlFor="premium_productNo">No</label>

              {form_data.premium_product[0].is_active && (
                <input
                  type="text"
                  name="premium_product_image"
                  value={form_data.premium_product[0].image}
                  onChange={(e) =>
                    setForm_data((prev) => ({
                      ...prev,
                      premium_product: [
                        { ...prev.premium_product[0], image: e.target.value },
                      ],
                    }))
                  }
                  placeholder="Enter Premium Product Image Link"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              )}
            </div>

            {/* Flash Sale Section */}
            <div>
              <label
                htmlFor="flash_sale"
                className="block text-sm font-medium text-gray-700"
              >
                Flash Sale
              </label>
              <input
                type="radio"
                id="flash_saleYes"
                name="flash_sale"
                checked={form_data.flash_sale[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    flash_sale: [{ ...prev.flash_sale[0], is_active: true }],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="flash_saleYes">
                Yes
              </label>

              <input
                type="radio"
                id="flash_saleNo"
                name="flash_sale"
                value="No"
                checked={!form_data.flash_sale[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    flash_sale: [
                      {
                        ...prev.flash_sale[0],
                        is_active: false,
                        image: "",
                        end_time: null,
                      },
                    ],
                  }))
                }
              />
              <label htmlFor="flash_saleNo">No</label>

              {form_data.flash_sale[0].is_active && (
                <>
                  <input
                    type="text"
                    name="flash_sale_image"
                    value={form_data.flash_sale[0].image}
                    onChange={(e) =>
                      setForm_data((prev) => ({
                        ...prev,
                        flash_sale: [
                          { ...prev.flash_sale[0], image: e.target.value },
                        ],
                      }))
                    }
                    placeholder="Enter Flash Sale Image Link"
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                  />
                  <DateTimePicker
                    format="dd-MM-yyyy HH:mm:ss"
                    onChange={(date) =>
                      setForm_data((prev) => ({
                        ...prev,
                        flash_sale: [
                          {
                            ...prev.flash_sale[0],
                            end_time: date ?? new Date(),
                          },
                        ],
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                    value={
                      form_data.flash_sale[0].end_time
                        ? new Date(form_data.flash_sale[0].end_time) // Convert string to Date
                        : new Date() // Default value
                    }
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="product_status"
                className="block text-sm font-medium text-gray-700"
              >
                Product status
              </label>
              <select
                id="product_status"
                name="product_status"
                value={form_data.product_status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  product_status
                </option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAUSE">PAUSE</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Product description
            </label>
            <TextEditor
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </div>
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Tream and condition
            </label>
            <TextEditor
              editorContent={editorT_and_c}
              setEditorContent={setEditor_t_and_c}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="meta_title"
                className="block text-sm font-medium text-gray-700"
              >
                meta_title
              </label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={form_data.meta_title}
                onChange={handleChange}
                placeholder="Enter meta title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="meta_keywords"
                className="block text-sm font-medium text-gray-700"
              >
                meta_keywords
              </label>
              <input
                type="text"
                name="meta_keywords"
                value={form_data.meta_keywords.join(", ")}
                onChange={(e) =>
                  setForm_data({
                    ...form_data,
                    meta_keywords: e.target.value.split(","),
                  })
                }
                placeholder="Product meta_keywords (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium text-gray-700"
            >
              meta_description
            </label>
            <input
              type="text"
              id="meta_description"
              name="meta_description"
              value={form_data.meta_description}
              onChange={handleChange}
              placeholder="Enter meta_description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="meta_description"
                className="block text-sm font-medium text-gray-700"
              >
                canonical_url
              </label>
              <input
                type="text"
                id="canonical_url"
                name="canonical_url"
                value={form_data.canonical_url}
                onChange={handleChange}
                placeholder="Enter canonical_url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="meta_robots"
                className="block text-sm font-medium text-gray-700"
              >
                meta_robots
              </label>
              <select
                id="meta_robots"
                name="meta_robots"
                value={form_data.meta_robots}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  meta_robots
                </option>
                <option value="index, follow">index, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="og_image"
                className="block text-sm font-medium text-gray-700"
              >
                og_image link
              </label>
              <input
                type="text"
                id="og_image"
                name="og_image"
                value={form_data.og_image}
                onChange={handleChange}
                placeholder="Enter og_image link"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="og_title"
                className="block text-sm font-medium text-gray-700"
              >
                og_title
              </label>
              <input
                type="text"
                id="og_title"
                name="og_title"
                value={form_data.og_title}
                onChange={handleChange}
                placeholder="Enter og_title "
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="og_description"
              className="block text-sm font-medium text-gray-700"
            >
              og_description
            </label>
            <input
              type="text"
              id="og_description"
              name="og_description"
              value={form_data.og_description}
              onChange={handleChange}
              placeholder="Enter og_description "
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>

          <div className="text-right">
            <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg" disabled={loding}>
              {loding ? "In Progress" : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
