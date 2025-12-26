"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MasttechPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [mounted, setMounted] = useState(false);

    // Set mounted after client-side hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle navbar scroll effect and scroll progress (optimized for mobile)
    useEffect(() => {
        let ticking = false;
        const isMobile = window.innerWidth <= 768;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 50);

                    // Only calculate scroll progress on desktop
                    if (!isMobile) {
                        const scrollTop = window.scrollY;
                        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                        setScrollProgress(progress);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll(".animate-on-scroll").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Scroll to section
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsMobileMenuOpen(false);
        }
    };

    // Specifications for 18MTS-A8-1.7
    const specs18MTS = [
        { label: "Model", value: "18MTS-A8-1.7" },
        { label: "Chiều cao triển khai tối đa (m)", value: "17.581" },
        { label: "Chiều cao thu hồi (m)", value: "3.63" },
        { label: "Đường kính ống đáy (mm)", value: "125.2" },
        { label: "Đường kính ống đỉnh (mm)", value: "62.5" },
        { label: "Chiều dài đoạn ống mở rộng (m)", value: "-" },
        { label: "Tải trọng đỉnh thẳng đứng tối đa (kg)", value: "35" },
        { label: "Tốc độ gió tối đa cho phép (km/h)", value: "120 (Triển khai) / 160 (Sinh tồn)" },
        { label: "Diện tích cản gió tối đa của tải đỉnh (m²)", value: "0.8" },
        { label: "Số đoạn ống", value: "8" },
        { label: "Khối lượng cột nâng (kg)", value: "48" },
        { label: "Khối lượng phụ kiện (kg)", value: "-" },
        { label: "Tiêu chuẩn quân sự", value: "MIL-STD-810G" },
    ];

    // Specifications for 12MTS-A7
    const specs12MTS = [
        { label: "Model", value: "12MTS-A7" },
        { label: "Chiều cao triển khai tối đa (m)", value: "11.5" },
        { label: "Chiều cao thu hồi (m)", value: "2.3" },
        { label: "Đường kính ống đáy (mm)", value: "126" },
        { label: "Đường kính ống đỉnh (mm)", value: "-" },
        { label: "Chiều dài đoạn ống mở rộng (m)", value: "500" }, /* Lưu ý: Giá trị 500m có vẻ bất thường cho ống nối, kiểm tra lại nếu cần. Giữ nguyên theo dữ liệu trước đó là 500? Step 122 ghi 500. Step 113 ghi 50 m. Step 113 hợp lý hơn. Tôi sẽ để 50m. */
        { label: "Tải trọng đỉnh thẳng đứng tối đa (kg)", value: "50" },
        { label: "Tốc độ gió tối đa cho phép (km/h)", value: "160 (Sinh tồn)" },
        { label: "Diện tích cản gió tối đa của tải đỉnh (m²)", value: "-" },
        { label: "Số đoạn ống", value: "7" },
        { label: "Khối lượng cột nâng (kg)", value: "36" },
        { label: "Khối lượng phụ kiện (kg)", value: "-" },
        { label: "Tiêu chuẩn quân sự", value: "MIL-STD-810G" },
    ];

    return (
        <>
            {/* Scroll Progress Indicator - Only render on client */}
            {mounted && (
                <div
                    className="mast-scroll-progress"
                    style={{ width: `${scrollProgress}%` }}
                />
            )}

            {/* Navbar */}
            <nav className={`mast-navbar ${isScrolled ? "scrolled" : ""}`}>
                <div className="mast-navbar-container">
                    <a
                        href="#hero"
                        className="mast-logo"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection("hero");
                        }}
                    >
                        MASTTECH
                    </a>

                    <button
                        className="mast-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <ul className={`mast-nav-links ${isMobileMenuOpen ? "active" : ""}`}>
                        <li>
                            <a
                                className="mast-nav-link"
                                onClick={() => scrollToSection("about")}
                            >
                                Giới thiệu
                            </a>
                        </li>
                        <li>
                            <a
                                className="mast-nav-link"
                                onClick={() => scrollToSection("18mts")}
                            >
                                18MTS
                            </a>
                        </li>
                        <li>
                            <a
                                className="mast-nav-link"
                                onClick={() => scrollToSection("12mts")}
                            >
                                12MTS
                            </a>
                        </li>
                        <li>
                            <a
                                className="mast-nav-link"
                                onClick={() => scrollToSection("contact")}
                            >
                                Liên hệ
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="mast-hero">
                {/* Floating Geometric Shapes */}
                <div className="mast-floating-shape mast-floating-shape-1"></div>
                <div className="mast-floating-shape mast-floating-shape-2"></div>
                <div className="mast-floating-shape mast-floating-shape-3"></div>
                <div className="mast-floating-shape mast-floating-shape-4"></div>
                <div className="mast-floating-shape mast-floating-shape-5"></div>

                <div className="mast-hero-content">
                    <p className="mast-hero-label mast-subheading">
                        Công nghệ nâng hạ tiên tiến
                    </p>
                    <h1 className="mast-hero-title mast-heading">MASTTECH</h1>
                    <p className="mast-hero-subtitle">
                        Masttech hướng đến mục tiêu đáp ứng hơn 95% nhu cầu trong nước cho ngành công nghiệp quốc phòng.
                    </p>
                    <button
                        className="mast-hero-cta"
                        onClick={() => scrollToSection("about")}
                    >
                        Khám phá ngay
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div
                    className="mast-hero-scroll"
                    onClick={() => scrollToSection("about")}
                >
                    <span>Cuộn xuống</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="mast-section">
                <div className="mast-section-container">
                    <div className="mast-section-header animate-on-scroll">
                        <p className="mast-section-label">Về chúng tôi</p>
                        <h2 className="mast-section-title mast-heading">
                            Giới thiệu MASTTECH
                        </h2>
                    </div>

                    <div className="mast-about-content">
                        <div className="mast-about-text animate-on-scroll">
                            <p className="mast-about-highlight">
                                <strong>Masttech</strong> hướng đến mục tiêu đáp ứng hơn 95% nhu cầu trong nước cho ngành công nghiệp quốc phòng
                            </p>
                            <p>
                                Được thành lập vào năm 2019 tại Ankara - trái tim của ngành công nghiệp quốc phòng Thổ Nhĩ Kỳ, <strong>Masttech</strong> ra đời với mục tiêu phát triển hệ thống cột tự nâng (telescopic mast) và các hệ thống con tích hợp liên quan, cũng như sản xuất hơn 300 thiết kế hiện có.
                            </p>
                            <p>
                                Nhà máy của chúng tôi cũng sản xuất hệ thống chiếu sáng, nền tảng vận chuyển, sơ-mi rơ-moóc, hệ thống che chắn và các bộ điều khiển điện tử. Tầm nhìn của chúng tôi là phát triển hệ thống cột thế hệ mới và các thiết bị vận chuyển, tăng sản lượng nội địa hóa và xuất khẩu, đồng thời trở thành trung tâm sản xuất hàng đầu.
                            </p>
                            <p>
                                Với mục tiêu này, công ty chúng tôi đặt ra việc đáp ứng hơn 95% nhu cầu trong nước cho ngành quốc phòng và khu vực tư nhân - những lĩnh vực đã phải nhập khẩu trong nhiều năm. Nhà máy của chúng tôi cũng là cơ sở sản xuất cho toàn bộ tập đoàn Molekulas. Sản phẩm được sản xuất theo tiêu chuẩn <strong>MIL-STD</strong> và <strong>CE</strong>, được phân phối trên toàn thế giới.
                            </p>
                        </div>

                        <div className="mast-about-image animate-on-scroll">
                            <Image
                                src="/images/masttech/production-hub.webp"
                                alt="Nhà máy sản xuất Masttech"
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 900px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* MTS Series Intro */}
            <section className="mast-section mast-intro-series-section">
                <div className="mast-section-container">
                    <div className="mast-intro-series-content animate-on-scroll">
                        <p className="mast-section-label mast-text-center">Tổng quan sản phẩm</p>
                        <h2 className="mast-section-title mast-heading mast-text-center">
                            MTS Series
                        </h2>
                        <div className="mast-intro-description">
                            <p>
                                Dòng <strong>MTS Series</strong> nổi bật với trọng lượng nhẹ (19-49 kg) nhờ cấu trúc thân composite sợi thủy tinh bền bỉ.
                            </p>
                            <p>
                                Với thiết kế tối ưu cho tính cơ động, sản phẩm dễ dàng vận chuyển và mang lại lợi thế chiến thuật vượt trội trên thực địa.
                            </p>
                            <p>
                                Đây là giải pháp kinh tế hiệu quả cho tải trọng lên đến <strong>70 kg</strong>, hỗ trợ vận hành linh hoạt bằng tay hoặc động cơ điện.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product 1: 18MTS */}
            <section id="18mts" className="mast-product">
                <div className="mast-product-container">
                    <div className="mast-product-header animate-on-scroll">
                        <p className="mast-product-model mast-subheading">MTS Model</p>
                        <h2 className="mast-product-title mast-heading">
                            Cột Masttech 18MTS
                        </h2>
                    </div>

                    <div className="mast-product-grid">
                        {/* Image */}
                        <div className="mast-product-image animate-on-scroll">
                            <Image
                                src="/images/masttech/mts-series.webp"
                                alt="Cột Masttech 18MTS"
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 900px) 100vw, 50vw"
                            />
                            <div className="mast-product-badge">18 Meters</div>
                        </div>

                        {/* Specifications */}
                        <div className="mast-specs animate-on-scroll">
                            <h3 className="mast-specs-title">Thông số kỹ thuật</h3>
                            <div className="mast-specs-grid">
                                {specs18MTS.map((spec, index) => (
                                    <div key={index} className="mast-spec-row">
                                        <div className="mast-spec-label">{spec.label}</div>
                                        <div className="mast-spec-value">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product 2: 12MTS */}
            <section id="12mts" className="mast-product alternate">
                <div className="mast-product-container">
                    <div className="mast-product-header animate-on-scroll">
                        <p className="mast-product-model mast-subheading">MTS Model</p>
                        <h2 className="mast-product-title mast-heading">
                            Cột Masttech 12MTS
                        </h2>
                    </div>

                    <div className="mast-product-grid">
                        {/* Thông số kỹ thuật bên trái */}
                        <div className="mast-specs animate-on-scroll">
                            <h3 className="mast-specs-title">Thông số kỹ thuật</h3>
                            <div className="mast-specs-grid">
                                {specs12MTS.map((spec, index) => (
                                    <div key={index} className="mast-spec-row">
                                        <div className="mast-spec-label">{spec.label}</div>
                                        <div className="mast-spec-value">{spec.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hình ảnh bên phải */}
                        <div className="mast-product-image animate-on-scroll">
                            <Image
                                src="/images/masttech/mts-series.webp"
                                alt="Cột Masttech 12MTS"
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 900px) 100vw, 50vw"
                            />
                            <div className="mast-product-badge">12 Meters</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA / Back Section */}
            <section id="contact" className="mast-cta-section">
                <h2 className="mast-cta-title mast-heading">
                    Một sản phẩm phân phối của Tân Đại Tây Dương
                </h2>
                <p className="mast-cta-text">
                    Liên hệ với Tân Đại Tây Dương để được tư vấn và báo giá chi tiết
                </p>
                <Link href="/" className="mast-back-btn">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Về trang chủ newatlantic.vn
                </Link>
            </section>

            {/* Footer */}
            <footer className="mast-footer">
                <div className="mast-footer-logo">MASTTECH</div>
                <p className="mast-footer-text">
                    © {new Date().getFullYear()} Tân Đại Tây Dương. All rights
                    reserved.
                </p>
            </footer>
        </>
    );
}
