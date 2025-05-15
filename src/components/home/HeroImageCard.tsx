"use-client"

import Image from "next/image";

const HeroImageCard = () => {
    return (
      <div className="order-2 relative">
        <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl border
         border-neutral-700 transform hover:scale-[1.02] transition-transform duration-500">
          
          <div className="p-4 bg-neutral-800 border-b border-neutral-700 flex items-center">
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-4 text-sm text-neutral-400">PrintEase Dashboard</span>
          </div>
  
          <div className="p-6">
            <Image
              src="/3411083.jpg"
              alt="Professional using PrintEase service"
              className="rounded object-cover"
              width={40}
              height={40}
            />
  
            <div className="mt-6 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-neutral-300">Upload Status</span>
                <span className="text-xs px-2 py-1 bg-[#6C63FF]/20 text-[#6C63FF] rounded">
                  Complete
                </span>
              </div>
  
              <div className="space-y-3">
                <OtpDisplay otp="247891" />
                <hr className="h-px bg-neutral-800 my-2" />
                <UploadSuccess />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const OtpDisplay = ({ otp }: { otp: string }) => (
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-3 text-[#00E0FF]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <div className="text-xs text-neutral-400">Your OTP</div>
        <div className="text-lg font-mono font-bold text-white">{otp}</div>
      </div>
    </div>
  );
  
  const UploadSuccess = () => (
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-3 text-green-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm text-neutral-300">Upload completed successfully</span>
    </div>
  );
  
  export default HeroImageCard;
  