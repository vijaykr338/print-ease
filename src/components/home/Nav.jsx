"use client";

import Link from "next/link";
import SignIn from "../sign-in";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import Image from "next/image";

export default function NavbarComponent() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const handleSignOut = () => nextAuthSignOut({ callbackUrl: "/" });

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 transform-gpu">
      {/* Main Nav Pill: Raised Shadow */}
      <div className="bg-brand-matte shadow-neu-out rounded-full px-6 py-2.5 flex items-center justify-between border border-white/5">
        {/* Logo with Cyan Glow Dot */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2 h-2 bg-brand-cyan rounded-full shadow-glow-cyan" />
          <span className="text-lg font-black text-white uppercase italic tracking-tighter">
            Print<span className="text-brand-cyan">Ease</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { name: "Home", path: "/" },
            { name: "Upload", path: "/Start" },
            { name: "My Prints", path: "/my-prints", protected: true },
          ].map((link) => {
            const isActive = pathname === link.path;
            const isDisabled = link.protected && !session;
            return (
              <Link
                key={link.path}
                href={isDisabled ? "#" : link.path}
                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full ${
                  isActive
                    ? "shadow-neu-in text-brand-cyan"
                    : "text-gray-500 md:hover:text-gray-200"
                } ${isDisabled ? "opacity-20 cursor-not-allowed" : ""}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full shadow-neu-in-sm border border-white/5">
                <Image
                  src={session.user?.image || ""}
                  width={28}
                  height={28}
                  alt="User"
                  className="rounded-full opacity-80"
                />
              </div>
              <button
                onClick={handleSignOut}
                className="hidden sm:block text-[9px] font-black uppercase text-gray-500 md:hover:text-red-400"
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="scale-90">
              <SignIn />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full shadow-neu-sm flex items-center justify-center text-gray-400 active:shadow-neu-in-sm transition-all"
          >
            <MenuIcon fontSize="small" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 bg-brand-matte shadow-neu-out rounded-[2rem] p-6 border border-white/5 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link
            href="/"
            className="text-xs font-black uppercase text-gray-400 p-2 shadow-neu-in-sm rounded-xl text-center"
          >
            Home
          </Link>
          <Link
            href="/my-prints"
            className="text-xs font-black uppercase text-gray-400 p-2 shadow-neu-in-sm rounded-xl text-center"
          >
            My Prints
          </Link>
        </div>
      )}
    </nav>
  );
}
