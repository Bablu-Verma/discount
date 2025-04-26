"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { formatDate } from "@/helpers/client/client_function";
import { RootState } from "@/redux-store/redux_store";
import { order_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";


export default function OrderListPage() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [sheet, setSheet] = useState({ show: false, details: {} as any });
  const token = useSelector((state: RootState) => state.user.token);
  // const user_data = useSelector((state: RootState) => state.user.user);
  const [showOrderHistory, setShowOrderHistory] = useState(true);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState('')




  const get_order = async () => {
    try {
      const { data } = await axios.post(
        order_list_api,
        { page: page, activetab: activeTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.data)
      setOrderList(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    get_order();
  }, []);

  const tab = [
    {
      id: 1,
      name: 'Pending',
      click: 'Pending'
    },
    {
      id: 2,
      name: 'Confirmed',
      click: 'Confirmed'
    },
    {
      id: 3,
      name: 'Failed',
      click: 'Failed'
    }
  ]

  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-6xl mx-auto px-4 mt-7 md:mt-10 mb-10">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>

          <div className=" flex justify-start items-center gap-4 mb-6">
            <span className="text-sm text-secondary">Payment Status:</span>    {
              tab.map((item, i) => {
                return (
                  <button className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary ${activeTab === item.click ? "text-white bg-primary" : "text-primary bg-white"
                    }`} key={i} onClick={() => {
                      setActiveTab(item.click)
                    }}>{item.name}</button>
                )
              })
            }
          </div>

          {orderList.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">S.No.</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Store</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Cashback</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">{item.transaction_id}</td>
                      <td className="px-4 py-3">{item.store_id?.name || "-"}</td>
                      <td className="px-4 py-3">{item.order_status}</td>
                      <td className="px-4 py-3">{item.cashback ?? 0}</td>
                      <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          className="text-primary text-nowrap hover:underline text-sm"
                          onClick={() => setSheet({ show: true, details: item })}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center py-10">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary"
          >
            More Order
          </button>
        </div>
        <BottomToTop />
      </main>
      <Footer />

      {/* Sheet Modal */}
      {sheet.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative p-6 animate-slideUp">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              onClick={() => setSheet({ show: false, details: {} })}
            >
              <IoClose className="text-2xl text-gray-600 hover:text-black" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Order Details</h2>

            {/* Divider */}
            <div className="border-b mb-6"></div>

            {/* Details */}
            <div className="space-y-5">
              <DetailRow label="Store" value={sheet.details.store_id?.name || "-"} />
              <DetailRow label="Order Date" value={formatDate(sheet.details.createdAt)} />
              <DetailRow label="Transaction ID" value={sheet.details.transaction_id} />
              <DetailRow
                label="Order Value"
                value={sheet.details.order_value ? `₹ ${sheet.details.order_value}` : "-"}
              />
              <DetailRow label="Cashback Rate" value={`${sheet.details.cashback_rate}%`} />
              <DetailRow label="Cashback Type" value={sheet.details.cashback_type} />
              <DetailRow
                label="Cashback Amount"
                value={sheet.details.cashback ? `₹ ${sheet.details.cashback}` : "-"}
              />
              <DetailRow label="Order Status" value={sheet.details.order_status} />
              <DetailRow label="Payment Status" value={sheet.details.payment_status ?? "-"} />

              {sheet.details.order_history && sheet.details.order_history.length > 0 && (
                <div className="mt-10">
                  <div
                    className="flex justify-between items-center cursor-pointer bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200"
                    onClick={() => setShowOrderHistory(!showOrderHistory)}
                  >
                    <h3 className="text-base text-secondary font-medium">Order History</h3>
                    <span className="text-gray-500">{showOrderHistory ? "▲" : "▼"}</span>
                  </div>

                  {showOrderHistory && (
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-3 border-b">Details</th>
                            <th className="text-left p-3 border-b">Date</th>
                            <th className="text-left p-3 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sheet.details.order_history.map((history, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-3 border-b">{history.details || "-"}</td>
                              <td className="p-3 border-b">{formatDate(history.date)}</td>
                              <td className="p-3 border-b">{history.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {sheet.details.payment_history && sheet.details.payment_history.length > 0 && (
                <div className="mt-10">
                  <div
                    className="flex justify-between items-center cursor-pointer bg-green-100 px-3 py-2 rounded-lg hover:bg-green-200"
                    onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                  >
                    <h3 className="text-secondary text-base font-medium">Payment History</h3>
                    <span className="text-gray-600">{showPaymentHistory ? "▲" : "▼"}</span>
                  </div>

                  {showPaymentHistory && (
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full text-sm border">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="text-left p-3 border-b">Details</th>
                            <th className="text-left p-3 border-b">Date</th>
                            <th className="text-left p-3 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sheet.details.payment_history.map((payment, idx) => (
                            <tr key={idx} className="hover:bg-green-50">
                              <td className="p-3 border-b">{payment.details || "-"}</td>
                              <td className="p-3 border-b">{formatDate(payment.date)}</td>
                              <td className="p-3 border-b">{payment.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b pb-3">
    <span className="text-gray-500 font-medium capitalize">{label}</span>
    <span className="text-gray-800 font-normal capitalize">{value}</span>
  </div>
);
