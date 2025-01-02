import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { TypewriterEffectSmooth } from '../components/ui/TypeWriterEffect';
import { BackgroundBeamsWithCollision } from '../components/ui/BackgroundBeamsWithCollision';
import StartButton from '../components/StartButton';

export default function Home() {
  return (
    <div className="h-[80vh] w-full relative bg-black text-white min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden ">
      <BackgroundBeamsWithCollision className="w-screen  z-0">
        {/* Add any children elements here if needed */}
        <div className="relative z-10 flex justify-center items-center flex-col">
          <TypewriterEffectSmooth
            words={[{ text: "Print Smart, Skip the Wait!" }]}
            className="text-4xl font-bold mb-10 text-center"
          />
          <StartButton />
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}