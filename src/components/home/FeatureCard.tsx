"use client";

import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  points: string[];
  accentColor?: string; // We'll use this for the glow color now
}

export default function FeatureCard({
  icon,
  title,
  description,
  points,
  accentColor = "text-brand-cyan",
}: FeatureCardProps) {
  return (
    <div className="group relative h-full transform-gpu antialiased">
      {/* Main Content Card: Tactile Elevation */}
      <div className="h-full bg-brand-matte shadow-neu-out rounded-[2rem] p-8 border border-white/5 transition-all duration-300 md:group-hover:scale-[1.02]">
        {/* Icon Box: Recessed "Dock" Style */}
        <div
          className={`w-16 h-16 bg-brand-matte shadow-neu-in rounded-2xl flex items-center justify-center mb-8 border border-white/5 transition-all duration-300`}
        >
          <div
            className={`${accentColor} transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]`}
          >
            {icon}
          </div>
        </div>

        {/* Text Content */}
        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter italic">
          {title}
        </h3>

        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
          {description}
        </p>

        {/* Feature Points: Tactile List */}
        <ul className="space-y-4">
          {points.map((point, idx) => (
            <li
              key={idx}
              className="flex items-start text-[11px] font-bold text-gray-400 uppercase tracking-widest"
            >
              <div className="mt-0.5 mr-3">
                {/* Custom Neumorphic Checkbox: Sunken Indicator */}
                <div className="w-5 h-5 rounded-lg bg-brand-matte shadow-neu-in-sm flex items-center justify-center border border-white/5">
                  <svg
                    className={`w-3 h-3 ${accentColor} opacity-70 group-hover:opacity-100 transition-opacity`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={4}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <span className="leading-tight pt-0.5 group-hover:text-gray-200 transition-colors">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
