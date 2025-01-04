"use client";

import TextEditor from "@/app/admin/_admin_components/TextEditor";
import { blogType } from "@/constant";

import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import { blog_details, blog_edit, category_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface IFormData {
  title: string;
  category: string;
  short_desc: string;
  blogType: string;
  isPublished: boolean;
  image: File | string | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage: File | null | string;
  twitterImage: File | string | null;
  tags: string[];
}

interface IBlogEditProps {
}

const EditBlog:React.FC<IBlogEditProps> = ({}) => {
  const token = useSelector((state: RootState) => state.user.token);
  const editorContent = useSelector((state: any) => state.editor.content);
  const pathname = usePathname()
  const router = useRouter()
  const [categoryList, setCategoryList] = useState([]);
  const [loding, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch()

   const urlslug = pathname.split("/").pop() || ""

  const [form_data, setForm_data] = useState<IFormData>({
    title: "",
    category: "",
    short_desc: "",
    blogType: "",
    isPublished: true,
    image: null,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    ogImage: null,
    twitterImage: null,
    tags: [],
  });

  const validateForm = () => {
    const errors: string[] = [];

    if (!form_data.title.trim()) {
      errors.push("Title is required.");
    }
    if (!form_data.category.trim()) {
      errors.push("Category is required.");
    }
    if (!form_data.short_desc.trim()) {
      errors.push("Short description is required.");
    }
    if (!form_data.blogType.trim()) {
      errors.push("Blog type is required.");
    }
    if (!form_data.image) {
      errors.push("Image is required.");
    }
    if (!form_data.ogImage) {
      errors.push("ogImage is required.");
    }
    if (!form_data.twitterImage) {
      errors.push("twitterImage is required.");
    }
    if (!editorContent) {
      errors.push("Add Blog description");
    } else {
      if (editorContent.length < 100) {
        errors.push("Add Blog description");
      }
    }
    if (!form_data.metaTitle.trim()) {
      errors.push("Meta title is required.");
    }
    if (!form_data.metaDescription.trim()) {
      errors.push("Meta description is required.");
    }
    if (form_data.metaKeywords.length === 0) {
      errors.push("At least one meta keyword is required.");
    }
    if (form_data.tags.length === 0) {
      errors.push("At least one tags is required.");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }

    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    console.log(files);

    if (files) {
      setForm_data((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
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

  const getBlogData = async () => {
    try {
      const { data } = await axios.post(
        blog_details,
        {
          slug:urlslug,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blogData = data.data;
      setForm_data({
        title: blogData.title,
        category: blogData.category,
        short_desc: blogData.short_desc,
        blogType: blogData.blogType,
        isPublished: blogData.isPublished,
        image: blogData.image,
        metaTitle: blogData.metaTitle,
        metaDescription: blogData.metaDescription,
        metaKeywords: blogData.metaKeywords,
        ogImage: blogData.ogImage,
        twitterImage: blogData.twitterImage,
        tags: blogData.tags,
      });
       dispatch(setEditorData(blogData.desc)); 
       toast.success("Blog details get successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(()=>{
    getBlogData()
  },[urlslug])

  useEffect(() => {
    getCategory();
    return ()=> {
    dispatch(setEditorData(''));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setForm_data((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "tags" || name === "metaKeywords"
          ? value.split(",").map((item) => item.trim())
          : name === "isPublished"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const formPayload = new FormData();

      formPayload.append("title", form_data.title);
      formPayload.append("category", form_data.category);
      formPayload.append("short_desc", form_data.short_desc);
      formPayload.append("blogType", form_data.blogType);
      formPayload.append("isPublished", String(form_data.isPublished));
      formPayload.append("metaTitle", form_data.metaTitle);
      formPayload.append("metaDescription", form_data.metaDescription);
      formPayload.append("description", editorContent);
      formPayload.append("slug", urlslug);

      formPayload.append(
        "metaKeywords",
        JSON.stringify(form_data.metaKeywords)
      );



      if (form_data.image instanceof File) {
        formPayload.append("image", form_data.image);
      }
      if (form_data.ogImage instanceof File) {
        formPayload.append("ogImage", form_data.ogImage);
      }
      if (form_data.twitterImage instanceof File) {
        formPayload.append("twitterImage", form_data.twitterImage);
      }

      formPayload.append("tags", JSON.stringify(form_data.tags));
      setLoading(true);
      const { data } = await axios.post(blog_edit, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Blog update successfully! we are redirect to blog list");

      setTimeout(() => {
        router.push('/admin/dashboard/blog-list')
      }, 3000);
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
        Edit Blog
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
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form_data.title}
              onChange={handleChange}
              placeholder="Add blog title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="blog_type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="blog_type"
                name="blogType"
                value={form_data.blogType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Select a Blog Type
                </option>
                {blogType.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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

          <div className="grid grid-cols-3 gap-5">
            <div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                  onChange={handleImageChange}
                />
              </div>
              {form_data.image && form_data.image instanceof File && (
                <div className="flex justify-center items-center mb-6 mt-4">
                  <Image
                    src={URL.createObjectURL(form_data.image)}
                    alt="Image"
                    width={200}
                    height={200}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}
                           {form_data.image && typeof form_data.image === "string" && (
                <div className="flex justify-center items-center mb-6 mt-4">
                  <Image
                    src={form_data.image}
                    alt="Image"
                    width={200}
                    height={200}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div>
              <div>
                <label
                  htmlFor="ogImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  OgImage
                </label>
                <input
                  type="file"
                  id="ogImage"
                  name="ogImage"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                  onChange={handleImageChange}
                />
              </div>
              {form_data.ogImage && form_data.ogImage instanceof File && (
                <div className="flex justify-center items-center mb-6 mt-4">
                  <Image
                    src={URL.createObjectURL(form_data.ogImage)}
                    alt="Image"
                    width={200}
                    height={200}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}

             {form_data.ogImage && typeof form_data.ogImage === "string" && (
                <div className="flex justify-center items-center mb-6 mt-4">
                  <Image
                    src={form_data.ogImage}
                    alt="Image"
                    width={200}
                    height={200}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <div>
                <label
                  htmlFor="twitterImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  TwitterImage
                </label>
                <input
                  type="file"
                  name="twitterImage"
                  id="twitterImage"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                  onChange={handleImageChange}
                />
              </div>
              {form_data.twitterImage &&
                form_data.twitterImage instanceof File && (
                  <div className="flex justify-center items-center mb-6 mt-4">
                    <Image
                      src={URL.createObjectURL(form_data.twitterImage)}
                      alt="Image"
                      width={200}
                      height={200}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}

{form_data.twitterImage && typeof form_data.twitterImage === "string" && (
                <div className="flex justify-center items-center mb-6 mt-4">
                  <Image
                    src={form_data.twitterImage}
                    alt="Image"
                    width={200}
                    height={200}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                isPublished
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublished"
                    value="true" // Value as a string
                    onChange={handleChange}
                    checked={form_data.isPublished === true} // Strict comparison with boolean
                    className="text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isPublished"
                    value="false" // Value as a string
                    onChange={handleChange}
                    checked={form_data.isPublished === false} // Strict comparison with boolean
                    className="text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="short_desc"
              className="block text-sm font-medium text-gray-700"
            >
              Short Description
            </label>
            <textarea
              id="short_desc"
              name="short_desc"
              value={form_data.short_desc}
              onChange={handleChange}
              placeholder="Enter short_desc"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            ></textarea>
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Blog Description
            </label>

            <TextEditor />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={form_data.metaTitle}
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
                name="metaKeywords"
                value={form_data.metaKeywords}
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
              id="metaDescription"
              name="metaDescription"
              value={form_data.metaDescription}
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
              {loding ? "Submit.." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBlog;
