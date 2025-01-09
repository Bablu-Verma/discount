"use client";

import { ICampaign } from "@/model/CampaignModel";
import { RootState } from "@/redux-store/redux_store";
import { product_details_ } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Prduct_details = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [product, setProduct] = useState<ICampaign | null>();
  const pathname = usePathname();
  const router = useRouter();

  const urlslug = pathname.split("/").pop() || "";

  const GetData = async (slug: string) => {
    try {
      let { data } = await axios.post(
        product_details_,
        {
          slug: slug,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setProduct(data.data);
      console.log(data);
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    GetData(urlslug);
  }, [urlslug]);

  return (
    <div>
      {product && (
        <div className=" mt-10 px-2">
          <span className="text-sm text-secondary font-semibold">Title</span>
          <h1 className="text-base text-gray-400">{product.title}</h1>
          <hr className="my-3" />
          <span className="text-sm text-secondary font-semibold">
            Campaign url
          </span>
          <br />
          <Link
            href={`/campaign/${product.slug}`}
            className="text-base text-gray-400"
          >
            http://localhost:3000/campaign/{product.slug}
          </Link>
          <hr className="my-3" />
          <span className="text-sm text-secondary font-semibold">
            Description
          </span>
          <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
          <hr className="my-3" />
          <span className="text-sm text-secondary font-semibold">
            Campaign Id
          </span>
          <p className="text-base text-gray-400">#{product.campaign_id}</p>
          <hr className="my-3" />
          <span className="text-sm text-secondary font-semibold">
            Campaign Id
          </span>
          {/* <p className="text-base text-gray-400">#</p> */}

          <hr className="my-3" />
          <div className="mt-20">
            <Link
              className=" py-2 px-8 bg-yellow-600 text-sm text-white rounded-md"
              href={`/admin/dashboard/product/edit/${product.slug}`}
              
            >
              Edit <i className="fa-solid fa-pen-to-square text-base"></i>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prduct_details;
