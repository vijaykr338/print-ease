import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-6">Print Smart, Skip the Wait!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Upload your documents and get them printed instantly with our smart printing service.
      </p>
      <Link
        href="/my-prints"
        className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
      >
        Drop your PDF / START
      </Link>
    </div>
  );
}