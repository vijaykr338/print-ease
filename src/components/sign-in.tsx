"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="antialiased transform-gpu">
      {session ? (
        <div className="flex items-center space-x-4">
          {/* Recessed Profile Frame */}
          <div className="shadow-neu-in-sm p-1 rounded-full bg-brand-matte border border-white/5">
            <Image
              src={session.user?.image || "/default-image.png"}
              width={28}
              height={28}
              alt="User Profile"
              className="rounded-full opacity-90"
            />
          </div>

          <button
            onClick={handleSignOut}
            className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-400 transition-colors"
          >
            Log Out
          </button>
        </div>
      ) : (
        /* The Tactile Neumorphic Google Button */
        <button
          onClick={() => signIn("google")}
          className="group flex items-center gap-3 bg-brand-matte text-gray-300 font-black uppercase px-6 py-2.5 rounded-xl 
                     shadow-neu-sm hover:shadow-neu-in-sm active:scale-[0.97] transition-all duration-200 border border-white/5"
        >
          {/* Glowing Google G Icon */}
          <svg
            className="w-4 h-4 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-[11px] tracking-[0.15em] group-hover:text-white transition-colors">
            Sign In
          </span>
        </button>
      )}
    </div>
  );
}
