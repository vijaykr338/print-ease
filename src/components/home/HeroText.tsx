import { CheckCircle, Clock, Bell } from 'lucide-react';

const HeroText = () => {
  return (
    <div className="order-1">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
        <span className="text-[#6C63FF]">Print</span>Ease: Skip The Queue
      </h1>
      <p className="text-lg md:text-xl text-neutral-300 mb-8 mt-2">
        Cuz who wants to stand in crowd just to get your lab file printed just before classes? No one right.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#"
          className="px-8 py-3 bg-[#6C63FF] text-white font-semibold rounded-md hover:bg-[#5a52d5] transition-colors duration-300 text-center"
        >
          Get Started
        </a>
        <a
          href="#"
          className="px-8 py-3 bg-transparent border border-[#6C63FF] text-[#6C63FF] font-semibold rounded-md hover:bg-[#6C63FF]/10 transition-colors duration-300 text-center"
        >
          Learn More
        </a>
      </div>

      <div className="mt-12 flex items-center text-sm text-neutral-400 space-x-8">
        <FeatureItem icon={<Clock className="h-5 w-5 text-[#00E0FF]" />} text="Save time" />
        <FeatureItem icon={<CheckCircle className="h-5 w-5 text-[#00E0FF]" />} text="Secure uploads" />
        <FeatureItem icon={<Bell className="h-5 w-5 text-[#00E0FF]" />} text="Get notified" />
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </div>
);

export default HeroText;
