"use client"

import { RootState } from '@/redux-store/redux_store';
import { wishlist_add_ } from '@/utils/api_url';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


interface IWAadProps {
    id: String;
}

const Watchlistadd:React.FC<IWAadProps> = ({id}) => {
  const [isAdding, setIsAdding] = useState(false); 
  const token = useSelector((state: RootState) => state.user.token);

  const router = useRouter();

  const add_list = async () => {

    if (!token) {
       return router.push('/login');
     }



    if (isAdding) return; 
    setIsAdding(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      const { data } = await axios.post(
        wishlist_add_,
        {
            campaign_id:id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Added to wishlist successfully!');
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error ", error.response?.data.message);
            toast.error(error.response?.data.message);
          } else {
            console.error("Unknown error", error);
          }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={add_list}
      title={token?"Add to Wishlist":"Login to Add Wishlist"}
      aria-label="Add to Wishlist"
      role="button"
      disabled={isAdding} 
      className={`py-2 px-5 text-center outline-none border-none text-secondary duration-200 ${
        isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary'
      }`}
    >
      <i className="fa-regular fa-heart text-2xl mr-1"></i>
      <i className="fa-solid fa-plus text-sm"></i>
    </button>
  );
};

export default Watchlistadd;
