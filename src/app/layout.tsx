import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/index.css";
import Navbar from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chitham.com"), // <-- đổi thành domain thật của bạn
  title: {
    default: "Chị Thắm - Tư vấn BHXH & BHYT",
    template: "%s | Chị Thắm - Tư vấn BHXH & BHYT",
  },
  description:
    "Trang tin kiến thức và tư vấn về Bảo hiểm xã hội, Bảo hiểm y tế chính thống. Hỗ trợ bà con tiếp cận quyền lợi an sinh xã hội dễ dàng hơn.",
  keywords: [
    "BHXH",
    "BHYT",
    "bảo hiểm xã hội",
    "bảo hiểm y tế",
    "tư vấn BHXH",
    "Chị Thắm",
  ],
  authors: [{ name: "Chị Thắm" }],
  creator: "Chị Thắm",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://chitham.com",
    siteName: "Chị Thắm - Tư vấn BHXH & BHYT",
    title: "Chị Thắm - Tư vấn BHXH & BHYT",
    description:
      "Trang tin kiến thức và tư vấn về Bảo hiểm xã hội, Bảo hiểm y tế chính thống.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chị Thắm - Tư vấn BHXH & BHYT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chị Thắm - Tư vấn BHXH & BHYT",
    description:
      "Trang tin kiến thức và tư vấn về Bảo hiểm xã hội, Bảo hiểm y tế chính thống.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="min-h-screen bg-[#FDFDFD] font-sans antialiased">
        <Suspense
          fallback={
            <div className="h-20 bg-white border-b border-slate-100 animate-pulse" />
          }
        >
          <Navbar />
        </Suspense>
        <main className="mx-auto max-w-7xl pb-20 pt-8">{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}