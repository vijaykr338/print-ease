"use client";

import { useSession, signIn } from "next-auth/react";

export default function StartButton() {
  const { data: session } = useSession();

  const handleStartClick = async () => {
    if (!session) {
      await signIn("google");
    } else {
      window.location.href = "/Start";
    }
  };

  return (
    <button
      onClick={handleStartClick}
      className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors text-center mr-1"
    >
      Print Now
    </button>
  );
}
