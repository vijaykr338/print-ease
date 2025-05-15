import React from "react";
import Link from "next/link"
const Footer = () => (
  <footer className="bg-neutral-900 text-gray-400 py-6 ">
    <div className="container mx-auto flex flex-col md:flex-row justify-between gap-4 px-16 md:px-32">
      <div>
      <div className="flex flex-col">
      <Link href="/" className="text-2xl font-bold text-white">
        PrintEase<span className="text-[#6C63FF]">.</span>
      </Link>
      <span className="text-sm md:text-left">
        © {new Date().getFullYear()} All rights reserved.
      </span>
      </div>
      <p className="text-lg md:text-xl text-neutral-400"> (IN SERVICE IN DELHI TECHNOLOGICAL UNIVERSITY FROM AUG 2025)</p>
      </div>
      <div className="flex gap-4 flex-col text-white">
        {/* <Link href="/">Home</Link> */}
        <a href="mailto:yashgoyalambk@gmail.com">Contact</a>
        <Link href="/Start">Get Started</Link>
        <Link href="/my-prints">History</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
