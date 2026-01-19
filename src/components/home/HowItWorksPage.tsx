"use client";

import Preview from "./Preview";
import Steps from "./Steps";
import HowItWorksHeader from "./HowItWorksHeader";

export default function HowItWorksPage() {
  return (
    <div className="bg-brand-matte py-24 antialiased transform-gpu">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header Section: Now uses a subtle glow instead of tape */}
        <div className="mb-20 text-center">
          <HowItWorksHeader />
        </div>

        {/* Steps Container: Tactile Console Look */}
        <div className="flex flex-col items-center">
          {/* Main Card: Recessed "Tray" logic */}
          <div className="w-full bg-brand-matte shadow-neu-in rounded-[3rem] p-8 md:p-16 border border-white/5 relative overflow-hidden">
            {/* Soft Ambient Glow in the corner */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-purple/5 rounded-full pointer-events-none" />

            {/* Steps Component Wrapper */}
            <div className="relative z-10">
              <Steps />
            </div>
          </div>

          {/* Preview Component Wrapper */}
        </div>
      </div>
    </div>
  );
}
