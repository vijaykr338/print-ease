"use client";
import { motion } from "framer-motion";

const steps_list = [
  {
    title: "Upload file",
    description:
      "Select and upload the document you want to print through our dashboard.",
    glowColor: "group-hover:text-brand-cyan",
    glowShadow: "shadow-glow-cyan",
  },
  {
    title: "Choose vibes",
    description:
      "Set your preferences like page size, color, and number of copies.",
    glowColor: "group-hover:text-brand-purple",
    glowShadow: "shadow-glow-purple",
  },
  {
    title: "Secure the bag",
    description: "Pay securely through our integrated high-speed gateway.",
    glowColor: "group-hover:text-brand-cyan",
    glowShadow: "shadow-glow-cyan",
  },
  {
    title: "Instant Collect",
    description:
      "Visit the shop and collect your document. No waiting in line.",
    glowColor: "group-hover:text-brand-purple",
    glowShadow: "shadow-glow-purple",
  },
];

export default function Steps() {
  return (
    <div className="flex flex-col gap-10 w-full max-w-2xl px-4 py-8 antialiased">
      {steps_list.map((step, index) => (
        <motion.div
          key={index}
          className="group relative p-8 rounded-[2rem] bg-brand-matte shadow-neu-out transition-all duration-300 transform-gpu md:hover:scale-[1.02]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
        >
          {/* Step Number Badge - Recessed "Indicator" look */}
          <div className="absolute -top-5 left-8 w-12 h-12 bg-brand-matte shadow-neu-in rounded-2xl flex items-center justify-center border border-white/5">
            <span
              className={`text-xl font-black italic transition-colors duration-300 ${step.glowColor}`}
            >
              0{index + 1}
            </span>
          </div>

          <div className="mt-4">
            <h3
              className={`text-2xl font-black uppercase italic tracking-tighter mb-3 transition-colors duration-300 text-white group-hover:drop-shadow-sm`}
            >
              {step.title}
            </h3>
            <p className="font-medium text-gray-500 leading-relaxed text-sm md:text-base">
              {step.description}
            </p>
          </div>

          {/* Progress Connector Line (Visual only) */}
          {index !== steps_list.length - 1 && (
            <div className="absolute -bottom-10 left-14 w-0.5 h-10 bg-gradient-to-b from-white/10 to-transparent hidden md:block" />
          )}

          {/* Status Indicator - Small glowing "LED" */}
          <div className="absolute top-8 right-8">
            <div
              className={`w-2 h-2 rounded-full bg-gray-700 transition-all duration-500 group-hover:bg-opacity-100 group-hover:shadow-glow-cyan ${index % 2 === 0 ? "group-hover:bg-brand-cyan" : "group-hover:bg-brand-purple group-hover:shadow-glow-purple"}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
