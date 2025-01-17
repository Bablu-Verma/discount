"use client";

import TextEditor from "@/app/admin/_admin_components/TextEditor";
import { category_details_api, category_edit_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setEditorData } from "@/redux-store/slice/editorSlice";
import { RootState } from "@/redux-store/redux_store";

interface IFormData {
  name: string;
  fontawesome: string;
  image: File | string | null;
  isActive: boolean;
  slug: string;
}

const EditCategory: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const editorContent = useSelector((state: any) => state.editor.content);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [form_data, setFormData] = useState<IFormData>({
    fontawesome: "",
    image: null,
    name: "",
    slug: "",
    isActive: true,
  });

  const urlslug = pathname.split("/").pop() || "";

  // Form Validation
  const validateForm = () => {
    const errors: string[] = [];

    if (!form_data.image) {
      errors.push("Image is required.");
    }
    if (!editorContent || editorContent.length < 100) {
      errors.push("Add a blog description with at least 100 characters.");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const getCategory = async () => {
    try {
      const { data } = await axios.post(
        category_details_api,
        { slug: urlslug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const main_data = data.data;

      setFormData({
        fontawesome: main_data.font_awesome_class,
        image: main_data.img,
        name: main_data.name,
        slug: main_data.slug,
        isActive: main_data.status,
      });
      dispatch(setEditorData(main_data.description));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching category");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  
  useEffect(() => {
    return () => {
      dispatch(setEditorData(""));
    };
  }, [dispatch]);

  
  useEffect(() => {
    getCategory();
  }, [urlslug]);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "isActive"
          ? value === "true" 
          : value,
    }));
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formPayload = new FormData();
    formPayload.append("slug", urlslug);


    formPayload.append("status", String(form_data.isActive));
    formPayload.append("description", editorContent);
    formPayload.append("font_awesome_class", form_data.fontawesome);
    if (form_data.image instanceof File) {
      formPayload.append("img", form_data.image);
    }

    try {
      setLoading(true);
      const { data } = await axios.post(category_edit_api, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Category updated successfully! Redirecting...");
      setTimeout(() => router.push("/admin/dashboard/all-category"), 3000);
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
        Edit Category
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form_data.name}
              readOnly
              placeholder="Category title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              value={form_data.slug}
              readOnly
              placeholder="Slug"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                onChange={handleImageChange}
              />
              {form_data.image && (
                <div className="flex justify-center items-center mb-6 mt-4">
                  <Image
                    src={
                      form_data.image instanceof File
                        ? URL.createObjectURL(form_data.image)
                        : form_data.image
                    }
                    alt="Category Image"
                    width={200}
                    height={200}
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="fontawesome"
                className="block text-sm font-medium text-gray-700"
              >
                Font Awesome Class
              </label>
              <input
                type="text"
                name="fontawesome"
                value={form_data.fontawesome}
                onChange={handleChange}
                placeholder="Font Awesome Class"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-5 items-center justify-end pr-10">
              <label className="text-sm font-medium text-gray-700">Is Active</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    onChange={handleChange}
                    checked={form_data.isActive === true}
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    onChange={handleChange}
                    checked={form_data.isActive === false}
                  />
                  <span className="ml-2 text-gray-700">No</span>
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

          <div className="text-right pt-20">
            <button
              type="reset"
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:outline-none mr-6"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
