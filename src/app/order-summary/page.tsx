"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import useFileStore from "@/store/filesStore";
import { Config } from "@/interfaces";
import { useSession } from "next-auth/react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FlipWords } from "@/components/ui/Flip-Words";
import { SubscribePush } from "@/components/SubscribePush";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function OrderSummary() {
  const router = useRouter();
  const store = useFileStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const filesWithConfigs = store.filesWithConfigs;
  const totalPrice = filesWithConfigs.reduce(
    (sum, item) => sum + item.config.totalPrice,
    0,
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      if (!session) {
        Swal.fire("Error", "You need to be logged in to proceed.", "error");
        return;
      }

      const data = await axios.post("/api/razorpay/create_order", {
        totalPrice,
      });
      const { orderId, amount, currency } = data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount,
        currency,
        name: "PrintEase",
        order_id: orderId,
        handler: async (response: any) => {
          const formData = new FormData();
          formData.append("user_id", session?.user?.id || "");
          filesWithConfigs.forEach((f, i) => {
            formData.append(`file_${i}`, f.file);
            formData.append(`config_${i}`, JSON.stringify(f.config));
          });

          setLoading(true);
          await axios.post("/api/razorpay/verify_payment", response);
          await axios.post("/api/file_upload", formData, {
            withCredentials: true,
          });

          Swal.fire("Success", "Payment successful!", "success").then(() => {
            setLoading(false);
            router.push(`/my-prints`);
          });
        },
        theme: { color: "#22d3ee" }, // Cyan theme for Razorpay
      };

      new window.Razorpay(options).open();
    } catch (error) {
      Swal.fire("Error", "Payment Failed", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <SubscribePush />
      <div className="min-h-screen bg-brand-matte py-24 px-4 antialiased transform-gpu">
        {loading && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center flex-col bg-brand-matte/95 backdrop-blur-md">
            <PacmanLoader color="#22d3ee" size={40} />
            <FlipWords
              words={["Securing Prints", "Uploading Docs", "Finalizing..."]}
              className="text-brand-cyan font-black mt-10 uppercase tracking-[0.4em] text-xs text-center"
            />
          </div>
        )}

        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-1.5 rounded-full mb-6 border border-white/5">
              <div className="w-1.5 h-1.5 bg-brand-purple rounded-full shadow-glow-purple" />
              <span className="text-gray-500 font-black text-[9px] uppercase tracking-[0.3em]">
                Step 3: Checkout
              </span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">
              Order{" "}
              <span className="text-brand-cyan drop-shadow-glow-cyan">
                Summary
              </span>
            </h1>
          </div>

          {/* Receipt Container */}
          <div className="bg-brand-matte shadow-neu-out rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-black/20">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] text-center">
                Digital Invoice Details
              </p>
            </div>

            <div className="divide-y border-b border-white/5 divide-white/5">
              {filesWithConfigs.map((item, index) => (
                <FileSummary key={index} fileWithConfig={item} />
              ))}
            </div>

            {/* Total Section */}
            <div className="p-10">
              <div className="flex justify-between items-center mb-10 p-6 bg-brand-matte shadow-neu-in rounded-3xl border border-white/5">
                <span className="text-lg font-black uppercase italic text-gray-400">
                  Total Due
                </span>
                <div className="text-4xl font-black text-brand-cyan flex items-center drop-shadow-glow-cyan italic">
                  <CurrencyRupeeIcon fontSize="large" className="scale-110" />
                  {totalPrice}
                </div>
              </div>

              <div className="space-y-6">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-brand-matte text-brand-cyan border border-brand-cyan/20 p-6 rounded-2xl font-black uppercase text-sm tracking-[0.3em] shadow-neu-out active:shadow-neu-in active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  Confirm & Pay <ArrowForwardIcon />
                </button>

                <button
                  onClick={() => router.push("/new-order")}
                  className="w-full bg-brand-matte text-gray-500 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-neu-sm active:shadow-neu-in active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/5"
                >
                  <ArrowBackIcon fontSize="small" /> Back to Stack
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FileSummary({
  fileWithConfig,
}: {
  fileWithConfig: { file: File; config: Config };
}) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="group transition-all">
      <div
        onClick={() => setShowConfig(!showConfig)}
        className="p-8 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h3
              className={`font-black uppercase italic tracking-tight truncate transition-colors ${showConfig ? "text-brand-purple" : "text-gray-200"}`}
            >
              {fileWithConfig.file.name}
            </h3>
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
              {fileWithConfig.config.color === "b&w" ? "B & W" : "Color"} Mode •{" "}
              {fileWithConfig.config.copies} Copies
            </p>
          </div>
          <div className="font-black text-brand-purple drop-shadow-glow-purple text-xl italic">
            ₹{fileWithConfig.config.totalPrice}
          </div>
        </div>

        {showConfig && (
          <div className="mt-6 p-5 bg-brand-matte shadow-neu-in rounded-2xl border border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="text-gray-600">Pages:</span>
              <span className="text-gray-300">
                {fileWithConfig.config.pagesToPrint}
              </span>
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="text-gray-600">Orientation:</span>
              <span className="text-gray-300">
                {fileWithConfig.config.orientation}
              </span>
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="text-gray-600">Sided:</span>
              <span className="text-gray-300">
                {fileWithConfig.config.sided || "Single"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
