import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Am Able - AI-Powered Sign Language Translation",
  description: "Breaking communication barriers with AI-powered sign language translation. Real-time translation for deaf and hard-of-hearing users.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <AccessibilityToolbar />
      </body>
    </html>
  );
}
