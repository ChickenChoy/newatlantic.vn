import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./banh-chung.css";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
};

export const metadata: Metadata = {
    title: "Chương trình gói bánh chưng | Tân Đại Tây Dương",
    description:
        "Chương trình gói bánh chưng truyền thống - Cùng nhau đón TẾT, gìn giữ nét đẹp văn hóa Việt Nam",
    keywords: [
        "bánh chưng",
        "gói bánh chưng",
        "TẾT Nguyên Đán",
        "truyền thống Việt Nam",
        "New Atlantic",
        "Tân Đại Tây Dương",
    ],
    openGraph: {
        title: "Chương trình gói bánh chưng | Tân Đại Tây Dương",
        description:
            "Chương trình gói bánh chưng truyền thống - Cùng nhau đón TẾT, gìn giữ nét đẹp văn hóa Việt Nam",
        type: "website",
        locale: "vi_VN",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function BanhChungLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${playfair.variable} ${outfit.variable} banh-chung-body`}>
            {children}
        </div>
    );
}
