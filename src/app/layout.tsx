import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { RegisterSW } from "@/components/RegisterSW";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "U7 Fitness Gym | Premium Fitness Club & Member Portal",
  description: "Experience the ultimate fitness transformation at U7 Fitness Gym, Palam Colony. Track workouts, manage memberships, check attendance, and view progress.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon-192.png",
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "U7 Gym",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-50 min-h-screen antialiased`}>
        <Providers>
          <RegisterSW />
          {children}
        </Providers>
      </body>
    </html>
  );
}