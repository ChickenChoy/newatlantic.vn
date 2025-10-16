import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ProgressBar from "@/components/ProgressBar";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  title: "NEW ATLANTIC - Tân Đại Tây Dương | Thiết bị công nghiệp chính hãng",
  description: "Nhà phân phối chính hãng WILL-BURT, HIAB, LOVOL, LIUGONG tại Việt Nam. Cung cấp cột tự nâng, thiết bị nâng hạ, máy móc công trình chất lượng cao.",
  keywords: "WILL-BURT, HIAB, LOVOL, LIUGONG, cột tự nâng, thiết bị nâng hạ, máy móc công trình",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className={`${inter.variable} antialiased`} style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
        <ProgressBar />
        <Header />
        <PageTransition>
          <main className="min-h-screen">
            {children}
          </main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
