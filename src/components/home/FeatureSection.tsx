"use client";

import FeatureCard from "./FeatureCard";
import {
  CloudUpload,
  ShieldCheck,
  Key,
  ClipboardList,
  Clock,
  Settings,
} from "lucide-react";

const features = [
  {
    title: "Easy Upload",
    description:
      "Upload from anywhere using our intuitive interface. Support for .doc, .pdf, .ppt.",
    icon: <CloudUpload size={28} />,
    points: ["Multiple formats", "Simple UI"],
    accentColor: "text-brand-cyan",
  },
  {
    title: "Queue-free",
    description:
      "Submit remotely and pick up when ready. No more long lines at the photocopy shop.",
    icon: <Clock size={28} />,
    points: ["Save 15+ mins", "Pick up anytime"],
    accentColor: "text-brand-purple",
  },
  {
    title: "Secure OTP",
    description:
      "Receive a unique OTP for each print job to ensure your documents stay yours.",
    icon: <Key size={28} />,
    points: ["One-time use", "Encrypted storage"],
    accentColor: "text-brand-cyan",
  },
  {
    title: "Total Privacy",
    description:
      "We value your privacy. All data is encrypted and deleted after processing.",
    icon: <ShieldCheck size={28} />,
    points: ["No retention", "Safe infra"],
    accentColor: "text-brand-purple",
  },
  {
    title: "Custom Vibe",
    description:
      "Choose paper quality, color, and binding options before you hit print.",
    icon: <Settings size={28} />,
    points: ["Paper types", "B&W or Color"],
    accentColor: "text-brand-cyan",
  },
  {
    title: "Live Tracking",
    description:
      "View your history and track current jobs in real-time through your dashboard.",
    icon: <ClipboardList size={28} />,
    points: ["History archive", "Quick reprint"],
    accentColor: "text-brand-purple",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-brand-matte py-24 overflow-hidden antialiased transform-gpu">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-24 relative">
          {/* Subtle Ambient Glow replacing the dotted grid */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="w-64 h-64 bg-brand-cyan/5 blur-[100px] rounded-full" />
          </div>

          <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-2 rounded-full mb-6 border border-white/5">
            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-glow-cyan" />
            <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
              Premium Features
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter italic relative z-10">
            The{" "}
            <span className="text-brand-cyan drop-shadow-glow-cyan">Print</span>{" "}
            Perks
          </h2>

          <p className="text-gray-400 font-medium max-w-xl mx-auto text-base md:text-lg leading-relaxed relative z-10">
            Streamlining the grind so you can focus on the grade.
            <br className="hidden md:block" />
            Everything you need for a queue-free life.
          </p>
        </div>

        {/* Features Grid: High Performance Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
