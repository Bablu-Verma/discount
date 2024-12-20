"use client";
import React, { useState } from "react";
import { Range } from "react-range";

const Filter = () => {
  const [showfilter, setShowFilter] = useState(false);

  return (
    <>
      <div className="col-span-2 hidden md:block">
        <h1 className="text-lg text-secondary">Filters</h1>
        <Filter__ />
      </div>
      <div className="relative md:hidden">
        <div className="md:hidden absolute top-[-42px] z-20 flex gap-3 items-center">
          <button
            onClick={() => setShowFilter(!showfilter)}
            className="h-10 w-10 rounded-full shadow-md flex justify-center items-center"
          >
            <i className="fa-solid fa-filter text-2xl text-primary hover:opacity-100 opacity-90"></i>
          </button>
          <span className="text-base text-secondary">Filters</span>
        </div>
        {showfilter && (
          <div
            style={{ background: "rgba(0, 0, 0, 0.3)" }}
            className="w-full fixed z-20 h-screen top-0 left-0"
          >
            <div className="h-screen w-[60%] min-w-[320px] bg-white relative p-2 pt-4">
              <p className="text-lg text-secondary">Filters</p>
              <button
                onClick={() => setShowFilter(!showfilter)}
                className="absolute top-4 right-4 opacity-70 hover:opacity-100"
              >
                <i className="fa-solid fa-xmark text-2xl text-secondary"></i>
              </button>
              <Filter__ />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Filter;

const Filter__ = () => {
  const [filters, setFilters] = useState({
    credit_card: false,
    category: false,
    hot: false,
    new: false,
    featured: false,
    active: false,
  });

  const category = [
    {
      label: "Electronics",
      value: "electronics",
      id: 1,
    },
    {
      label: "Electronics",
      value: "electronics",
      id: 1,
    },
    {
      label: "Electronics",
      value: "electronics",
      id: 1,
    },
    {
      label: "Electronics",
      value: "electronics",
      id: 1,
    },
    {
      label: "Electronics",
      value: "electronics",
      id: 1,
    },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Blog Type</p>
        <div >
          <input
            type="checkbox"
            id="credit_card"
            name="credit_card"
          />
          <label htmlFor="credit_card" className="ml-2 text-sm text-dark capitalize">
            Credit Card
          </label>
        </div>
        <div>
          <input type="checkbox" id="incurance" name="incurance" />
          <label htmlFor="incurance" className="ml-2 text-sm text-dark capitalize">
            Incurance
          </label>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Categpry</p>
        {category.map((item, i) => {
          return (
            <div key={i}>
              <input type="checkbox" id={item.value} name={item.value} />
              <label htmlFor={item.value} className="ml-2 text-sm text-dark capitalize">
                {item.label}
              </label>
            </div>
          );
        })}
      </div>
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Short</p>
        <div className="mb-3">
          <input type="radio" id="lh" name="price_" value="lh" />
          <label htmlFor="lh" className="ml-2 text-sm text-dark capitalize">New to Old</label>
          <br />
          <input type="radio" id="hl" name="price_" value="hl" />
          <label htmlFor="hl" className="ml-2 text-sm text-dark capitalize">Old to New</label>
        </div>

        <div>
          <input type="radio" id="az" name="order_" value="az" />
          <label htmlFor="az" className="ml-2 text-sm text-dark capitalize">A to Z</label>
          <br />
          <input type="radio" id="za" name="order_" value="za" />
          <label htmlFor="za" className="ml-2 text-sm text-dark capitalize">Z to A</label>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-base mb-2 text-secondary capitalize">Trand</p>
        
        <div>
          <input
            type="checkbox"
            id="credit_card"
            name="credit_card"
            checked={filters.credit_card}
            onChange={handleChange}
          />
          <label htmlFor="credit_card" className="ml-2 text-sm text-dark capitalize">
            New
          </label>
        </div>
        
      </div>
     
      
    </div>
  );
};
