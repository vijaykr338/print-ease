"use client";

import Link from "next/link";
import SignIn from "./sign-in";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function NavbarComponent() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className=" border-b bg-black fixed z-50 w-full top-0">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-white">
            PrintEase
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors`}
            >
              Home
            </Link>
            <Link
              href={session ? "/my-prints" : "#"}
              className={`${
                pathname === "/my-prints" ? "text-blue-600" : "text-gray-600"
              } ${
                !session
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-blue-600 transition-colors"
              }`}
            >
              My Prints
            </Link>
            {session ? (
              <div className="relative ">
                <Image
                  src={session.user?.image || "/default-image.png"}
                  width={30}
                  height={30}
                  alt="Profile"
                  className="rounded-full cursor-pointer"
                  onClick={handleProfileClick}
                />
                {isProfileMenuOpen && (
                  <div className="border-l-slate-200 absolute right-0 mt-2 w-48 bg-gray-900 hover:bg-gray-700 rounded-md shadow-lg py-2 z-20">
                    <button
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-white w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <SignIn />
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 dark:bg-black text-white p-4">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "text-blue-600" : "text-gray-600"
            } block py-2 hover:text-blue-600 transition-colors`}
          >
            Home
          </Link>
          <Link
            href={session ? "/my-prints" : "#"}
            className={`${
              pathname === "/my-prints" ? "text-blue-600" : "text-gray-600"
            } ${
              !session
                ? "cursor-not-allowed opacity-50"
                : "hover:text-blue-600 transition-colors"
            }`}
          >
            My Prints
          </Link>
          <div className="py-2">
            <SignIn />
          </div>
        </div>
      )}
    </nav>
  );
}
import { signOut as nextAuthSignOut } from "next-auth/react";

async function signOut({ callbackUrl }: { callbackUrl: string }) {
  await nextAuthSignOut({ callbackUrl });
}
