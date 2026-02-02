"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import MediaPicker from "@/components/admin/MediaPicker";

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

const PAGES = [
    { key: "home", label: "Trang chủ", path: "/" },
    { key: "products", label: "Sản phẩm", path: "/san-pham" },
    { key: "posts", label: "Tin tức", path: "/tin-tuc" },
    { key: "contact", label: "Liên hệ", path: "/lien-he" },
    { key: "about", label: "Giới thiệu", path: "/gioi-thieu" },
];

export default function SEOTab() {
    const [seoData, setSeoData] = useState<SEOData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<"global" | "pages" | "robots" | "sitemap" | "og">("global");
    const [selectedPage, setSelectedPage] = useState("home");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Fetch SEO data
    const fetchSEO = useCallback(async () => {
        try {
            const res = await fetch("/api/seo");
            const data = await res.json();
            setSeoData(data);
        } catch (error) {
            console.error("Error fetching SEO:", error);
            showToast("Không thể tải cấu hình SEO", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSEO();
    }, [fetchSEO]);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        if (!seoData) return;
        setSaving(true);
        try {
            const res = await fetch("/api/seo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(seoData),
            });
            if (res.ok) {
                showToast("Đã lưu cấu hình SEO", "success");
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Error saving SEO:", error);
            showToast("Lỗi khi lưu", "error");
        } finally {
            setSaving(false);
        }
    };

    const updateGlobal = (field: keyof SEOGlobal, value: string) => {
        if (!seoData) return;
        setSeoData({
            ...seoData,
            global: { ...seoData.global, [field]: value },
        });
    };

    const updatePage = (pageKey: string, field: keyof SEOPage, value: string | boolean) => {
        if (!seoData) return;
        const currentPage = seoData.pages[pageKey] || {
            title: "",
            description: "",
            keywords: "",
            ogImage: "",
            noIndex: false,
        };
        setSeoData({
            ...seoData,
            pages: {
                ...seoData.pages,
                [pageKey]: { ...currentPage, [field]: value },
            },
        });
    };

    const updateRobots = (field: keyof SEORobots, value: boolean | string[] | number | string) => {
        if (!seoData) return;
        setSeoData({
            ...seoData,
            robots: { ...seoData.robots, [field]: value },
        });
    };

    const updateOpenGraph = (field: keyof SEOOpenGraph, value: string) => {
        if (!seoData) return;
        setSeoData({
            ...seoData,
            openGraph: { ...seoData.openGraph, [field]: value },
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Icon icon="svg-spinners:ring-resize" className="w-8 h-8 text-primary" />
            </div>
        );
    }

    if (!seoData) {
        return (
            <div className="text-center py-12">
                <Icon icon="solar:warning-circle-bold" className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <p>Không thể tải cấu hình SEO</p>
                <button onClick={fetchSEO} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
                    Thử lại
                </button>
            </div>
        );
    }

    const currentPage = seoData.pages[selectedPage] || {
        title: "",
        description: "",
        keywords: "",
        ogImage: "",
        noIndex: false,
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
                        } text-white flex items-center gap-2`}
                >
                    <Icon icon={toast.type === "success" ? "solar:check-circle-bold" : "solar:close-circle-bold"} />
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Icon icon="solar:graph-up-bold" className="w-6 h-6 text-primary" />
                        Quản lý SEO
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Cấu hình meta tags, Open Graph, Sitemap và Robots.txt
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? (
                        <Icon icon="svg-spinners:ring-resize" className="w-5 h-5" />
                    ) : (
                        <Icon icon="solar:diskette-bold" className="w-5 h-5" />
                    )}
                    Lưu thay đổi
                </button>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {[
                    { key: "global", label: "Cài đặt chung", icon: "solar:settings-bold" },
                    { key: "pages", label: "Trang cụ thể", icon: "solar:document-bold" },
                    { key: "og", label: "Open Graph", icon: "solar:share-bold" },
                    { key: "robots", label: "Robots.txt", icon: "solar:bot-bold" },
                    { key: "sitemap", label: "Sitemap", icon: "solar:sitemap-bold" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveSection(tab.key as typeof activeSection)}
                        className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${activeSection === tab.key
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Icon icon={tab.icon} className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Global Settings */}
            {activeSection === "global" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Icon icon="solar:settings-bold" className="text-primary" />
                        Cài đặt SEO chung
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tên website</label>
                            <input
                                type="text"
                                value={seoData.global.siteName}
                                onChange={(e) => updateGlobal("siteName", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                placeholder="NEW ATLANTIC - Tân Đại Tây Dương"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                            <input
                                type="text"
                                value={seoData.global.twitterHandle}
                                onChange={(e) => updateGlobal("twitterHandle", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                placeholder="@newatlantic"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Mô tả mặc định
                                <span className="text-gray-400 ml-2">({seoData.global.siteDescription.length}/160)</span>
                            </label>
                            <textarea
                                value={seoData.global.siteDescription}
                                onChange={(e) => updateGlobal("siteDescription", e.target.value)}
                                rows={3}
                                maxLength={160}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                placeholder="Nhập mô tả website..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Keywords mặc định</label>
                            <input
                                type="text"
                                value={seoData.global.siteKeywords}
                                onChange={(e) => updateGlobal("siteKeywords", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                            <p className="text-xs text-gray-400 mt-1">Phân cách bằng dấu phẩy</p>
                        </div>

                        {/* Default OG Image with MediaPicker */}
                        <div className="md:col-span-2">
                            <MediaPicker
                                value={seoData.global.defaultOgImage}
                                onChange={(imageUrl) => updateGlobal("defaultOgImage", imageUrl)}
                                folder="seo"
                                label="Ảnh Open Graph mặc định"
                                placeholder="Chọn ảnh OG từ thư viện"
                                aspectRatio="video"
                            />
                            <p className="text-xs text-gray-400 mt-1">Kích thước đề xuất: 1200x630px</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Google Verification</label>
                            <input
                                type="text"
                                value={seoData.global.googleVerification}
                                onChange={(e) => updateGlobal("googleVerification", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                placeholder="Google site verification code"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Page-specific SEO */}
            {activeSection === "pages" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Icon icon="solar:document-bold" className="text-primary" />
                        SEO theo trang
                    </h3>

                    {/* Page selector */}
                    <div className="flex gap-2 flex-wrap">
                        {PAGES.map((page) => (
                            <button
                                key={page.key}
                                onClick={() => setSelectedPage(page.key)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedPage === page.key
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                    }`}
                            >
                                {page.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-4">
                            Đường dẫn: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                                {PAGES.find((p) => p.key === selectedPage)?.path}
                            </code>
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Title
                                    <span className="text-gray-400 ml-2">({currentPage.title.length}/60)</span>
                                </label>
                                <input
                                    type="text"
                                    value={currentPage.title}
                                    onChange={(e) => updatePage(selectedPage, "title", e.target.value)}
                                    maxLength={60}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                    placeholder="Tiêu đề trang"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                    <span className="text-gray-400 ml-2">({currentPage.description.length}/160)</span>
                                </label>
                                <textarea
                                    value={currentPage.description}
                                    onChange={(e) => updatePage(selectedPage, "description", e.target.value)}
                                    rows={3}
                                    maxLength={160}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                    placeholder="Mô tả trang..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Keywords</label>
                                <input
                                    type="text"
                                    value={currentPage.keywords}
                                    onChange={(e) => updatePage(selectedPage, "keywords", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                    placeholder="keyword1, keyword2"
                                />
                            </div>

                            {/* Page OG Image with MediaPicker */}
                            <div>
                                <MediaPicker
                                    value={currentPage.ogImage}
                                    onChange={(imageUrl) => updatePage(selectedPage, "ogImage", imageUrl)}
                                    folder="seo"
                                    label="Ảnh Open Graph trang này"
                                    placeholder="Chọn ảnh OG từ thư viện"
                                    aspectRatio="video"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="noIndex"
                                    checked={currentPage.noIndex}
                                    onChange={(e) => updatePage(selectedPage, "noIndex", e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="noIndex" className="text-sm">
                                    noindex - Không cho Google index trang này
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Google Preview */}
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                            <Icon icon="logos:google-icon" className="w-4 h-4" />
                            Xem trước trên Google
                        </p>
                        <div className="max-w-xl">
                            <p className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer">
                                {currentPage.title || seoData.global.siteName}
                            </p>
                            <p className="text-green-700 dark:text-green-500 text-sm">
                                https://newatlantic.vn{PAGES.find((p) => p.key === selectedPage)?.path}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                {currentPage.description || seoData.global.siteDescription}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Open Graph */}
            {activeSection === "og" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Icon icon="solar:share-bold" className="text-primary" />
                        Open Graph (Facebook, Zalo, LinkedIn)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Site Name</label>
                            <input
                                type="text"
                                value={seoData.openGraph.siteName}
                                onChange={(e) => updateOpenGraph("siteName", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Locale</label>
                            <select
                                value={seoData.openGraph.locale}
                                onChange={(e) => updateOpenGraph("locale", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                            >
                                <option value="vi_VN">Tiếng Việt (vi_VN)</option>
                                <option value="en_US">English (en_US)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Default Type</label>
                            <select
                                value={seoData.openGraph.defaultType}
                                onChange={(e) => updateOpenGraph("defaultType", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                            >
                                <option value="website">Website</option>
                                <option value="article">Article</option>
                                <option value="product">Product</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Facebook Page URL</label>
                            <input
                                type="url"
                                value={seoData.openGraph.facebookPageUrl}
                                onChange={(e) => updateOpenGraph("facebookPageUrl", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                                placeholder="https://facebook.com/your-page"
                            />
                        </div>
                    </div>

                    {/* OG Preview Card */}
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden max-w-md">
                        <div className="bg-gray-100 dark:bg-gray-700 aspect-video flex items-center justify-center">
                            {seoData.global.defaultOgImage ? (
                                <img src={seoData.global.defaultOgImage} alt="OG Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Icon icon="solar:gallery-bold" className="w-12 h-12 text-gray-400" />
                            )}
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50">
                            <p className="text-xs text-gray-400 uppercase">newatlantic.vn</p>
                            <p className="font-semibold text-sm">{seoData.global.siteName}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{seoData.global.siteDescription}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Robots.txt */}
            {activeSection === "robots" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Icon icon="solar:bot-bold" className="text-primary" />
                        Robots.txt
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="allowAll"
                                checked={seoData.robots.allowAll}
                                onChange={(e) => updateRobots("allowAll", e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <label htmlFor="allowAll" className="text-sm">
                                Cho phép tất cả bots crawl website
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Disallow Paths (mỗi dòng 1 path)
                            </label>
                            <textarea
                                value={seoData.robots.disallowPaths.join("\n")}
                                onChange={(e) => updateRobots("disallowPaths", e.target.value.split("\n").filter(Boolean))}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 font-mono text-sm"
                                placeholder="/api/&#10;/admin/&#10;/private/"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Crawl Delay (giây)</label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                value={seoData.robots.crawlDelay}
                                onChange={(e) => updateRobots("crawlDelay", parseInt(e.target.value) || 0)}
                                className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700"
                            />
                            <p className="text-xs text-gray-400 mt-1">0 = không giới hạn</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Custom Rules</label>
                            <textarea
                                value={seoData.robots.customRules}
                                onChange={(e) => updateRobots("customRules", e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 font-mono text-sm"
                                placeholder="# Custom rules here"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{`User-agent: *
${seoData.robots.allowAll ? "Allow: /" : "Disallow: /"}
${seoData.robots.disallowPaths.map((p) => `Disallow: ${p}`).join("\n")}
${seoData.robots.crawlDelay > 0 ? `Crawl-delay: ${seoData.robots.crawlDelay}` : ""}

Sitemap: https://newatlantic.vn/sitemap.xml`}</pre>
                    </div>
                </div>
            )}

            {/* Sitemap */}
            {activeSection === "sitemap" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Icon icon="solar:sitemap-bold" className="text-primary" />
                        Sitemap.xml
                    </h3>

                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Icon icon="solar:check-circle-bold" className="text-green-500 w-6 h-6" />
                        <div>
                            <p className="font-medium text-green-700 dark:text-green-400">Sitemap tự động</p>
                            <p className="text-sm text-green-600 dark:text-green-500">
                                Sitemap được tự động tạo từ sản phẩm, bài viết và trang tĩnh
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-3">Change Frequency</label>
                            <div className="space-y-2">
                                {Object.entries(seoData.sitemap.changeFrequency).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <span className="w-24 text-sm capitalize">{key}:</span>
                                        <select
                                            value={value}
                                            onChange={(e) => {
                                                const newFreq = { ...seoData.sitemap.changeFrequency, [key]: e.target.value };
                                                setSeoData({ ...seoData, sitemap: { ...seoData.sitemap, changeFrequency: newFreq } });
                                            }}
                                            className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700"
                                        >
                                            <option value="always">Always</option>
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="never">Never</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Priority (0.0 - 1.0)</label>
                            <div className="space-y-2">
                                {Object.entries(seoData.sitemap.priority).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <span className="w-24 text-sm capitalize">{key}:</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={value}
                                            onChange={(e) => {
                                                const newPriority = { ...seoData.sitemap.priority, [key]: parseFloat(e.target.value) };
                                                setSeoData({ ...seoData, sitemap: { ...seoData.sitemap, priority: newPriority } });
                                            }}
                                            className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <a
                            href="/sitemap.xml"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <Icon icon="solar:eye-bold" className="w-5 h-5" />
                            Xem Sitemap
                        </a>
                        <a
                            href="/robots.txt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                            <Icon icon="solar:eye-bold" className="w-5 h-5" />
                            Xem Robots.txt
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
