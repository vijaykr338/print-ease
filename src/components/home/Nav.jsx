'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import Image from 'next/image';
import SignIn from '../sign-in';
import Link from 'next/link';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);
  const toggleProfile = () => setProfileOpen(prev => !prev);

  const navLinks=[
    {title:"Home",
    path:"/"
  },
    {title:"Upload File",
    path:"/Start"
  },
    {title:"My Prints",
    path:"/my-prints"
  },
  
  ]
  const handleSignOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    // Optional enhancements (resize/scroll/etc)
  }, []);

  return (
    <section id="header" className="bg-neutral-900 text-white">
      <header className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-white">
              PrintEase<span className="text-[#6C63FF]">.</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(obj => (
              <Link 
                key={obj.title}
                href={obj.path}
                
                className="text-white hover:text-[#00E0FF] transition-colors duration-300"
              >
                {obj.title}
              </Link>
            ))}

            {/* Sign In / Profile */}
            {session ? (
              <div className="relative">
                <Image
                  src={session.user?.image || '/default-image.png'}
                  width={30}
                  height={30}
                  alt="Profile"
                  className="rounded-full cursor-pointer"
                  onClick={toggleProfile}
                />
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-30">
                    <button
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left"
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-neutral-800 mt-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map(obj => (
                <Link
                  key={obj.title}
                  href={obj.path}
                  onClick={closeMenu}
                  className="text-white hover:text-[#00E0FF] transition-colors duration-300"
                >
                  {obj.title}
                </Link>
              ))}
              <div className="pt-2">
                {session ? (
                  <button
                    onClick={handleSignOut}
                    className="text-white hover:text-[#FF6B6B] transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <SignIn />
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </section>
  );
}
