"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "How long does processing take?",
    answer:
      "Most print jobs are processed within 30 minutes. You'll receive a notification as soon as your document is ready.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support PDF, DOCX, PPT, TXT, and image files (JPG, PNG). All the essentials for college work.",
  },
  {
    question: "Do I need to pay extra?",
    answer:
      "Not a penny! Our service fee is built into the standard printing rates.",
  },
  {
    question: "Can I upload when the shop is closed?",
    answer:
      "Absolutely. Upload at 3 AM if you want, and just grab your prints the next morning.",
  },
];

const FaqSection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-brand-matte transform-gpu antialiased">
      <div className="container mx-auto px-6">
        {/* Header with Recessed Indicator */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 bg-brand-matte shadow-neu-in px-4 py-2 rounded-full mb-6 border border-white/5">
            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-glow-cyan" />
            <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
              Support Center
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
            Wait, I have{" "}
            <span className="text-brand-cyan drop-shadow-glow-cyan">
              Questions
            </span>
          </h2>
        </div>

        <div className="flex flex-col items-center max-w-3xl mx-auto space-y-6">
          {faqData.map((item, index) => (
            <Accordion
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Accordion: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <div
        className={`relative bg-brand-matte rounded-[1.5rem] transition-all duration-500 overflow-hidden border border-white/5
          ${isOpen ? "shadow-neu-in" : "shadow-neu-out hover:scale-[1.01]"}`}
      >
        <button
          className="w-full flex justify-between items-center p-6 text-left focus:outline-none group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3
            className={`text-lg font-black uppercase tracking-tight italic transition-colors duration-300
            ${isOpen ? "text-brand-cyan" : "text-gray-300 group-hover:text-white"}`}
          >
            {question}
          </h3>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-neu-sm
              ${isOpen ? "shadow-neu-in-sm rotate-45 text-brand-purple" : "text-brand-cyan rotate-0"}`}
          >
            <Plus
              className={`w-6 h-6 stroke-[3px] transition-all ${isOpen ? "drop-shadow-glow-purple" : "drop-shadow-glow-cyan"}`}
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="px-6 pb-8 pt-2">
                <div className="h-[1px] w-full bg-white/5 mb-4" />
                <p className="text-sm md:text-base font-medium text-gray-500 leading-relaxed">
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FaqSection;
