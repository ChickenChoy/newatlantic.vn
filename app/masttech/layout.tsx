import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./masttech.css";

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

export const metadata: Metadata = {
    title: "MASTTECH | Cột Tự Nâng Công Nghệ Cao",
    description:
        "Khám phá dòng sản phẩm cột tự nâng MASTTECH MTS - Giải pháp nâng hạ chuyên nghiệp với công nghệ tiên tiến từ Tân Đại Tây Dương",
    keywords: [
        "MASTTECH",
        "cột tự nâng",
        "MTS Model",
        "18MTS",
        "12MTS",
        "thiết bị nâng hạ",
        "New Atlantic",
    ],
    openGraph: {
        title: "MASTTECH | Cột Tự Nâng Công Nghệ Cao",
        description:
            "Khám phá dòng sản phẩm cột tự nâng MASTTECH MTS - Giải pháp nâng hạ chuyên nghiệp",
        type: "website",
    },
};

export default function MasttechLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${playfair.variable} ${outfit.variable} masttech-body`}>
            {children}
        </div>
    );
}
