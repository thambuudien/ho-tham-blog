import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/index.css";
import Navbar from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Chị Thắm - Tư vấn BHXH & BHYT",
  description: "Trang tin kiến thức và tư vấn về Bảo hiểm xã hội, Bảo hiểm y tế chính thống. Hỗ trợ bà con tiếp cận quyền lợi an sinh xã hội dễ dàng hơn.",
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#FDFDFD] font-sans antialiased">
        <Suspense fallback={<div className="h-20 bg-white border-b border-slate-100 animate-pulse"></div>}>
          <Navbar />
        </Suspense>
        <main className="mx-auto max-w-7xl pb-20 pt-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
