"use client";

import { ICategory } from "@/model/CategoryModel";
import { RootState } from "@/redux-store/redux_store";
import {
  defaultFilterData,
  resetFilters,
  setFilterData,
} from "@/redux-store/slice/ProductFilterSlice";
import { category_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";

const Filter = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <div className="col-span-2 hidden md:block">
        <h1 className="text-lg text-secondary">Filters</h1>
        <FilterContent />
      </div>
      <div className="relative md:hidden">
        <div className="md:hidden absolute top-[-42px] z-20 flex gap-3 items-center">
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
                onClick={() => setShowFilter(!showFilter)}
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
  const [filterData, setFilterDataState] = useState(defaultFilterData);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const token = useSelector((state: RootState) => state.user.token);

  const dispatch = useDispatch();

  const fetchCategories = async () => {
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
      setCategories(data.data || []);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || "Failed to fetch categories"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handlers
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilterDataState((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, name]
        : prev.categories.filter((category) => category !== name),
    }));
  };

  const handleTrendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilterDataState((prev) => ({
      ...prev,
      trends: checked
        ? [...prev.trends, name]
        : prev.trends.filter((trend) => trend !== name),
    }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilterDataState((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSortDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilterDataState((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleRangeChange = (values: number[]) => {
    setFilterDataState((prev) => ({ ...prev, amount: values }));
  };

  const handleClearFilters = () => {
    setFilterDataState(defaultFilterData);
    dispatch(resetFilters());
  };

  const handleApplyFilters = () => {
    dispatch(setFilterData(filterData));
  };

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Category</p>
        {categories.map((item, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={item.slug}
              name={item.slug}
              onChange={handleCategoryChange}
              checked={filterData.categories.includes(item.slug)}
            />
            <label
              htmlFor={item.slug}
              className="ml-2 text-sm text-dark capitalize"
            >
              {item.name}
            </label>
          </div>
        ))}
      </div>

      {/* Sorting Filters */}
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Sort</p>
        <div className="mb-3">
          <input
            type="radio"
            id="low_high"
            name="price"
            value="low_high"
            onChange={handleSortChange}
            checked={filterData.price === "low_high"}
          />
          <label
            htmlFor="low_high"
            className="ml-2 text-sm text-dark capitalize"
          >
            Low to High Price
          </label>
          <br />
          <input
            type="radio"
            id="high_low"
            name="price"
            value="high_low"
            onChange={handleSortChange}
            checked={filterData.price === "high_low"}
          />
          <label
            htmlFor="high_low"
            className="ml-2 text-sm text-dark capitalize"
          >
            High to Low Price
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="a_to_z"
            name="order"
            value="a_to_z"
            onChange={handleSortChange}
            checked={filterData.order === "a_to_z"}
          />
          <label htmlFor="a_to_z" className="ml-2 text-sm text-dark capitalize">
            A to Z
          </label>
          <br />
          <input
            type="radio"
            id="z_to_a"
            name="order"
            value="z_to_a"
            onChange={handleSortChange}
            checked={filterData.order === "z_to_a"}
          />
          <label htmlFor="z_to_a" className="ml-2 text-sm text-dark capitalize">
            Z to A
          </label>
        </div>
      </div>

      {/* Sorting Filters days */}
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Day</p>
        <div className="mb-3">
          <input
            type="radio"
            id="dayOne"
            name="day"
            value={1}
            onChange={handleSortDayChange}
            checked={filterData.day === 1}
          />
          <label
            htmlFor="dayOne"
            className="ml-2 text-sm text-dark capitalize"
          >
            Today
          </label>
          <br />
          <input
            type="radio"
            id="daySeven"
            name="day"
            value={7}
            onChange={handleSortDayChange}
            checked={filterData.day === 7}
          />
          <label
            htmlFor="daySeven"
            className="ml-2 text-sm text-dark capitalize"
          >
           7 days
          </label>
          <br />
          <input
            type="radio"
            id="dayThirty"
            name="day"
            value={30}
            onChange={handleSortDayChange}
            checked={filterData.day === 30}
          />
          <label htmlFor="dayThirty" className="ml-2 text-sm text-dark capitalize">
            30 days
          </label>
          <br />
          <input
            type="radio"
            id="dayNinty"
            name="day"
            value={90}
            onChange={handleSortDayChange}
            checked={filterData.day === 90}
          />
          <label htmlFor="dayNinty" className="ml-2 text-sm text-dark capitalize">
            90 days
          </label>
        </div>
 
      </div>

      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Trend</p>
        {["hot", "new", "featured"].map((filterKey) => (
          <div key={filterKey}>
            <input
              type="checkbox"
              id={filterKey}
              name={filterKey}
              checked={filterData.trends.includes(filterKey)}
              onChange={handleTrendChange}
            />
            <label
              htmlFor={filterKey}
              className="ml-2 text-sm text-dark capitalize"
            >
              {filterKey}
            </label>
          </div>
        ))}
      </div>

      {/* Range Filter */}
      <div className="max-w-[220px] mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Amount</p>
        <span className="text-secondary text-xl inline-block mb-3">
          ₹{filterData.amount[0]} - ₹{filterData.amount[1]}
        </span>
        <Range
          step={100}
          min={0}
          max={100000}
          values={filterData.amount}
          onChange={handleRangeChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#212121",
                borderRadius: "10px",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={(params) => (
            <div
              {...params.props}
              key={params.index}
              style={{
                ...params.props.style,
                height: "16px",
                width: "16px",
                backgroundColor: "#d85134",
                borderRadius: "50%",
              }}
            />
          )}
        />
      </div>
      <div style={{ marginTop: "30px" }} className=""></div>
      <hr className="divide-x-2" />
      <div style={{ marginTop: "30px" }} className=""></div>
      <div className="flex justify-around items-center mt-5">
        <button
          className="text-sm bg-red-300 py-1 px-5 rounded-md"
          type="button"
          onClick={handleClearFilters}
        >
          Clear
        </button>
        <button
          className="text-sm bg-blue-300 py-1 px-5 rounded-md"
          type="button"
          onClick={handleApplyFilters}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
