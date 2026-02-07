import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ProgressBar from "@/components/ProgressBar";
import { ToastProvider } from "@/components/ToastProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import LayoutWrapper from "@/components/LayoutWrapper";
import { siteConfig } from "@/lib/seo";
import { getCategories, getSiteSettings, getOfficeLocations, getFooterLinks } from "@/lib/db-supabase";

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter",
  preload: true,
});

// Force dynamic rendering to ensure footer data is always fresh
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name + " | Thiết bị công nghiệp chính hãng",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: '/images/logo/favicon.ico', sizes: 'any' },
      { url: '/images/logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/logo/favicon.ico',
  },
  keywords: [
    "WILL-BURT",
    "HIAB",
    "SKYMARK",
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
  // TODO: Add verification codes from Google Search Console and Yandex Webmaster
  // verification: {
  //   google: "your-actual-google-verification-code",
  //   yandex: "your-actual-yandex-verification-code",
  // },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "Industrial Equipment",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch footer data server-side
  const footerData = {
    categories: await getCategories(),
    siteSettings: await getSiteSettings(),
    offices: (await getOfficeLocations()).filter(o => (o as any).enabled !== false),
    footerLinks: (await getFooterLinks()).filter(l => (l as any).enabled !== false),
  };

  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#5f7ab8" />
        <link rel="icon" type="image/x-icon" href="/images/logo/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/images/logo/favicon.ico" />
        <link rel="manifest" href="/images/logo/site.webmanifest" />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <CookieConsent />
        <ToastProvider>
          <ProgressBar />
          <LayoutWrapper footerData={footerData}>{children}</LayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
