"use client";
import { blogType } from "@/constant";
import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import { category_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Filter = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      {/* Desktop Filters */}
      <div className="col-span-2 hidden md:block">
        <h1 className="text-lg text-secondary">Filters</h1>
        <FilterContent />
      </div>
      {/* Mobile Filters */}
      <div className="relative md:hidden">
        <div className="absolute top-[-42px] z-20 flex gap-3 items-center">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="h-10 w-10 rounded-full shadow-md flex justify-center items-center"
          >
            <i className="fa-solid fa-filter text-2xl text-primary hover:opacity-100 opacity-90"></i>
          </button>
          <span className="text-base text-secondary">Filters</span>
        </div>
        {showFilter && (
          <div
            style={{ background: "rgba(0, 0, 0, 0.3)" }}
            className="w-full fixed z-20 h-screen top-0 left-0"
          >
            <div className="h-screen w-[60%] min-w-[320px] bg-white relative p-2 pt-4">
              <p className="text-lg text-secondary">Filters</p>
              <button
                onClick={() => setShowFilter(false)}
                className="absolute top-4 right-4 opacity-70 hover:opacity-100"
              >
                <i className="fa-solid fa-xmark text-2xl text-secondary"></i>
              </button>
              <FilterContent />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Filter;

const FilterContent = () => {
  const [filters, setFilters] = useState({
    blog_type: null,
    time_filter: null,
    category: [],
  });



  console.log(filters)

  const token = useSelector((state: RootState) => state.user.token);
  const [categories, setCategories] = useState<ICategory[]>();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post(
        category_list_api,
        {},
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching categories:", error.response?.data.message);
        toast.error(error.response?.data.message || "Failed to fetch categories.");
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const timeFilters = [
    { id: 1, name: "Last 24 hours", slug: "l24h" },
    { id: 2, name: "Last 7 days", slug: "l7d" },
    { id: 3, name: "Last 15 days", slug: "l15d" },
    { id: 4, name: "Last 30 days", slug: "l30d" },
  ];

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;

    setFilters((prevFilters) => {
      if (type === "radio") {
        return { ...prevFilters, [name]: value };
      } else if (type === "checkbox") {
        const updatedCategories = checked
          ? [...prevFilters.category, value]
          : prevFilters.category.filter((cat) => cat !== value);

        return { ...prevFilters, category: updatedCategories };
      }
      return prevFilters;
    });
  };

  return (
    <div className="space-y-4 select-none">
      {/* Blog Type */}
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Blog Type</p>
        {blogType.map((item, i) => (
          <div key={i}>
            <input
              type="radio"
              id={`blog_${item}`}
              name="blog_type"
              value={item}
              checked={filters.blog_type === item}
              onChange={handleFilterChange}
            />
            <label htmlFor={`blog_${item}`} className="ml-2 text-sm text-dark capitalize">
              {item}
            </label>
          </div>
        ))}
      </div>
      {/* Category */}
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Category</p>
        {categories?.map((item, i) => (
          <div key={i}>
            <input
              type="checkbox"
              id={`category_${item.slug}`}
              name="category"
              value={item.slug}
              checked={filters.category.includes(item.slug)}
              onChange={handleFilterChange}
            />
            <label htmlFor={`category_${item.slug}`} className="ml-2 text-sm text-dark capitalize">
              {item.name}
            </label>
          </div>
        ))}
      </div>
      {/* Sort */}
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Sort</p>
        {timeFilters.map((item, i) => (
          <div key={i}>
            <input
              type="radio"
              id={`time_${item.slug}`}
              name="time_filter"
              value={item.slug}
              checked={filters.time_filter === item.slug}
              onChange={handleFilterChange}
            />
            <label htmlFor={`time_${item.slug}`} className="ml-2 text-sm text-dark capitalize">
              {item.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
