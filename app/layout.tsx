import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blynk Internet",
  description: "Simple plans, powerful support",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={mulish.className}>{children}</body>
    </html>
  );
}
