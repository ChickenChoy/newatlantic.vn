import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SEO_FILE = path.join(process.cwd(), "data", "seo.json");

// Types
interface SEOGlobal {
    siteName: string;
    siteDescription: string;
    siteKeywords: string;
    defaultOgImage: string;
    googleVerification: string;
    bingVerification: string;
    yandexVerification: string;
    facebookAppId: string;
    twitterHandle: string;
}

interface SEOPage {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    noIndex: boolean;
}

interface SEORobots {
    allowAll: boolean;
    disallowPaths: string[];
    crawlDelay: number;
    customRules: string;
}

interface SEOSitemap {
    enabled: boolean;
    changeFrequency: Record<string, string>;
    priority: Record<string, number>;
    excludePaths: string[];
}

interface SEOOpenGraph {
    defaultType: string;
    siteName: string;
    locale: string;
    facebookPageUrl: string;
}

interface SEOData {
    global: SEOGlobal;
    pages: Record<string, SEOPage>;
    robots: SEORobots;
    sitemap: SEOSitemap;
    openGraph: SEOOpenGraph;
    updatedAt: string;
}

async function getSEOData(): Promise<SEOData> {
    try {
        const content = await fs.readFile(SEO_FILE, "utf-8");
        return JSON.parse(content);
    } catch {
        // Return default structure if file doesn't exist
        return {
            global: {
                siteName: "NEW ATLANTIC - Tân Đại Tây Dương",
                siteDescription: "",
                siteKeywords: "",
                defaultOgImage: "/images/logo/og-image.jpg",
                googleVerification: "",
                bingVerification: "",
                yandexVerification: "",
                facebookAppId: "",
                twitterHandle: "",
            },
            pages: {},
            robots: {
                allowAll: true,
                disallowPaths: ["/api/", "/admin/", "/_next/"],
                crawlDelay: 0,
                customRules: "",
            },
            sitemap: {
                enabled: true,
                changeFrequency: { home: "daily", products: "weekly", posts: "monthly" },
                priority: { home: 1.0, products: 0.8, posts: 0.6 },
                excludePaths: [],
            },
            openGraph: {
                defaultType: "website",
                siteName: "NEW ATLANTIC",
                locale: "vi_VN",
                facebookPageUrl: "",
            },
            updatedAt: new Date().toISOString(),
        };
    }
}

async function saveSEOData(data: SEOData): Promise<void> {
    data.updatedAt = new Date().toISOString();
    await fs.writeFile(SEO_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET - Retrieve SEO settings
export async function GET() {
    try {
        const data = await getSEOData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading SEO data:", error);
        return NextResponse.json({ error: "Failed to read SEO data" }, { status: 500 });
    }
}

// PUT - Update SEO settings
export async function PUT(request: NextRequest) {
    try {
        const updates = await request.json();
        const currentData = await getSEOData();

        // Deep merge updates
        const newData: SEOData = {
            ...currentData,
            ...updates,
            global: { ...currentData.global, ...updates.global },
            pages: { ...currentData.pages, ...updates.pages },
            robots: { ...currentData.robots, ...updates.robots },
            sitemap: { ...currentData.sitemap, ...updates.sitemap },
            openGraph: { ...currentData.openGraph, ...updates.openGraph },
        };

        await saveSEOData(newData);

        return NextResponse.json({ success: true, data: newData });
    } catch (error) {
        console.error("Error updating SEO data:", error);
        return NextResponse.json({ error: "Failed to update SEO data" }, { status: 500 });
    }
}

// PATCH - Partial update (specific section)
export async function PATCH(request: NextRequest) {
    try {
        const { section, data } = await request.json();
        const currentData = await getSEOData();

        if (section === "global") {
            currentData.global = { ...currentData.global, ...data };
        } else if (section === "pages") {
            currentData.pages = { ...currentData.pages, ...data };
        } else if (section === "robots") {
            currentData.robots = { ...currentData.robots, ...data };
        } else if (section === "sitemap") {
            currentData.sitemap = { ...currentData.sitemap, ...data };
        } else if (section === "openGraph") {
            currentData.openGraph = { ...currentData.openGraph, ...data };
        } else {
            return NextResponse.json({ error: "Invalid section" }, { status: 400 });
        }

        await saveSEOData(currentData);

        return NextResponse.json({ success: true, data: currentData });
    } catch (error) {
        console.error("Error patching SEO data:", error);
        return NextResponse.json({ error: "Failed to patch SEO data" }, { status: 500 });
    }
}
