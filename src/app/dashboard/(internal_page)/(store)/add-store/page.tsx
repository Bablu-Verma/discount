"use client";

import TextEditor from "@/app/dashboard/_components/TextEditor";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import { RootState } from "@/redux-store/redux_store";
import { add_store_api, category_add_api, category_list_dashboard_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    store_img: "", 
    cashback_status: "ACTIVE_CASHBACK" as "ACTIVE_CASHBACK" | "INACTIVE_CASHBACK",
    store_link: "",
    cashback_type: "PERCENTAGE" as "PERCENTAGE" | "FLAT_AMOUNT",
    cashback_rate: "",
    store_status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    category: "",
    tracking: '',
    upto_amount:'',
    claim_form: 'INACTIVE_CLAIM_FORM' as  'ACTIVE_CLAIM_FORM' | 'INACTIVE_CLAIM_FORM'
  });

  const [editorContent, setEditorContent] = useState("");
  const [editorContentTc, setEditorContentTc] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);
  const [categoryList, setCategoryList] = useState<
    { name: string; _id: string }[]
  >([]);




  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, store_img, upto_amount, cashback_status, claim_form, store_link, cashback_type, cashback_rate, store_status,category,tracking } = formData;

    if (!name.trim()) return toast.error("Please enter a store name.");
    if (!store_img.trim()) return toast.error("Please enter a store image link.");
    if (!store_link.trim()) return toast.error("Please enter a store link.");
    if (!cashback_rate.trim()) return toast.error("Please enter a cashback amount.");
    if (isNaN(Number(cashback_rate)) || Number(cashback_rate) <= 0) return toast.error("Cashback amount must be a valid number greater than zero.");


    if (!store_link) return toast.error("Please enter a valid store link URL.");

    if (!editorContent.trim()) return toast.error("Please enter a store dec.");
    if (!editorContentTc.trim()) return toast.error("Please enter a store  tc.");
    if (!category.trim()) return toast.error("Please add category.");
    if (!tracking.trim()) return toast.error("Please store tracking time dec.");

    setLoading(true);

    try {
      const { data } = await axios.post(
        add_store_api,
        {
          name,
          description: editorContent,
          store_img,
          cashback_status,
          store_link,
          cashback_type,
          cashback_rate,
          store_status,
          tc:editorContentTc,
          upto_amount,
          category,
          tracking,
          claim_form
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



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes] = await Promise.all([

          axios.post(
            category_list_dashboard_api,
            { status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);
        setCategoryList(categoryRes.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);


  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">Add Store</h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <UploadImageGetLink />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter store name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Store Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Link</label>
              <input
                type="text"
                name="store_link"
                value={formData.store_link}
                onChange={handleInputChange}
                placeholder="Enter store link"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Store Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
              <input
                type="text"
                name="store_img"
                value={formData.store_img}
                onChange={handleInputChange}
                placeholder="Add store image link"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Rate</label>
              <input
                type="number"
                name="cashback_rate"
                value={formData.cashback_rate}
                onChange={handleInputChange}
                placeholder="Enter cashback cashback_rate"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cashback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Type</label>
              <select
                name="cashback_type"
                value={formData.cashback_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">PERCENTAGE</option>
                <option value="FLAT_AMOUNT">FLAT_AMOUNT</option>
              </select>
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">claim_form</label>
              <select
                name="claim_form"
                value={formData.claim_form}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE_CLAIM_FORM" >ACTIVE_CLAIM_FORM</option>
                <option value="INACTIVE_CLAIM_FORM">INACTIVE_CLAIM_FORM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Status</label>
              <select
                name="cashback_status"
                value={formData.cashback_status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE_CASHBACK">ACTIVE_CASHBACK</option>
                <option value="INACTIVE_CASHBACK">INACTIVE_CASHBACK</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">max purchase Amount</label>
              <input
                type="text"
                name="upto_amount"
                value={formData.upto_amount}
                onChange={handleInputChange}
                placeholder="Enter max purchase Amount "
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tracking time</label>
              <input
                type="text"
                name="tracking"
                value={formData.tracking}
                onChange={handleInputChange}
                placeholder="Enter tracking time "
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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


          {/* Store Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Status</label>
            <select
              name="store_status"
              value={formData.store_status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
            <TextEditor editorContent={editorContent} setEditorContent={setEditorContent} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store tC</label>
            <TextEditor editorContent={editorContentTc} setEditorContent={setEditorContentTc} />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg" disabled={loading}>
              {loading ? "In Progress" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddStore;
