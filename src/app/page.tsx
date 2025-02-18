import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { TypewriterEffectSmooth } from "../components/ui/TypeWriterEffect";
import { BackgroundBeamsWithCollision } from "../components/ui/BackgroundBeamsWithCollision";
import StartButton from "../components/StartButton";
import { FlipWords } from "../components/ui/Flip-Words";

export default function Home() {
  return (
    <div className="h-[85vh] w-full relative text-white min-h-[80vh] flex flex-col items-center justify-center text-center mt-10">
      <BackgroundBeamsWithCollision className="w-screen z-0">
        {/* Add any children elements here if needed */}
        <div className="relative z-10 flex justify-center items-center flex-col">
          <TypewriterEffectSmooth
            words={[{ text: "PrintHub for DTU" }]}
            className=" mb-10 text-center"
          />
          <h2 className="text-2xl font-medium mb-8 text-center">
            Print{" "}
            <FlipWords
              words={["Smartly", "Quickly", "Efficiently", "Easily"]}
              className="text-2xl font-medium text-center"
            />
          </h2>

          <StartButton />
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
