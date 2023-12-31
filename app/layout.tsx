import "./globals.css";
import { twMerge } from "tailwind-merge";
import { Inter } from "next/font/google";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatGPT Demo",
  description: "Generated by Tronx",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          "h-screen w-screen flex flex-row bg-none bg-white text-black",
          inter.className
        )}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
