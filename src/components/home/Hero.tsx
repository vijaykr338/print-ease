// components/HeroSection.jsx
"use client"
import { ArrowRightIcon, UploadIcon, CreditCardIcon, BellIcon } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="pt-8 md:pt-0 relative overflow-hidden bg-gradient-to-b from-[#121620] via-[#1A1E2E] to-black min-h-[90vh] flex items-center">
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between w-full">
        {/* Left: Text & CTA */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Print Ease.<br className="hidden md:block" />
            <span className="text-[#4B6BFB] mt-2"> Collect Without Queuing.</span>
          </h1>
          <p className="mt-5 text-lg text-gray-300">
            Cuz no one likes standing in rush outside the shop<br/> To get the damn college assignments printed
          </p>
          <div className="mt-8 flex gap-4">
            <button className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#4B6BFB] to-[#9747FF] text-white font-semibold shadow-lg hover:scale-105 transition-transform">
              <UploadIcon className="h-5 w-5 mr-2" />
              Start Printing
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>          
          </div>
          {/* Features */}
          <div className="mt-10 flex gap-8 flex-col">
            <div className="flex items-center gap-2">
              <UploadIcon className="h-6 w-6 text-[#4B6BFB]" />
              <span className="text-gray-300">Secure Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-6 w-6 text-[#9747FF]" />
              <span className="text-gray-300">Online Payment</span>
            </div>
          </div>
        </div>

        {/* Right: Visual Workflow Illustration */}
        <div className="mt-16 md:mt-0 md:ml-12 flex-1 flex justify-center">
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Workflow steps */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <UploadIcon className="h-10 w-10 text-[#4B6BFB] mb-2 animate-float" />
              <span className="text-sm text-gray-400">Upload</span>
            </div>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
              <CreditCardIcon className="h-10 w-10 text-[#9747FF] mb-2 animate-float delay-200" />
              <span className="text-sm text-gray-400">Pay</span>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <BellIcon className="h-10 w-10 text-[#4B6BFB] mb-2 animate-float delay-500" />
              <span className="text-sm text-gray-400">Collect</span>
            </div>
            {/* Centered printer illustration */}
            <div className="relative z-10 flex flex-col items-center">
                
                <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                  <rect x="10" y="14" width="28" height="20" rx="3" fill="#23272F"/>
                  <rect x="16" y="6" width="16" height="10" rx="2" fill="#4B6BFB"/>
                  <rect x="16" y="34" width="16" height="8" rx="2" fill="#9747FF"/>
                  <rect x="20" y="20" width="8" height="8" rx="1.5" fill="#fff" opacity="0.25"/>
                </svg>
              
              <span className="mt-2 text-gray-400 text-xs">DTU PrintEase</span>
            </div>
          </div>
        </div>
      </div>
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-500 { animation-delay: 0.5s; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.32; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
