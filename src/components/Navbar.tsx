"use client";

import Link from 'next/link';
import SignIn from './sign-in';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useSession } from 'next-auth/react';

export default function NavbarComponent() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            InstaPrint
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link 
              href="/"
              className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              Home
            </Link>
            <Link 
              href={session ? "/my-prints" : "#"}
              className={`${pathname === '/my-prints' ? 'text-blue-600' : 'text-gray-600'} ${!session ? 'cursor-not-allowed opacity-50' : 'hover:text-blue-600 transition-colors'}`}
            >
              My Prints
            </Link>
            <SignIn />
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 transition-colors">
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white p-4">
          <Link 
            href="/"
            className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-600'} block py-2 hover:text-blue-600 transition-colors`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link 
            href={session ? "/my-prints" : "#"}
            className={`${pathname === '/my-prints' ? 'text-blue-600' : 'text-gray-600'} ${!session ? 'cursor-not-allowed opacity-50' : 'hover:text-blue-600 transition-colors'}`}
            onClick={toggleMenu}
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