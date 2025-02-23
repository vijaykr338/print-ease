"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";
import { BackgroundGradient } from "../../components/ui/BackgroundGradient";
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

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

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
    0
  );

  useEffect(() => {
    const loadScript = async () => {
      if (
        !document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
      }
    };
    loadScript();
  }, []);

  const handlePayment = async () => {
    try {
      if (!session) {
        Swal.fire("Error", "You need to be logged in to proceed.", "error");
        return;
      }

      if (typeof window.Razorpay !== "function") {
        Swal.fire("Error", "Payment gateway not available", "error");
        return;
      }

      const data = await axios.post("/api/razorpay/create_order", {
        totalPrice: totalPrice,
      });

      if (data.status === 500) {
        throw Error("Internal server error");
      }

      const { orderId, amount, currency } = data.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amount,
        currency: currency,
        name: "PrintEase",
        order_id: orderId,
        description: "Order Payment",
        handler: async (response: any) => {
          const formData = new FormData();
          formData.append("paymentId", response.razorpay_payment_id);
          formData.append("user_id", session?.user?.id || "");

          filesWithConfigs.forEach((fileWithConfig, index) => {
            formData.append(`file_${index}`, fileWithConfig.file);
            formData.append(
              `config_${index}`,
              JSON.stringify(fileWithConfig.config)
            );
          });

          setLoading(true);
          await axios.post("/api/razorpay/verify_payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await axios.post("/api/file_upload", formData);
          Swal.fire("Success", "Payment successful", "success").then(() => {
            setLoading(false);
            router.push(`/my-prints`);
          });
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment Error:", error);
      Swal.fire("Error", "Failed to process payment", "error");
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/new-order");
  };

  return (
    <div className="mt-[100px] max-w-2xl mx-auto p-6 rounded-lg bg-gray-900 dark:bg-gray-800 text-white relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center flex-col bg-black bg-opacity-80">
          <PacmanLoader
            color="white"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <FlipWords
            words={["Uploading Files", "Fetching Data", "Proceeding to Print"]}
            className="text-gray-700 font-extralight mt-6"
          />
        </div>
      )}
      {!loading && (
        <>
          <h1 className="text-2xl font-semibold mb-8">Order Summary</h1>
          <div className="space-y-4">
            {filesWithConfigs.map((item, index) => (
              <FileSummary key={index} fileWithConfig={item} />
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              <span className="text-gray-500">Total Price:</span>{" "}
              <CurrencyRupeeIcon /> {totalPrice}
            </h2>
            <button
              onClick={handlePayment}
              disabled={loading} // Disable button while loading
              className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Proceed to Payment <ArrowForwardIcon />
              </span>
            </button>

            <button
              onClick={handleGoBack}
              className="w-full mt-4 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <ArrowBackIcon /> Go Back to Print
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FileSummary({
  fileWithConfig,
}: {
  fileWithConfig: { file: File; config: Config };
}) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div onClick={() => setShowConfig(!showConfig)}>
      <BackgroundGradient
        className="w-full p-4 bg-black dark:bg-gray-700 rounded-xl cursor-pointer"
        containerClassName="w-full p-2 space-y-1 rounded-lg"
        borderOnly
      >
        <h2 className="font-semibold mb-2">
          <span className="text-gray-500">File:</span>{" "}
          {fileWithConfig.file.name}
        </h2>
        <h2 className="font-semibold mb-2">
          <span className="text-gray-500">Total Price: </span>{" "}
          <CurrencyRupeeIcon />
          {fileWithConfig.config.totalPrice}
        </h2>
        {showConfig && (
          <div className="mt-4 space-y-2">
            <h2 className="font-semibold">
              <span className="text-gray-500">Color Mode:</span>{" "}
              {fileWithConfig.config.color === "b&w"
                ? "Black & White"
                : "Color"}
            </h2>
            <h2 className="font-semibold">
              <span className="text-gray-500">Pages to Print:</span>{" "}
              {fileWithConfig.config.pagesToPrint}
            </h2>
            <h2 className="font-semibold">
              <span className="text-gray-500">Orientation:</span>{" "}
              {fileWithConfig.config.orientation}
            </h2>
            <h2 className="font-semibold">
              <span className="text-gray-500">Copies:</span>{" "}
              {fileWithConfig.config.copies}
            </h2>
          </div>
        )}
      </BackgroundGradient>
    </div>
  );
}
