"use client"


import { RootState } from '@/redux-store/redux_store'
import { wishlist__remove_ } from '@/utils/api_url'
import axios, { AxiosError } from 'axios'
import React from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

interface IWRProps {
  id:String
}

const Wishlist_remove:React.FC<IWRProps> = ({id}) => {
  const token = useSelector((state: RootState) => state.user.token);

  const remover_wishlist = async ()=>{
    try {
      const { data } = await axios.post(
        wishlist__remove_,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Clear All Product successfully!");
      setTimeout(()=>{
        window.location.reload();  
      },2000)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error Product remove ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to Product remove. Please try again.");
      }
    }

  }

  return (
    <button onClick={remover_wishlist} className="text-gray-700 bg-white py-1.5 px-4 rounded capitalize font-medium text-[11px] border-2 border-gray-600 text-sm hover:shadow-sm hover:rounded-md duration-200">
    Remove all 
  </button>
  )
}

export default Wishlist_remove

// {page_data?.wishlist_id}