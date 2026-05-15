"use client";

import { useSession, signIn } from "next-auth/react";

type StartButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function StartButton({ className, children }: StartButtonProps) {
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
      className={
        className ||
        "bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors text-center mr-1"
      }
    >
      {children || "Print Now"}
    </button>
  );
}
