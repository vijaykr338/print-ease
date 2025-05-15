import FeatureCard from "./FeatureCard";
import { CloudUpload, ShieldCheck, Key ,ClipboardList,Clock,Settings} from "lucide-react"; // Or use Heroicons or your custom SVGs

const features = [
  {
    title: "Easy Document Upload",
    description: "Upload your documents from anywhere using our intuitive interface. Support for multiple file formats.",
    icon: <CloudUpload className="h-7 w-7 text-[#6C63FF]" />,
    points: [
      "Multiple file formats (.doc, .pdf, .ppt)",
      "Simple interface",
    ],
  },
  {
    title: "Queue-free Experience",
    description: "Submit your documents remotely and pick them up when ready. No more standing in long lines.",
    icon: <Clock className="h-7 w-7 text-[#6C63FF]" />,
    points: [
      "Save up to 15 minutes per print job",
      "Pick up at your convenience",
    ],
  },
  {
    title: "Secure OTP Verification",
    description: "Receive a unique OTP for each print job. Ensures your documents are collected only by you.",
    icon: <Key className="h-7 w-7 text-[#6C63FF]" />,
    points: [
      "One-time password for each print job",
      "Encrypted document storage",
    ],
  },
  {
    title: "End-to-End Privacy",
    description: "We value your privacy. All data is encrypted and deleted after processing.",
    icon: <ShieldCheck className="h-7 w-7 text-[#6C63FF]" />,
    points: [
      "No data retention after print",
      "Privacy-focused infrastructure",
    ],
  },
  {
    title: "Print Customization",
    description: "Customize your print settings before submission. Choose paper quality, color, and binding options.",
    icon: <Settings className="h-7 w-7 text-[#6C63FF]" />,
    points: [
      "Multiple paper type options",
      "Color or black & white selection",
    ],
  },
  {
    title: "Job History & Tracking",
    description: "View your complete print history and track current jobs in real-time through your dashboard.",
    icon: <ClipboardList className="h-7 w-7 text-[#6C63FF]" />,
    points: [
      "Complete job history archive",
      "Reprint previously submitted documents",
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Features</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Our platform streamlines the printing process, saving you time and eliminating the frustration of waiting in long queues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto px-8">
        {features.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} />
        ))}
      </div>
    </section>
  );
}
