"use client";

import React from "react";
import Link from "next/link";

const Footer = () => (
  <footer className="relative bg-brand-matte pt-20 pb-12 antialiased transform-gpu">
    {/* Subtle Top Divider - Inset Line */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

    <div className="container mx-auto px-6 max-w-6xl">
      {/* Main Footer Console */}
      <div className="bg-brand-matte shadow-neu-out rounded-[2.5rem] p-8 md:p-12 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative overflow-hidden">
        {/* Left Section: Brand & Status */}
        <div className="flex flex-col gap-6 relative z-10">
          <Link
            href="/"
            className="text-3xl font-black text-white tracking-tighter uppercase italic group transition-all"
          >
            Print
            <span className="text-brand-cyan drop-shadow-glow-cyan transition-all group-hover:text-brand-purple group-hover:shadow-glow-purple">
              Ease
            </span>
          </Link>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-glow-cyan animate-pulse" />
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                Service Active @ DTU
              </span>
            </div>

            {/* Recessed Date Badge */}
            <div className="inline-flex items-center bg-brand-matte shadow-neu-in px-3 py-1 rounded-full border border-white/5">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                Est. Aug 2025 • © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Navigation Modules */}
        <div className="flex flex-wrap gap-12 relative z-10">
          {/* Nav Group */}
          <div className="flex flex-col gap-3">
            <h4 className="font-black uppercase text-[10px] text-gray-600 mb-1 tracking-[0.3em]">
              System
            </h4>
            <Link
              href="/Start"
              className="text-gray-400 font-bold uppercase text-xs tracking-widest transition-all md:hover:text-brand-cyan"
            >
              Get Started
            </Link>
            <Link
              href="/my-prints"
              className="text-gray-400 font-bold uppercase text-xs tracking-widest transition-all md:hover:text-brand-cyan"
            >
              Print Queue
            </Link>
          </div>

          {/* Contact Group */}
          <div className="flex flex-col gap-3">
            <h4 className="font-black uppercase text-[10px] text-gray-600 mb-1 tracking-[0.3em]">
              Support
            </h4>
            <a
              href="mailto:yashgoyalambk@gmail.com"
              className="text-gray-400 font-bold uppercase text-xs tracking-widest transition-all md:hover:text-brand-purple"
            >
              Email Admin
            </a>
            <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">
              New Delhi, IN
            </span>
          </div>
        </div>

        {/* Decorative Element: Recessed Power Indicator */}
        <div className="absolute right-8 top-8 hidden md:block">
          <div className="w-12 h-12 bg-brand-matte shadow-neu-in rounded-2xl flex items-center justify-center border border-white/5">
            <div className="w-2 h-2 bg-brand-cyan rounded-full shadow-glow-cyan" />
          </div>
        </div>
      </div>

      {/* Final "Stamp" message - Inset Text effect */}
      <div className="mt-12 text-center">
        <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.6em] select-none">
          No Queue • No Stress • Just Print
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
