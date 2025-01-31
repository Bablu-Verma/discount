"use client";


import { ICampaign } from "@/model/CampaignModel";
import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import {
  product_edit_,
  category_list_api,
  product_details_,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import DateTimePicker from "react-datetime-picker";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import TextEditor from "@/app/dashboard/_components/TextEditor";

interface IFormData {
  _id: string;
  title: string;
  brand_name: string;
  price: string;
  cashback: string;
  category: string;
  active: string;
  banner: string;
  images: string[] | null;
  tc: string;
  hot: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  new: boolean;
  featured: boolean;
  tags: string;
  add_poster: boolean;
  banner_img:string;
  arrival: boolean;
  calculation_type: string;
  expire_time: Date | null;
}
const EditProduct = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const editorContent = useSelector((state: any) => state.editor.content);
  const [productDetails, setProductDetails] = useState<ICampaign>();
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [images, setImages] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const [imagesbanner, setImagesbanner] = useState<File | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const [form_data, setForm_data] = useState<IFormData>({
    _id: "",
    title: "",
    brand_name: "",
    price: "",
    cashback: "",
    category: "",
    active: "active",
    banner: "active",
    images: [],
    tc: "",
    hot: false,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    new: false,
    featured: false,
    tags: "",
    add_poster: false,
    arrival: false,
    expire_time: null,
    calculation_type: "",
    banner_img:''
  });

  useEffect(() => {
    getCategory();
  }, []);

  const urlslug = pathname.split("/").pop() || "";

  const GetData = async (slug: string) => {
    try {
      let { data } = await axios.post(
        product_details_,
        {
          slug: slug,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setProductDetails(data.data);
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    if(urlslug){
      GetData(urlslug);
    }
    
  }, [urlslug]);
  console.log(productDetails?.img)

  useEffect(() => {
    setForm_data({
      _id: productDetails?._id || "",
      title: productDetails?.title || "",
      brand_name: productDetails?.brand || "",
      price: productDetails?.price || "",
      cashback: productDetails?.cashback || "",
      category: productDetails?.category || "",
      active: productDetails?.active == true ? "active" : "inactive",
      banner: productDetails?.banner == true ? "active" : "inactive",
      images: productDetails?.img || [],
      tc: productDetails?.tc || "",
      meta_title: productDetails?.meta_title || "",
      meta_description: productDetails?.meta_description || "",
      meta_keywords: productDetails?.meta_keywords || "",
      new: !!productDetails?.new,
      hot: !!productDetails?.hot,
      featured: !!productDetails?.featured,
      add_poster: !!productDetails?.add_poster,
      arrival: !!productDetails?.arrival,
      calculation_type: productDetails?.calculation_type || "",
      tags: productDetails?.tags || "",
      expire_time: productDetails?.expire_time
        ? new Date(productDetails.expire_time)
        : null,
        banner_img:productDetails?.banner_img || ''
    });

    dispatch(setEditorData(productDetails?.description || ""));
    return(()=>{
      dispatch(setEditorData(""));
    })
  }, [productDetails, dispatch]);



  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        category_list_api,
        {},
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
        toast.error(
          error.response?.data?.message || "Error fetching categories"
        );
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  

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
        }else {
          return { ...prev, [target.name]: target.value };
        }
      } else {
        return { ...prev, [target.name]: target.value };
      }
    });
  };

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

  const handleSubmit = async () => {

    try {
      if (!editorContent.trim()) {
        toast.error("Description is required.");
        return;
      }
      const formPayload = new FormData();

      
      if (!form_data.images || form_data.images.length < 3) {
        toast.error("Please select at least three images.");
        return;
      }
      
      if (!form_data.images || form_data.images.length > 5) {
        toast.error("You can select a maximum of five images.");
        return;
      }

      if (form_data.featured) {
        if (form_data.expire_time == null) {
          toast.error("Flash sale time is required.");
          return;
        } else {
          
        }
      }


      if (
        form_data.banner === "active" ||
        form_data.featured ||
        form_data.add_poster
      ) {
        if (!form_data.banner_img) {
          toast.error("Please select one banner type image.");
          return;
        } else {
          
          formPayload.append("banner_img", form_data.banner_img);
        }
      }

      Object.entries(form_data).forEach(([key, value]) => {
        if (key === "images" && value) {
          if (Array.isArray(value)) {
            value.forEach((image) => formPayload.append("images", image));
          }
        } else {
          formPayload.append(key, String(value));
        }
      });
      formPayload.append("description", editorContent);
      if (productDetails?.campaign_id !== undefined) {
        formPayload.append("campaignId", String(productDetails.campaign_id));
      }
      
      setLoading(true);
      const { data } = await axios.post(product_edit_, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product updated successfully!");
      setTimeout(()=>{
        window.location.href = "/admin/dashboard/all-products";
      },200)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error updating product");
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
        Edit Product
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <h4 className="mb-3 text-base text-secondary select-none font-semibold">
          Product id: #{productDetails?.campaign_id}
        </h4>
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
              name="title"
              value={form_data.title}
              onChange={handleChange}
              placeholder="Enter product name"
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
                placeholder="Enter cashback percentage"
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
                <option value="Subtract">Subtract</option>
                <option value="Division">Division</option>
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

          <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Images (min 3)
                </label>
               <div className="flex gap-2">
               <input
                  type="text"
                  id="images"
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
                  name="banner_img"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                  onChange={handleChange}
                />

                  {form_data?.banner_img  && (
                    <img src={form_data.banner_img} className="w-44 h-20 mt-3 rounded-md"  alt="banner image" />
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
                    name="hot"
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
                    name="new"
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
                    name="banner"
                    value="active"
                    onChange={handleChange}
                    checked={form_data.banner === "active"}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="banner"
                    checked={form_data.banner === "inactive"}
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
                    name="active"
                    value="active"
                    onChange={handleChange}
                    checked={form_data.active === "active"}
                    className="text-blue-500 "
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="product_status"
                    onChange={handleChange}
                    checked={form_data.active === "inactive"}
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
                    checked={form_data.featured}
                    name="featured"
                    value="actve"
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

              <div className="">
                {/* <label className="block mb-2 text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <DatePicker
                  selected={form_data.expire_time}
                  onChange={(date) => handel_date_change(date)}
                  className="px-3 py-2 text-sm border border-gray-300 max-w-[150px] rounded-md focus:outline-none focus:border-primary"
                /> */}
                <DateTimePicker
                                format="dd-MM-yyyy HH:mm:ss"
                                onChange={(date: Date | null) =>
                                  setForm_data((prevData) => ({
                                    ...prevData,
                                    expire_time: date ?? new Date(),
                                  }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                                value={form_data.expire_time}
                              />
              </div>

             
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
              name="tc"
              value={form_data.tc}
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
              disabled={loading}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none "
            >
              {loading ? "On Process" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
