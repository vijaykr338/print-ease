"use client";

import { useEffect, useState, Suspense } from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useSession } from "next-auth/react";
import axios from "axios";
import { format } from "date-fns";
import PacmanLoader from "react-spinners/PacmanLoader";

interface OrderDetails {
  date: Date;
  status: string;
  cost: number;
  otp: string;
  orderId: string;
}

export default function OrderHistory() {
  const { data: session } = useSession();
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/printdoc?user_id=${session.user?.id}`,
        );

        const transformedOrders: OrderDetails[] = data.map((order: any) => ({
          date: new Date(order.createdAt),
          status: order.status,
          cost: order.cost,
          otp: order.otp || "N/A",
          orderId: order._id || "NO-ID",
        }));

        setOrderDetails(transformedOrders);
      } catch (e: any) {
        console.error("Error fetching orders:", e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-matte">
        <div className="bg-brand-matte shadow-neu-out p-12 rounded-[3rem] border border-white/5 text-center">
          <h1 className="text-white text-3xl font-black uppercase italic tracking-tighter mb-4">
            Auth Required
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
            Login to view your print archive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-matte py-24 px-6 transform-gpu antialiased">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-1.5 rounded-full mb-4 border border-white/5">
              <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-glow-cyan animate-pulse" />
              <span className="text-gray-500 font-black text-[9px] uppercase tracking-[0.3em]">
                Activity Log
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
              My{" "}
              <span className="text-brand-cyan drop-shadow-glow-cyan">
                Orders
              </span>
            </h1>
          </div>
          <div className="bg-brand-matte shadow-neu-in px-6 py-3 rounded-2xl border border-white/5">
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
              Archive Count:{" "}
              <span className="text-brand-cyan">{orderDetails.length}</span>
            </p>
          </div>
        </div>

        <Suspense fallback={<PacmanLoader color="#22d3ee" />}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <PacmanLoader color="#22d3ee" size={40} />
              <p className="mt-10 font-black uppercase text-gray-600 tracking-widest text-xs">
                Synchronizing History...
              </p>
            </div>
          ) : orderDetails.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {orderDetails.map((details, index) => (
                <OrderCard key={index} details={details} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-brand-matte shadow-neu-in rounded-[3rem] border border-dashed border-white/10">
              <p className="text-gray-600 font-black uppercase text-lg italic tracking-widest">
                No prints found in archive.
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

function OrderCard({ details }: { details: OrderDetails }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-brand-cyan shadow-glow-cyan";
      case "Pending":
        return "text-brand-yellow shadow-glow-yellow";
      case "Ready to Pickup":
        return "text-brand-purple shadow-glow-purple";
      default:
        return "text-white";
    }
  };

  return (
    <div className="group bg-brand-matte shadow-neu-out p-8 rounded-[2.5rem] border border-white/5 transition-all duration-300 transform-gpu md:hover:scale-[1.02] active:shadow-neu-in">
      {/* Card Header: ID & Status */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="block text-[9px] font-black uppercase text-gray-600 tracking-[0.2em] mb-1">
            Serial Hash
          </span>
          <h2 className="font-black text-xl text-white uppercase italic tracking-tighter">
            #{details.orderId.slice(-6)}
          </h2>
        </div>
        <div
          className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(details.status)}`}
        >
          {details.status}
        </div>
      </div>

      {/* Cost Module: Recessed */}
      <div className="bg-brand-matte shadow-neu-in p-5 rounded-2xl border border-white/5 mb-6 flex justify-between items-center">
        <span className="font-black uppercase text-[9px] tracking-widest text-gray-600">
          Billing
        </span>
        <div className="flex items-center font-black text-white text-xl italic">
          <CurrencyRupeeIcon fontSize="small" className="text-brand-cyan" />
          {details.cost}
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">
            Logged At
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
            {format(details.date, "MMM dd • hh:mm a")}
          </span>
        </div>

        {/* OTP Module: The "Glow" slot */}
        <div className="flex justify-between items-center bg-brand-matte shadow-neu-in-sm p-4 rounded-xl border border-white/5">
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
            OTP Token
          </span>
          <span className="text-xl font-black tracking-[0.2em] text-brand-cyan drop-shadow-glow-cyan italic">
            {details.otp}
          </span>
        </div>
      </div>
    </div>
  );
}
