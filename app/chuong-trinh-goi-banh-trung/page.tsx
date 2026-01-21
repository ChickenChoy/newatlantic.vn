"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BanhTrungPage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const galleryImages = [
        { src: "/images/chuong-trinh-goi-banh-trung/1.jpg", alt: "Hoạt động gói bánh trưng 1" },
        { src: "/images/chuong-trinh-goi-banh-trung/2.jpg", alt: "Hoạt động gói bánh trưng 2" },
        { src: "/images/chuong-trinh-goi-banh-trung/3.jpg", alt: "Hoạt động gói bánh trưng 3" },
        { src: "/images/chuong-trinh-goi-banh-trung/4.jpg", alt: "Hoạt động gói bánh trưng 4" },
        { src: "/images/chuong-trinh-goi-banh-trung/5.jpg", alt: "Hoạt động gói bánh trưng 5" },
        { src: "/images/chuong-trinh-goi-banh-trung/7.jpg", alt: "Hoạt động gói bánh trưng 7" },
    ];

    const scheduleData = [
        { day: "Thứ 5", date: "18.12 AL", solar: "5.2.2026", activity: "Hạn chót tập kích nguyên vật liệu", step: 1 },
        { day: "Thứ 6", date: "19.12 AL", solar: "6.2.2026", activity: "Rửa lá, ngâm gạo, đỗ", step: 2 },
        { day: "Thứ 7", date: "20.12 AL", solar: "7.2.2026", activity: "Lau lá, cắt lá và gói bánh", step: 3 },
        { day: "Thứ 7", date: "20.12 AL", solar: "7.2.2026", activity: "Gói → xếp nồi → nấu → ép bánh", step: 4 },
        { day: "Chủ nhật", date: "21.12 AL", solar: "8.2.2026", activity: "Nhận bánh và tổng kết", step: 5 },
    ];

    const meaningData = [
        { symbol: "Hình vuông", meaning: "Tượng trưng cho đất" },
        { symbol: "Lá dong xanh", meaning: "Tình yêu thương của cha mẹ" },
        { symbol: "Gạo nếp", meaning: "Sự no đủ, sung túc" },
        { symbol: "Đậu xanh", meaning: "Sự sinh sôi nảy nở" },
        { symbol: "Thịt mỡ", meaning: "Sự phú quý, giàu sang" },
    ];

    // Auto-play slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [galleryImages.length]);

    // Scroll animations
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

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <main className="banh-main">
            {/* Hero Section - Full width poster background */}
            <section id="hero" className="banh-hero">
                <div className="banh-hero-bg">
                    <Image
                        src="/images/chuong-trinh-goi-banh-trung/poster.jpg"
                        alt="Poster Chương Trình Gói Bánh Trưng Tết 2025"
                        fill
                        priority
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                    <div className="banh-hero-overlay"></div>
                </div>

                <div className="banh-hero-content">
                    <span className="banh-hero-badge">Tết Nguyên Đán 2025</span>
                    <h1 className="banh-hero-title">
                        Chương Trình<br />
                        <span>Gói Bánh Trưng</span>
                    </h1>
                    <p className="banh-hero-subtitle">
                        Cùng nhau gói vị tết - Gìn giữ truyền thống Việt Nam
                    </p>
                    <div className="banh-hero-actions">
                        <button
                            className="banh-btn banh-btn-primary"
                            onClick={() => scrollToSection("schedule")}
                        >
                            Xem lịch trình
                        </button>
                        <button
                            className="banh-btn banh-btn-outline"
                            onClick={() => scrollToSection("about")}
                        >
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>

                <button
                    className="banh-scroll-indicator"
                    onClick={() => scrollToSection("about")}
                    aria-label="Cuộn xuống"
                >
                    <span></span>
                </button>
            </section>

            {/* About Section */}
            <section id="about" className="banh-section">
                <div className="banh-container">
                    <div className="banh-section-header animate-on-scroll">
                        <span className="banh-label">Về chương trình</span>
                        <h2 className="banh-title">Giới Thiệu</h2>
                    </div>

                    <div className="banh-about-grid">
                        <div className="banh-about-content animate-on-scroll">
                            <p className="banh-lead">
                                <strong>Chương trình Gói Bánh Trưng</strong> là hoạt động truyền thống
                                được tổ chức hàng năm nhằm gìn giữ và phát huy nét đẹp văn hóa Tết Việt.
                            </p>
                            <p>
                                Đây là dịp để các thành viên cùng nhau quây quần, học hỏi và trải nghiệm
                                nghệ thuật gói bánh trưng - món ăn không thể thiếu trong mâm cỗ ngày Tết
                                của người Việt Nam.
                            </p>
                            <p>
                                Chương trình không chỉ mang lại những chiếc bánh trưng thơm ngon mà còn
                                là cơ hội để gắn kết tình cảm gia đình, đồng nghiệp và bạn bè.
                            </p>
                        </div>

                        <div className="banh-about-image animate-on-scroll">
                            <Image
                                src="/images/chuong-trinh-goi-banh-trung/1.jpg"
                                alt="Gói bánh trưng truyền thống"
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule Section - Timeline Style */}
            <section id="schedule" className="banh-section banh-section-alt">
                <div className="banh-container">
                    <div className="banh-section-header animate-on-scroll">
                        <span className="banh-label">Lịch trình</span>
                        <h2 className="banh-title">Thời Gian Thực Hiện</h2>
                    </div>

                    <div className="banh-timeline">
                        {scheduleData.map((item, index) => (
                            <div
                                key={index}
                                className="banh-timeline-item animate-on-scroll"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="banh-timeline-icon">{item.step}</div>
                                <div className="banh-timeline-content">
                                    <div className="banh-timeline-date">
                                        <strong>{item.day}</strong>
                                        <span>{item.date} ({item.solar})</span>
                                    </div>
                                    <p className="banh-timeline-activity">{item.activity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="banh-ingredients animate-on-scroll">
                        <h3>Nguyên liệu chính</h3>
                        <div className="banh-ingredients-list">
                            <span>Gạo nếp</span>
                            <span>Đậu xanh</span>
                            <span>Thịt ba chỉ</span>
                            <span>Lá dong</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meaning Section */}
            <section id="meaning" className="banh-section">
                <div className="banh-container">
                    <div className="banh-section-header animate-on-scroll">
                        <span className="banh-label">Văn hóa</span>
                        <h2 className="banh-title">Ý Nghĩa Bánh Trưng</h2>
                    </div>

                    <div className="banh-meaning-grid">
                        {meaningData.map((item, index) => (
                            <div
                                key={index}
                                className="banh-meaning-card animate-on-scroll"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="banh-meaning-number">{index + 1}</div>
                                <h4>{item.symbol}</h4>
                                <p>{item.meaning}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="banh-section banh-section-alt">
                <div className="banh-container">
                    <div className="banh-section-header animate-on-scroll">
                        <span className="banh-label">Khoảnh khắc</span>
                        <h2 className="banh-title">Hình Ảnh Tết 2025</h2>
                    </div>

                    <div className="banh-gallery animate-on-scroll">
                        <div className="banh-gallery-main">
                            <Image
                                src={galleryImages[currentSlide].src}
                                alt={galleryImages[currentSlide].alt}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 70vw"
                            />
                            <div className="banh-gallery-controls">
                                <button
                                    onClick={() => setCurrentSlide((prev) =>
                                        (prev - 1 + galleryImages.length) % galleryImages.length
                                    )}
                                    aria-label="Ảnh trước"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={() => setCurrentSlide((prev) =>
                                        (prev + 1) % galleryImages.length
                                    )}
                                    aria-label="Ảnh tiếp theo"
                                >
                                    ›
                                </button>
                            </div>
                            <div className="banh-gallery-dots">
                                {galleryImages.map((_, index) => (
                                    <button
                                        key={index}
                                        className={currentSlide === index ? "active" : ""}
                                        onClick={() => setCurrentSlide(index)}
                                        aria-label={`Xem ảnh ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="banh-gallery-thumbs">
                            {galleryImages.map((img, index) => (
                                <button
                                    key={index}
                                    className={`banh-thumb ${currentSlide === index ? "active" : ""}`}
                                    onClick={() => setCurrentSlide(index)}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="100px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="banh-cta">
                <div className="banh-cta-content">
                    <h2>Tân Đại Tây Dương</h2>
                    <p>Cùng nhau đón Tết - Gìn giữ truyền thống</p>
                    <Link href="/" className="banh-btn banh-btn-white">
                        ← Về trang chủ
                    </Link>
                </div>
            </section>
        </main>
    );
}
