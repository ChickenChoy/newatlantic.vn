import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NEW AIT - Tân Đại Tây Dương | Thiết bị công nghiệp chính hãng",
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
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
