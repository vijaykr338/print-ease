"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavbarComponent() {
  const pathname = usePathname();
  
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            InstaPrint
          </Link>
          <div className="flex gap-8">
            <Link 
              href="/"
              className={`${pathname === '/' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              Home
            </Link>
            <Link 
              href="/my-prints"
              className={`${pathname === '/my-prints' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
            >
              My Prints
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}