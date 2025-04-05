"use client";

import React, { useState } from "react";

interface IStoreDesc {
  html_: string;
}

export const StoreDesc: React.FC<IStoreDesc> = ({ html_ }) => {
    const [open, setOpen] = useState(false)
  return (
  <div className='relative'>
   <div className={`${open ? 'h-auto':'h-12'} relative overflow-hidden pt-2`}>
     <div
      className=" text-sm text-white text-left"
      dangerouslySetInnerHTML={{ __html: html_ }}
    />
   </div>
   <button className="text-[12px] text-white  font-medium  inline-block  " onClick={()=>setOpen(!open)} type="button">{open?'Show Less':"Show More"}</button>
  </div>
  );
};