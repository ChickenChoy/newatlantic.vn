import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ProgressBar from "@/components/ProgressBar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import { siteConfig } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name + " | Thiết bị công nghiệp chính hãng",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "WILL-BURT",
    "HIAB",
    "LOVOL",
    "LIUGONG",
    "cột tự nâng",
    "thiết bị nâng hạ",
    "máy móc công trình",
    "cẩu tự hành",
    "xe nâng",
    "máy đào",
    "thiết bị công nghiệp",
    "NEW ATLANTIC",
    "Tân Đại Tây Dương",
    "Clark Masts",
    "Moffett",
    "EFFER",
    "thiết bị xây dựng",
    "máy móc công nghiệp",
  ],
  authors: [{ name: siteConfig.companyName, url: siteConfig.url }],
  creator: siteConfig.companyName,
  publisher: siteConfig.companyName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name + " | Thiết bị công nghiệp chính hãng",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name + " | Thiết bị công nghiệp chính hãng",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@newatlantic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "Industrial Equipment",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#5f7ab8" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/images/logo/site.webmanifest" />
      </head>
      <body className={`${inter.variable} antialiased`} style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
        <ScrollProgressBar />
        <ProgressBar />
        <Header />
        <PageTransition>
          <main className="min-h-screen">
            {children}
          </main>
        </PageTransition>
        <Footer />
        <FloatingContactButtons />
      </body>
    </html>
  );
}
