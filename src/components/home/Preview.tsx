"use client";
import Image from "next/image";

export default function Preview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-10">
      {/* Outer Decorative Frame (The "Pop-out" effect) */}
      <div className="relative group">
        {/* The "Back Shadow" Box */}
        <div className="absolute inset-0 bg-brand-purple translate-x-4 translate-y-4 rounded-3xl border-4 border-brand-black pointer-events-none" />

        {/* The Main Container */}
        <div className="relative bg-white border-4 border-brand-black rounded-3xl overflow-hidden">
          {/* Top Bar - Makes it look like a cool OS window */}
          <div className="bg-brand-black py-3 px-6 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-yellow border border-white" />
              <div className="w-3 h-3 rounded-full bg-brand-mint border border-white" />
              <div className="w-3 h-3 rounded-full bg-brand-purple border border-white" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Print_Preview_Final_v2.png
            </span>
          </div>

          {/* The Image Wrapper */}
          <div className="relative w-full h-[400px] md:h-[500px]">
            <Image
              src="/kampus.jpg"
              alt="Dashboard Preview"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-crosshair"
            />

            {/* Overlay Gradient/Tint for that "Edgy" look */}
            <div className="absolute inset-0 bg-brand-purple/10 pointer-events-none mix-blend-multiply" />

            {/* Corner Badge/Sticker */}
            <div className="absolute bottom-6 right-6 bg-brand-yellow border-4 border-brand-black p-3 -rotate-12 shadow-[4px_4px_0px_0px_rgba(26,26,27,1)] group-hover:rotate-0 transition-transform">
              <p className="text-brand-black font-black text-xs uppercase italic">
                University <br /> Ready ⚡️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Caption below the preview */}
      <p className="mt-10 text-center font-bold text-brand-black/60 italic text-sm">
        *Actual interface may look significantly cooler than your syllabus.
      </p>
    </div>
  );
}
