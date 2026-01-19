"use client";

export default function HowItWorksHeader() {
  return (
    <div className="text-center mb-16 relative antialiased">
      {/* Small accent indicator: Sunken Neumorphic Style */}
      <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-2 rounded-full mb-6 border border-white/5">
        <div className="w-1.5 h-1.5 bg-brand-purple rounded-full shadow-glow-purple" />
        <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
          3 Stage Process
        </span>
      </div>

      {/* Main Title: Bold with Cyan Glow */}
      <h2 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter italic leading-none">
        How It{" "}
        <span className="relative inline-block text-brand-cyan drop-shadow-glow-cyan">
          Works
          {/* Subtle Glow Underline - Clean and straight */}
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-brand-cyan rounded-full shadow-glow-cyan opacity-50" />
        </span>
      </h2>

      <div className="max-w-2xl mx-auto px-4">
        <p className="text-gray-400 font-medium text-lg md:text-xl leading-relaxed">
          Our streamlined process makes printing effortless.
          <span className="block mt-4 text-sm md:text-base font-bold tracking-wide uppercase">
            Follow these steps to
            <span className="text-brand-cyan mx-2 inline-block drop-shadow-glow-cyan border-b border-brand-cyan/30">
              skip the queue
            </span>
            and save your sanity.
          </span>
        </p>
      </div>

      {/* Background decoration: Subtle Radial Circle replacing the "X" */}
      <div className="absolute -top-10 right-1/4 opacity-20 pointer-events-none hidden md:block">
        <div className="w-40 h-40 rounded-full border border-brand-cyan/20 shadow-neu-in-sm" />
      </div>
    </div>
  );
}
