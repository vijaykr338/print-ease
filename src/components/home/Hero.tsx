"use client";
import {
  ArrowRightIcon,
  UploadIcon,
  CreditCardIcon,
  Printer,
} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-brand-matte min-h-[90vh] flex items-center pt-20 overflow-hidden transform-gpu">
      {/* Decorative Glows (Static Opacity for performance) */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-brand-cyan/5 rounded-full" />
      <div className="absolute bottom-20 right-[5%] w-80 h-80 bg-brand-purple/5 rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between w-full">
        {/* Left Side: Copy */}
        <div className="max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-1.5 rounded-full mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
              Campus Cloud Print
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.9]">
            Print Fast.
            <br />
            <span className="text-brand-cyan drop-shadow-glow-cyan">
              No Wait.
            </span>
          </h1>

          <p className="mt-8 text-base md:text-lg text-gray-500 font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
            Ditch the line at the stationary shop. Upload your assignment, pay
            instantly, and grab your prints with an OTP.
          </p>

          <div className="mt-12">
            <Link href="/Start">
              <button className="group w-full md:w-auto inline-flex items-center justify-center px-10 py-5 bg-brand-matte text-brand-cyan font-black uppercase tracking-widest text-sm rounded-2xl shadow-neu-out md:hover:shadow-neu-in md:hover:scale-[0.99] active:shadow-neu-in active:scale-95 transition-all transform-gpu">
                <UploadIcon className="h-5 w-5 mr-3" />
                Start Uploading
                <ArrowRightIcon className="h-5 w-5 ml-3" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Tactile Workflow (Simplified for Mobile CPU) */}
        <div className="hidden lg:flex flex-1 justify-center relative transform-gpu">
          <div className="relative w-80 h-[28rem] bg-brand-matte shadow-neu-in rounded-[3rem] border border-white/5 flex items-center justify-center group overflow-hidden">
            {/* The Floating Card */}
            <div className="w-64 h-[22rem] bg-brand-matte shadow-neu-out rounded-[2.5rem] flex flex-col items-center justify-center p-8 transition-transform duration-700 ease-out md:group-hover:scale-[1.02] will-change-transform">
              {/* Central Printer Icon - Recessed */}
              <div className="w-24 h-24 bg-brand-matte shadow-neu-in rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-brand-cyan shadow-glow-cyan">
                  <Printer size={32} strokeWidth={2.5} />
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-white font-black uppercase text-xs tracking-tighter italic">
                  Main Library Hub
                </p>
                <div className="h-1 w-12 bg-brand-cyan rounded-full mx-auto shadow-glow-cyan" />

                <div className="flex gap-2 justify-center mt-6">
                  <div className="w-10 h-10 rounded-xl shadow-neu-sm flex items-center justify-center text-gray-500">
                    <CreditCardIcon size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-xl shadow-neu-sm flex items-center justify-center text-gray-500">
                    <UploadIcon size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
