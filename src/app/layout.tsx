import "./globals.css";
import type { Metadata } from "next";
import { Inter, Permanent_Marker, Poppins } from "next/font/google";
import Nav from "@/components/home/Nav";
import { SessionProvider } from "next-auth/react";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import Footer from "@/components/Footer"
const inter = Inter({ subsets: ["latin"] });
const permanentMarker = Permanent_Marker({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "InstaPrint",
  description: "Print Smart, Skip the Wait!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.className} ${permanentMarker.className} ${poppins.className}`}
      >
        <SessionProvider>
          <Nav/>
          <ServiceWorkerRegister></ServiceWorkerRegister>
          <main className="bg-black w-full">{children}</main>
          <Footer/>
        </SessionProvider>
      </body>
    </html>
  );
}
