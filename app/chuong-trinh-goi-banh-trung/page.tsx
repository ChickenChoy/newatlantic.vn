"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import "./banh-trung.css";

// Flip Unit Component - Simple slide animation
interface FlipUnitProps {
    current: number;
    label: string;
}

function FlipUnit({ current, label }: FlipUnitProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const prevValueRef = useRef(current);

    useEffect(() => {
        if (current !== prevValueRef.current) {
            setIsAnimating(true);
            prevValueRef.current = current;
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [current]);

    const displayValue = String(current).padStart(2, '0');

    return (
        <div className="banh-flip-unit">
            <div className={`banh-flip-card ${isAnimating ? 'animating' : ''}`}>
                <span className="banh-flip-value">{displayValue}</span>
            </div>
            <span className="banh-flip-label">{label}</span>
        </div>
    );
}

export default function BanhTrungPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [parallaxOffset, setParallaxOffset] = useState(0);
    const [activeSection, setActiveSection] = useState("hero");
    const [showSwipeHint, setShowSwipeHint] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [pullProgress, setPullProgress] = useState(0);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [flowerStyles, setFlowerStyles] = useState<Array<{ left: string; delay: string; duration: string }>>([]);
    const [mounted, setMounted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiPieces, setConfettiPieces] = useState<Array<{ left: string; delay: string; duration: string; color: string; rotation: string }>>([]);
    const heroRef = useRef<HTMLElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const hasConfettiTriggered = useRef(false);
    const hasShownSwipeHint = useRef(false);
    const minSwipeDistance = 50;

    const sectionNames: Record<string, string> = {
        hero: "Trang chính",
        about: "Giới thiệu",
        schedule: "Lịch trình",
        meaning: "Ý nghĩa",
        gallery: "Hình ảnh",
        cta: "Liên hệ"
    };

    const galleryImages = [
        { src: "/images/chuong-trinh-goi-banh-trung/1.jpg", alt: "Hoạt động gói bánh trưng 1" },
        { src: "/images/chuong-trinh-goi-banh-trung/2.jpg", alt: "Hoạt động gói bánh trưng 2" },
        { src: "/images/chuong-trinh-goi-banh-trung/3.jpg", alt: "Hoạt động gói bánh trưng 3" },
        { src: "/images/chuong-trinh-goi-banh-trung/4.jpg", alt: "Hoạt động gói bánh trưng 4" },
        { src: "/images/chuong-trinh-goi-banh-trung/5.jpg", alt: "Hoạt động gói bánh trưng 5" },
        { src: "/images/chuong-trinh-goi-banh-trung/7.jpg", alt: "Hoạt động gói bánh trưng 7" },
    ];

    const scheduleData = [
        { day: "Thứ 5", date: "18.12 AL", solar: "5.2.2026", activity: "Hạn chót tập kết nguyên vật liệu", step: 1 },
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

    const ingredientsData = [
        { name: "Gạo nếp", desc: "Dẻo thơm" },
        { name: "Đậu xanh", desc: "Bùi béo" },
        { name: "Thịt ba chỉ", desc: "Đậm đà" },
        { name: "Lá dong", desc: "Xanh tươi" },
    ];

    // Countdown to event (Feb 5, 2026)
    useEffect(() => {
        const targetDate = new Date("2026-02-05T00:00:00");

        const updateCountdown = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff > 0) {
                setCountdown({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            } else {
                // Countdown reached 0
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });

                // Trigger confetti only once
                if (!hasConfettiTriggered.current) {
                    hasConfettiTriggered.current = true;

                    const colors = ['#c41e3a', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6ab04c'];
                    const pieces = [...Array(100)].map(() => ({
                        left: `${Math.random() * 100}%`,
                        delay: `${Math.random() * 0.5}s`,
                        duration: `${2 + Math.random() * 2}s`,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        rotation: `${Math.random() * 360}deg`
                    }));
                    setConfettiPieces(pieces);
                    setShowConfetti(true);

                    // Hide confetti after animation
                    setTimeout(() => setShowConfetti(false), 5000);
                }
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    // Auto-play slider
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [galleryImages.length, isAutoPlaying]);

    // Scroll progress + Parallax + Active Section Detection
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(progress);

            // Parallax effect for hero - move slower than scroll
            setParallaxOffset(scrollTop * 0.5);

            // Detect active section
            const sections = ["hero", "about", "schedule", "meaning", "gallery", "cta"];
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll animations with stagger
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        document.querySelectorAll(".animate-on-scroll").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Generate flower styles on client side only - Hoa Mai & Hoa Đào
    useEffect(() => {
        setMounted(true);
        // Tạo 30 bông hoa với các biến thể khác nhau
        const styles = [...Array(30)].map(() => ({
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 10}s`,
            duration: `${6 + Math.random() * 8}s`
        }));
        setFlowerStyles(styles);

        // Show swipe hint for first-time visitors (on mobile)
        const isMobile = window.innerWidth <= 768;
        const hasSeenHint = localStorage.getItem("banh-swipe-hint-seen");
        if (isMobile && !hasSeenHint && !hasShownSwipeHint.current) {
            hasShownSwipeHint.current = true;
            setTimeout(() => {
                setShowSwipeHint(true);
                // Auto hide after 4 seconds
                setTimeout(() => {
                    setShowSwipeHint(false);
                    localStorage.setItem("banh-swipe-hint-seen", "true");
                }, 4000);
            }, 2000);
        }
    }, []);

    // Pull to refresh effect (mobile only)
    useEffect(() => {
        let startY = 0;
        const threshold = 100;

        const handleTouchStartPull = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                touchStartY.current = startY;
            }
        };

        const handleTouchMovePull = (e: TouchEvent) => {
            if (window.scrollY === 0 && startY > 0) {
                const currentY = e.touches[0].clientY;
                const diff = currentY - startY;
                if (diff > 0 && diff < threshold * 1.5) {
                    setIsPulling(true);
                    setPullProgress(Math.min(diff / threshold, 1));
                }
            }
        };

        const handleTouchEndPull = () => {
            if (isPulling && pullProgress >= 1) {
                // Trigger refresh animation
                window.location.reload();
            }
            setIsPulling(false);
            setPullProgress(0);
            startY = 0;
        };

        window.addEventListener("touchstart", handleTouchStartPull, { passive: true });
        window.addEventListener("touchmove", handleTouchMovePull, { passive: true });
        window.addEventListener("touchend", handleTouchEndPull, { passive: true });

        return () => {
            window.removeEventListener("touchstart", handleTouchStartPull);
            window.removeEventListener("touchmove", handleTouchMovePull);
            window.removeEventListener("touchend", handleTouchEndPull);
        };
    }, [isPulling, pullProgress]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
            if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [lightboxOpen, galleryImages.length]);

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // Swipe handlers for gallery
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const distance = touchStartX.current - touchEndX.current;
        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                // Swiped left - next slide
                setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
            } else {
                // Swiped right - prev slide
                setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
            }
        }
    };

    // Swipe handlers for lightbox
    const handleLightboxTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleLightboxTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleLightboxTouchEnd = () => {
        const distance = touchStartX.current - touchEndX.current;
        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
            } else {
                setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
            }
        }
    };

    return (
        <>
            {/* Falling Flowers Effect - Hoa Mai & Hoa Đào rơi - Portal to body for z-index */}
            {mounted && flowerStyles.length > 0 && createPortal(
                <div className="banh-flowers" aria-hidden="true">
                    {flowerStyles.map((style, i) => (
                        <span
                            key={i}
                            className={`banh-flower banh-flower-${i % 5}`}
                            style={{
                                left: style.left,
                                animationDelay: style.delay,
                                animationDuration: style.duration
                            }}
                        />
                    ))}
                </div>,
                document.body
            )}

            <main className="banh-main">
                {/* Pull to Refresh Indicator */}
                {isPulling && (
                    <div className="banh-pull-refresh" style={{ transform: `translateY(${pullProgress * 80}px)` }}>
                        <div className="banh-pull-icon" style={{ transform: `rotate(${pullProgress * 360}deg)` }}>
                            <span className="banh-lantern">🏮</span>
                        </div>
                        <span className="banh-pull-text">
                            {pullProgress >= 1 ? "Thả để làm mới!" : "Kéo xuống để làm mới"}
                        </span>
                    </div>
                )}

                {/* Sticky Section Indicator */}
                {activeSection !== "hero" && (
                    <div className="banh-section-indicator">
                        <span className="banh-section-indicator-dot" />
                        <span className="banh-section-indicator-text">{sectionNames[activeSection]}</span>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="banh-progress-bar" style={{ width: `${scrollProgress}%` }} />

            {/* Floating Nav Dots */}
            <nav className="banh-nav-dots">
                {["hero", "about", "schedule", "meaning", "gallery"].map((section, i) => (
                    <button
                        key={section}
                        onClick={() => scrollToSection(section)}
                        className="banh-nav-dot"
                        aria-label={`Đến phần ${section}`}
                        title={["Trang chính", "Giới thiệu", "Lịch trình", "Ý nghĩa", "Hình ảnh"][i]}
                    />
                ))}
            </nav>

            {/* Hero Section */}
            <section id="hero" className="banh-hero" ref={heroRef}>
                <div
                    className="banh-hero-bg banh-parallax"
                    style={{ transform: `translateY(${parallaxOffset}px)` }}
                >
                    {/* Mobile: poster.jpg (vertical) */}
                    <Image
                        src="/images/chuong-trinh-goi-banh-trung/poster.jpg"
                        alt="Poster Chương Trình Gói Bánh Trưng Tết 2026"
                        fill
                        priority
                        className="banh-hero-bg-mobile"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                    {/* Desktop: banner-ngang.jpg (horizontal) */}
                    <Image
                        src="/images/chuong-trinh-goi-banh-trung/banner-ngang.jpg"
                        alt="Banner Chương Trình Gói Bánh Trưng Tết 2026"
                        fill
                        priority
                        className="banh-hero-bg-desktop"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                    <div className="banh-hero-overlay" />
                </div>

                <div className="banh-hero-content">
                    <span className="banh-hero-badge">
                        Tết Nguyên Đán 2026
                    </span>
                    <h1 className="banh-hero-title banh-gradient-text">
                        Chương Trình<br />
                        <span>Gói Bánh Trưng</span>
                    </h1>
                    <p className="banh-hero-subtitle">
                        Cùng nhau gói vị tết - Gìn giữ truyền thống Việt Nam
                    </p>

                    {/* Flip Countdown */}
                    <div className="banh-flip-countdown">
                        <FlipUnit current={countdown.days} label="Ngày" />
                        <div className="banh-flip-separator">:</div>
                        <FlipUnit current={countdown.hours} label="Giờ" />
                        <div className="banh-flip-separator">:</div>
                        <FlipUnit current={countdown.minutes} label="Phút" />
                        <div className="banh-flip-separator">:</div>
                        <FlipUnit current={countdown.seconds} label="Giây" />
                    </div>

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
                    <span />
                </button>
            </section>

            {/* About Section */}
            <section id="about" className="banh-section">
                <div className="banh-container">
                    <div className="banh-section-header animate-on-scroll">
                        <h2 className="banh-title">Giới Thiệu</h2>
                    </div>

                    <div className="banh-about-grid">
                        <div className="banh-about-content animate-on-scroll">
                            <div className="banh-about-avatar">
                                <Image
                                    src="/images/chuong-trinh-goi-banh-trung/Avatar.png"
                                    alt="Mascot Chương Trình Gói Bánh Trưng"
                                    width={200}
                                    height={200}
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
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

            {/* Schedule Section */}
            <section id="schedule" className="banh-section banh-section-alt">
                <div className="banh-container">
                    <div className="banh-section-header animate-on-scroll">
                        <h2 className="banh-title">Thời Gian Thực Hiện</h2>
                    </div>

                    <div className="banh-timeline">
                        {scheduleData.map((item, index) => (
                            <div
                                key={index}
                                className="banh-timeline-item animate-on-scroll"
                                style={{ transitionDelay: `${index * 0.1}s` }}
                            >
                                <div className="banh-timeline-icon">
                                    <span className="banh-timeline-step">{item.step}</span>
                                </div>
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
                        <div className="banh-ingredients-grid">
                            {ingredientsData.map((item, index) => (
                                <div key={index} className="banh-ingredient-card">
                                    <span className="banh-ingredient-name">{item.name}</span>
                                    <span className="banh-ingredient-desc">{item.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Meaning Section */}
            <section id="meaning" className="banh-section">
                <div className="banh-container">
                    <div className="banh-section-header animate-on-scroll">
                        <h2 className="banh-title">Ý Nghĩa Bánh Trưng</h2>
                    </div>

                    <div className="banh-meaning-grid">
                        {meaningData.map((item, index) => (
                            <div
                                key={index}
                                className="banh-meaning-card animate-on-scroll"
                                style={{ transitionDelay: `${index * 0.1}s` }}
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
                        <h2 className="banh-title">Hình Ảnh Tết 2025</h2>
                    </div>

                    <div className="banh-gallery animate-on-scroll">
                        {/* Swipe Hint for first-time mobile users */}
                        {showSwipeHint && (
                            <div className="banh-swipe-hint">
                                <div className="banh-swipe-hand">👆</div>
                                <span>Vuốt để xem ảnh</span>
                            </div>
                        )}
                        <div
                            className="banh-gallery-main"
                            onClick={() => openLightbox(currentSlide)}
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Image
                                src={galleryImages[currentSlide].src}
                                alt={galleryImages[currentSlide].alt}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 70vw"
                            />
                            <div className="banh-gallery-overlay">
                                <span className="banh-gallery-zoom">Xem lớn</span>
                            </div>
                            <div className="banh-gallery-controls">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentSlide((prev) =>
                                            (prev - 1 + galleryImages.length) % galleryImages.length
                                        );
                                    }}
                                    aria-label="Ảnh trước"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentSlide((prev) =>
                                            (prev + 1) % galleryImages.length
                                        );
                                    }}
                                    aria-label="Ảnh tiếp theo"
                                >
                                    ›
                                </button>
                            </div>
                            <div className="banh-gallery-counter">
                                {currentSlide + 1} / {galleryImages.length}
                            </div>
                            <div className="banh-gallery-dots">
                                {galleryImages.map((_, index) => (
                                    <button
                                        key={index}
                                        className={currentSlide === index ? "active" : ""}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentSlide(index);
                                        }}
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
                        Về trang chủ
                    </Link>
                </div>
            </section>

        </main>

            {/* Lightbox - Portal to document.body to fix position issues */}
            {mounted && lightboxOpen && createPortal(
                <div className="banh-lightbox" onClick={() => setLightboxOpen(false)}>
                    <button className="banh-lightbox-close" aria-label="Đóng">×</button>
                    <button
                        className="banh-lightbox-nav banh-lightbox-prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                        }}
                        aria-label="Ảnh trước"
                    >
                        ‹
                    </button>
                    <div
                        className="banh-lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleLightboxTouchStart}
                        onTouchMove={handleLightboxTouchMove}
                        onTouchEnd={handleLightboxTouchEnd}
                    >
                        <Image
                            src={galleryImages[lightboxIndex].src}
                            alt={galleryImages[lightboxIndex].alt}
                            fill
                            style={{ objectFit: "contain" }}
                            sizes="100vw"
                            priority
                        />
                    </div>
                    <button
                        className="banh-lightbox-nav banh-lightbox-next"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
                        }}
                        aria-label="Ảnh tiếp theo"
                    >
                        ›
                    </button>
                    <div className="banh-lightbox-counter">
                        {lightboxIndex + 1} / {galleryImages.length}
                    </div>
                </div>,
                document.body
            )}

            {/* Confetti Celebration Effect */}
            {mounted && showConfetti && createPortal(
                <div className="banh-confetti" aria-hidden="true">
                    {confettiPieces.map((piece, i) => (
                        <span
                            key={i}
                            className="banh-confetti-piece"
                            style={{
                                left: piece.left,
                                animationDelay: piece.delay,
                                animationDuration: piece.duration,
                                backgroundColor: piece.color,
                                transform: `rotate(${piece.rotation})`
                            }}
                        />
                    ))}
                </div>,
                document.body
            )}
        </>
    );
}
