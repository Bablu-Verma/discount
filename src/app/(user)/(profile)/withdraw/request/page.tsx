"use client";

import { RootState } from "@/redux-store/redux_store";
import { withdraw_request_data_api, withdraw_request_api,withdraw_resend_otp_api, withdraw_verify_api } from "@/utils/api_url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface IBank {
  upi_link_bank_name: string;
  upi_id: string;
}

const WithdrawRequest: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [bankList, setBankList] = useState<IBank[]>([]);
  const [withdrawableAmount, setWithdrawableAmount] = useState(0);
  const [documentId, setDocumentId] = useState('');
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawVerified, setWithdrawVerified] = useState(false);

  const token = useSelector((state: RootState) => state.user.token);

  const fetchWithdrawRequestData = async () => {
    try {
      const { data } = await axios.post(withdraw_request_data_api, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    console.log(data.data)
      setBankList(data.data.upiDetails);
      setWithdrawableAmount(data.amountDetails);
    } catch (error) {
      toast.error("Failed to fetch withdraw data");
    }
  };

  useEffect(() => {
    fetchWithdrawRequestData();
  }, []);


  console.log('bankList',bankList)

  const sendOtp = async () => {
    if (!selectedBankId) {
      toast.error("Please select a bank");
      return;
    }
    if (Number(amount) < 100) {
      toast.error("Minimum withdraw amount is ₹100");
      return;
    }
    if (Number(amount) > withdrawableAmount) {
      toast.error(`You can withdraw up to ₹${withdrawableAmount}`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        withdraw_request_api,
        {
          bank_id: selectedBankId,
          amount: Number(amount),
        },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      toast.success("OTP sent successfully!");
      setDocumentId(data.id);
      setOtpSent(true);
      setOtpTimer(120);
      setIsVerifying(true);
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Enter a valid 4-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        withdraw_verify_api,
        {
          document_id: documentId,
          otp: otp,
        },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      toast.success("Withdraw request submitted successfully!");
      setWithdrawVerified(true);
      setIsVerifying(false);
    } catch (error) {
      toast.error("Invalid OTP, try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, otpTimer]);

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-primary">Withdraw </h3>
      
      <div className=" rounded my-7 flex justify-between items-center">
        <p className="text-sm text-gray-700">Available Withdrawable Amount:</p>
        <p className="text-xl font-bold text-green-600">₹{withdrawableAmount ? withdrawableAmount :0}</p>
      </div>

      <div>
        <select
          value={selectedBankId}
          onChange={(e) => setSelectedBankId(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">Select Bank</option>
          {bankList && bankList.length > 0 &&  bankList.map((bank, i) => (
            <option key={i} value={bank.upi_id}>
              {bank.upi_id} ({bank.upi_link_bank_name})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter Amount "
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-1"
        />
        <span className="text-[12px] text-gray-600 inline-flex mb-5">Widthdraw Min ₹100</span>
        <button
          type="button"
          onClick={sendOtp}
          disabled={loading || otpSent || withdrawVerified}
          className="w-full p-2 bg-primary text-white rounded mb-3"
        >
          {loading ? "Sending OTP..." : "Request Withdraw"}
        </button>

        {isVerifying && (
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-2"
            />
            {
              otpTimer === 0 ? (
                <p className="text-sm text-primary cursor-pointer" onClick={sendOtp}>Resend OTP</p>
              ) : (
                <p className="text-sm text-gray-500">Time left: {otpTimer}s</p>
              )
            }
            <button
              type="button"
              onClick={verifyOtp}
              className="w-full p-2 bg-primary text-white rounded mt-2"
            >
              {loading ? "Verifying..." : "Submit OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawRequest;
