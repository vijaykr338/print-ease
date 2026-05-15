"use-client"

import Preview from "./Preview";
import Steps from "./Steps";


export default function HowItWorksPage() {
    return (
      <div className="container mx-auto px-4 mt-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Our streamlined process makes printing documents effortless. Follow these simple steps to skip the queue and save time.
          </p>
        </div>
  
        <div className="flex flex-col items-center mb-10">
          <Steps/>
          {/* <Preview/> */}
        </div>
      </div>
    );
  }