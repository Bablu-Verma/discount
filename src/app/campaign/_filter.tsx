"use client";
import React, { useState } from "react";

const Filter = () => {
  const [showfilter, setShowFilter] = useState(false);
  return (
    <>
      <div className="col-span-2 hidden md:block">
        <h1 className="text-lg text-secondary">Filters </h1>
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
          <span className="text-base text-secondary ">Filters</span>
        </div>
        {showfilter && (
          <div
            style={{ background: "rgba(0, 0, 0, 0.3)" }}
            className="w-full fixed z-20 h-screen top-0 left-0 "
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
  return (<div>
    
  <input type="checkbox" id="cradit_card" name="cradit_card" value="cradit_card" />
  <label htmlFor="cradit_card">Cradit Card</label>
  
  </div>);
};
