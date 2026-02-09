"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import "./banh-chung.css";
import {
    ParticleBackground,
    MagneticButton,
    CircularProgress,
    FlipCard,
    ScrambleText,
    PageSkeleton
} from "./components";

// Skeleton Loading Component for Gallery
function ImageSkeleton() {
    return (
        <div className="banh-skeleton">
            <div className="banh-skeleton-shimmer" />
        </div>
    );
}

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

export default function BanhChungPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxSource, setLightboxSource] = useState<'2025' | '2026'>('2025');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState("hero");
    const [showSwipeHint, setShowSwipeHint] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [flowerStyles, setFlowerStyles] = useState<Array<{ left: string; delay: string; duration: string }>>([]);
    const [mounted, setMounted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiPieces, setConfettiPieces] = useState<Array<{ left: string; delay: string; duration: string; color: string; rotation: string }>>([]);
    const [showFlowers, setShowFlowers] = useState(true);
    const [showQuickSchedule, setShowQuickSchedule] = useState(false);
    const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoStarted, setIsVideoStarted] = useState(false);
    const [currentSlide2026, setCurrentSlide2026] = useState(0);
    const [isAutoPlaying2026, setIsAutoPlaying2026] = useState(true);
    const [gallery2026Loaded, setGallery2026Loaded] = useState<Record<number, boolean>>({});
    const parallaxBgRef = useRef<HTMLDivElement>(null);
    const thumbs2026Ref = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const hasConfettiTriggered = useRef(false);
    const hasShownSwipeHint = useRef(false);
    const minSwipeDistance = 50;

    // Auto-scroll 2026 thumbnails to keep active in view
    useEffect(() => {
        if (thumbs2026Ref.current) {
            const activeThumb = thumbs2026Ref.current.children[currentSlide2026] as HTMLElement;
            if (activeThumb) {
                activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentSlide2026]);
    // Lunar calendar info for TẾT 2026
    const lunarInfo = {
        year: "Bính Ngọ",
        zodiac: "",
        zodiacName: "Ngựa",
        lunarNewYear: "18.12 Âm lịch → 5.2.2026 Dương lịch"
    };

    // Calculate current schedule step based on today's date
    const getScheduleProgress = () => {
        const today = new Date();
        const scheduleDates = [
            new Date("2026-02-05"), // Step 1
            new Date("2026-02-06"), // Step 2
            new Date("2026-02-07"), // Step 3 & 4
            new Date("2026-02-07"), // Step 4
            new Date("2026-02-08"), // Step 5
        ];

        let completedSteps = 0;
        for (let i = 0; i < scheduleDates.length; i++) {
            if (today >= scheduleDates[i]) {
                completedSteps = i + 1;
            }
        }
        return { completedSteps, totalSteps: 5 };
    };

    const scheduleProgress = getScheduleProgress();

    const sectionNames: Record<string, string> = {
        hero: "Trang chính",
        about: "Giới thiệu",
        schedule: "Lịch trình",
        meaning: "Ý nghĩa",
        gallery2026: "TẾT 2026",
        gallery: "TẾT 2025",
        cta: "Liên hệ"
    };

    const galleryImages = [
        { src: "/images/chuong-trinh-goi-banh-chung/1.jpg", alt: "Hoạt động gói bánh chưng 1" },
        { src: "/images/chuong-trinh-goi-banh-chung/2.jpg", alt: "Hoạt động gói bánh chưng 2" },
        { src: "/images/chuong-trinh-goi-banh-chung/3.jpg", alt: "Hoạt động gói bánh chưng 3" },
        { src: "/images/chuong-trinh-goi-banh-chung/4.jpg", alt: "Hoạt động gói bánh chưng 4" },
        { src: "/images/chuong-trinh-goi-banh-chung/5.jpg", alt: "Hoạt động gói bánh chưng 5" },
        { src: "/images/chuong-trinh-goi-banh-chung/7.jpg", alt: "Hoạt động gói bánh chưng 7" },
    ];

    const scheduleData = [
        { day: "Thứ 5", date: "18.12 AL", solar: "5.2.2026", activity: "Hạn chót tập kết nguyên vật liệu", step: 1, highlight: true },
        { day: "Thứ 6", date: "19.12 AL", solar: "6.2.2026", activity: "Rửa lá, ngâm gạo, đỗ", step: 2, highlight: false },
        { day: "Thứ 7", date: "20.12 AL", solar: "7.2.2026", activity: "Lau lá, cắt lá và gói bánh", step: 3, highlight: false },
        { day: "Thứ 7", date: "20.12 AL", solar: "7.2.2026", activity: "Gói → xếp nồi → nấu → ép bánh", step: 4, highlight: true },
        { day: "Chủ nhật", date: "21.12 AL", solar: "8.2.2026", activity: "Nhận bánh và tổng kết", step: 5, highlight: false },
    ];

    const meaningData = [
        { symbol: "Hình vuông", meaning: "Tượng trưng cho đất" },
        { symbol: "Lá dong xanh", meaning: "Tình yêu thương của cha mẹ" },
        { symbol: "Gạo nếp", meaning: "Sự no đủ, sung túc" },
        { symbol: "Đậu xanh", meaning: "Sự sinh sôi nảy nở" },
        { symbol: "Thịt mỡ", meaning: "Sự phú quý, giàu sang" },
    ];

    const ingredientsData = [
        { name: "Gạo nếp", desc: "Dẻo thơm", detail: "Gạo nếp cái hoa vàng loại 1, hạt tròn đều, thơm dẻo. Ngâm qua đêm để gạo nở đều và chín mềm khi nấu." },
        { name: "Đậu xanh", desc: "Bùi béo", detail: "Đậu xanh lòng vàng, hạt to đều, không sâu mọt. Ngâm mềm rồi đãi vỏ, hấp chín và giã nhuyễn." },
        { name: "Thịt ba chỉ", desc: "Đậm đà", detail: "Thịt ba chỉ tươi ngon, có đủ nạc mỡ. Ướp tiêu, nước mắm và hành tím để thịt thấm gia vị." },
        { name: "Lá dong", desc: "Xanh tươi", detail: "Lá dong rừng xanh mướt, to bản, không rách. Rửa sạch, lau khô và cắt phần cuống để dễ gói." },
    ];

    // Gallery 2026 images - curated selection
    const gallery2026Images = [
        { src: "/images/chuong-trinh-goi-banh-chung/2026/rua la.jpg", alt: "Rửa lá dong chuẩn bị gói bánh", category: "chuẩn bị" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2615.jpg", alt: "Hoạt động gói bánh chưng TẾT 2026", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2619.jpg", alt: "Cùng nhau gói bánh chưng", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2620.jpg", alt: "Khoảnh khắc gói bánh chưng", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2621.jpg", alt: "Hoạt động gói bánh", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2622-2.jpg", alt: "Gói bánh chưng truyền thống", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2625.jpg", alt: "Thành quả bánh chưng", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2628.jpg", alt: "Hoạt động gói bánh TẾT", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2631-2.jpg", alt: "Khoảnh khắc đáng nhớ", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2634.jpg", alt: "Không khí TẾT ấm áp", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2635.jpg", alt: "Hoạt động cộng đồng", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2639.jpg", alt: "Gói bánh chưng đoàn kết", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2641-2.jpg", alt: "Niềm vui ngày TẾT", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2642.jpg", alt: "Kỷ niệm TẾT 2026", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7509848643185_5e92ff07a1001bf37df066f74294698b.jpg", alt: "Chương trình gói bánh", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7509848644423_51b132b7906e1e154fbb8b8a65a8f42c.jpg", alt: "Hoạt động TẾT", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7509848647708_40d593b035dcf4679b38fa7be6bbb493.jpg", alt: "Gói bánh chưng ngày TẾT", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7509848649856_a2332141318c709d28c49af63f5a0f48.jpg", alt: "Hoạt động cộng đồng TẾT", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149727046_99d13f69079236bf59be0e0185d8eaa5.jpg", alt: "Nấu bánh chưng", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149730381_cb922463cfc1e8f8f102296c0462af07.jpg", alt: "Gói bánh TẾT", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149735588_cb88a0c5ff8800f498bbc0355165e581.jpg", alt: "Thành phẩm bánh chưng", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149736883_c780196924a0d4c49f562a4cd00e2190.jpg", alt: "Hoạt động đoàn kết", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149740661_d0ed1c163e47be8a13784c956ee9aac8.jpg", alt: "Gói bánh cùng nhau", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149745412_79cfdea7fee29d896f17f7a9cd5709d3.jpg", alt: "Khoảnh khắc vui vẻ", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149747895_24cbe7539d486e6152f0ebfa800790ec.jpg", alt: "Niềm vui gói bánh", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149749127_5af65a9450fbcc6774a3434d9078e2c8.jpg", alt: "Thành phẩm đẹp mắt", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510149749834_63ea2e160829afbec9af5060a5f97238.jpg", alt: "Hoạt động TẾT Bính Ngọ", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510159107372_a6c2f2039511a839e83f0d021074d6a2.jpg", alt: "Chương trình gói bánh 2026", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510159194511_ca2ac9751cc565950b8e6a8b6bc385be.jpg", alt: "Hoạt động gói bánh chưng", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510159232424_060404497b4b23a13a776c6a475d8d91.jpg", alt: "Kỷ niệm đẹp TẾT 2026", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510159300617_cc03b57cba479980d4b6d25c0dc8cb81.jpg", alt: "Gói bánh chưng ngày TẾT", category: "gói bánh" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7510159328845_f7696e2286e9fd374da3a7811faf2951.jpg", alt: "TẾT ấm áp bên nhau", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7512723073934_5b203e7fc14f9a5b1487900c63416008.jpg", alt: "Thành phẩm bánh chưng đẹp", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7512723073935_b1a026482dd76aa5168359022cb23795.jpg", alt: "Bánh chưng xanh", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7512723073937_dce9a050b6d687da944d1b7f97232173.jpg", alt: "Thành quả gói bánh", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7512723074579_89a67cd9468322aa82f7356fdfb84260.jpg", alt: "Bánh chưng truyền thống", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/z7512723076507_10f72c4c9b5fd04d6d7edf8a543a573c.jpg", alt: "Niềm tự hào TẾT Việt", category: "thành quả" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2631.jpg", alt: "Khoảnh khắc đẹp bên nhau", category: "kỷ niệm" },
        { src: "/images/chuong-trinh-goi-banh-chung/2026/IMG_2641.jpg", alt: "Vui vẻ ngày TẾT", category: "kỷ niệm" },
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

    // Scroll progress + Parallax + Active Section Detection (optimized with RAF)
    useEffect(() => {
        // Cache section elements for performance
        const sectionElements = new Map<string, HTMLElement>();
        const sections = ["hero", "about", "schedule", "meaning", "gallery2026", "gallery", "cta"];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) sectionElements.set(id, el);
        });

        let rafId: number | null = null;
        let lastScrollY = 0;

        const handleScroll = () => {
            // Cancel previous animation frame if it exists
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const scrollTop = window.scrollY;

                // Only update if scroll changed significantly (optimization)
                if (Math.abs(scrollTop - lastScrollY) < 5) return;
                lastScrollY = scrollTop;

                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                setScrollProgress(progress);

                // Parallax effect for hero - direct DOM manipulation for smooth performance
                // Reduced parallax speed for senior-friendly UX
                if (parallaxBgRef.current) {
                    parallaxBgRef.current.style.transform = `translate3d(0, ${scrollTop * 0.25}px, 0)`;
                }

                // Show quick schedule bar when scrolling past hero
                setShowQuickSchedule(scrollTop > window.innerHeight * 0.5);

                // Detect active section using cached elements
                for (const [sectionId, element] of sectionElements) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
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
        // Tạo 10 bông hoa (giảm từ 15 để ít gây rối mắt cho người lớn tuổi)
        const styles = [...Array(10)].map(() => ({
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 10}s`,
            duration: `${8 + Math.random() * 6}s` // Slower animation
        }));
        setFlowerStyles(styles);

        // Auto-hide flowers after 15 seconds for less distraction
        const flowerTimer = setTimeout(() => {
            setShowFlowers(false);
        }, 15000);

        // Show swipe hint for first-time visitors (on mobile)
        // Wrap ALL localStorage access in a try-catch for SSR safety
        try {
            const isMobile = window.innerWidth <= 768;
            const hasSeenHint = localStorage.getItem("banh-swipe-hint-seen");
            if (isMobile && !hasSeenHint && !hasShownSwipeHint.current) {
                hasShownSwipeHint.current = true;
                setTimeout(() => {
                    setShowSwipeHint(true);
                    // Auto hide after 4 seconds
                    setTimeout(() => {
                        setShowSwipeHint(false);
                        try {
                            localStorage.setItem("banh-swipe-hint-seen", "true");
                        } catch {
                            // Silently fail if localStorage is blocked
                        }
                    }, 4000);
                }, 2000);
            }
        } catch {
            // Handle localStorage being unavailable (private browsing, etc.)
        }

        return () => {
            clearTimeout(flowerTimer);
        };
    }, []);


    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!lightboxOpen) return;

        const activeImages = lightboxSource === '2026' ? gallery2026Images : galleryImages;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
            if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev + 1) % activeImages.length);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [lightboxOpen, galleryImages.length, lightboxSource, gallery2026Images]);

    // Auto-play for gallery 2026 slider
    useEffect(() => {
        if (!isAutoPlaying2026) return;
        const interval = setInterval(() => {
            setCurrentSlide2026((prev) => (prev + 1) % gallery2026Images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying2026, gallery2026Images.length]);

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    const openLightbox = (index: number, source: '2025' | '2026' = '2025') => {
        setLightboxIndex(index);
        setLightboxSource(source);
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
            {/* Page Loading Skeleton */}
            {!mounted && <PageSkeleton />}

            {/* Particle Background - New UI Enhancement */}
            {mounted && <ParticleBackground />}

            {/* Falling Flowers Effect - Hoa Mai & Hoa Đào rơi - Portal to body for z-index */}
            {mounted && showFlowers && flowerStyles.length > 0 && createPortal(
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

            {/* Toggle Flowers Button - Hidden */}
            {/* Quick Schedule Bar */}


            <main className="banh-main">
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
                    {["hero", "about", "schedule", "meaning", "gallery2026", "gallery"].map((section, i) => (
                        <button
                            key={section}
                            onClick={() => scrollToSection(section)}
                            className="banh-nav-dot"
                            aria-label={`Đến phần ${section}`}
                            title={["Trang chính", "Giới thiệu", "Lịch trình", "Ý nghĩa", "TẾT 2026", "TẾT 2025"][i]}
                        />
                    ))}
                </nav>

                {/* Hero Section */}
                <section id="hero" className="banh-hero">
                    <div
                        ref={parallaxBgRef}
                        className="banh-hero-bg banh-parallax"
                    >
                        {/* Mobile: poster.jpg (vertical) */}
                        <Image
                            src="/images/chuong-trinh-goi-banh-chung/poster.jpg"
                            alt="Poster Chương Trình Gói Bánh Chưng TẾT 2026"
                            fill
                            priority
                            className="banh-hero-bg-mobile"
                            style={{ objectFit: "cover", objectPosition: "center top" }}
                        />
                        {/* Desktop: banner-ngang.jpg (horizontal) */}
                        <Image
                            src="/images/chuong-trinh-goi-banh-chung/banner-ngang.jpg"
                            alt="Banner Chương Trình Gói Bánh Chưng TẾT 2026"
                            fill
                            priority
                            className="banh-hero-bg-desktop"
                            style={{ objectFit: "cover", objectPosition: "center" }}
                        />
                        <div className="banh-hero-overlay" />
                    </div>

                    <div className="banh-hero-content">

                        <span className="banh-hero-badge">
                            TẾT Nguyên Đán 2026
                        </span>
                        <ScrambleText
                            text="Chương Trình"
                            className="banh-hero-title banh-gradient-text"
                            as="h1"
                        />
                        <ScrambleText
                            text="Gói Bánh Chưng"
                            className="banh-hero-title banh-gradient-text"
                            as="h1"
                            delay={300}
                        />
                        <p className="banh-hero-subtitle">
                            Cùng nhau gói vị TẾT - Gìn giữ truyền thống Việt Nam
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
                            <MagneticButton
                                className="banh-btn-primary"
                                onClick={() => scrollToSection("schedule")}
                            >
                                Xem lịch trình
                            </MagneticButton>
                            <MagneticButton
                                className="magnetic-btn-outline"
                                onClick={() => scrollToSection("about")}
                            >
                                Tìm hiểu thêm
                            </MagneticButton>
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
                                        src="/images/chuong-trinh-goi-banh-chung/Avatar.png"
                                        alt="Mascot Chương Trình Gói Bánh Chưng"
                                        width={200}
                                        height={200}
                                        style={{ objectFit: "contain" }}
                                    />
                                </div>
                                <p className="banh-lead">
                                    <strong>Chương trình Gói Bánh Chưng</strong> là hoạt động truyền thống
                                    được tổ chức hàng năm nhằm gìn giữ và phát huy nét đẹp văn hóa TẾT Việt.
                                </p>
                                <p>
                                    Đây là dịp để các thành viên cùng nhau quây quần, học hỏi và trải nghiệm
                                    nghệ thuật gói bánh chưng - món ăn không thể thiếu trong mâm cỗ ngày TẾT
                                    của người Việt Nam.
                                </p>
                                <p>
                                    Chương trình không chỉ mang lại những chiếc bánh chưng thơm ngon mà còn
                                    là cơ hội để gắn kết tình cảm gia đình, đồng nghiệp và bạn bè.
                                </p>
                            </div>

                            <div className="banh-about-image animate-on-scroll">
                                <Image
                                    src="/images/chuong-trinh-goi-banh-chung/1.jpg"
                                    alt="Gói bánh chưng truyền thống"
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
                            <h2 className="banh-title">Thờ̛i Gian Thực Hiện</h2>
                        </div>

                        {/* Enhanced Schedule Progress with Circular Progress */}
                        <div className="banh-schedule-progress animate-on-scroll">
                            <div className="banh-progress-header">
                                <span className="banh-progress-label">Tiến độ chương trình</span>
                                <CircularProgress
                                    progress={(scheduleProgress.completedSteps / scheduleProgress.totalSteps) * 100}
                                    size={80}
                                    strokeWidth={6}
                                />
                            </div>
                            <div className="banh-progress-track">
                                <div
                                    className="banh-progress-fill"
                                    style={{ width: `${(scheduleProgress.completedSteps / scheduleProgress.totalSteps) * 100}%` }}
                                />
                                {[...Array(scheduleProgress.totalSteps)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`banh-progress-dot ${i < scheduleProgress.completedSteps ? 'completed' : ''} ${i === scheduleProgress.completedSteps ? 'current' : ''}`}
                                        style={{ left: `${(i / (scheduleProgress.totalSteps - 1)) * 100}%` }}
                                    />
                                ))}
                            </div>
                            <div className="banh-progress-status">
                                {scheduleProgress.completedSteps === 0 ? (
                                    <span>Chưa bắt đầu - Còn {countdown.days} ngày</span>
                                ) : scheduleProgress.completedSteps === scheduleProgress.totalSteps ? (
                                    <span>Hoàn thành!</span>
                                ) : (
                                    <span>Đang thực hiện bước {scheduleProgress.completedSteps + 1}</span>
                                )}
                            </div>
                        </div>

                        <div className="banh-timeline">
                            {scheduleData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`banh-timeline-item animate-on-scroll ${item.highlight ? 'highlight' : ''}`}
                                    style={{ transitionDelay: `${index * 0.1}s` }}
                                >
                                    <div className="banh-timeline-icon">
                                        <span className="banh-timeline-step">{item.step}</span>
                                    </div>
                                    <div className="banh-timeline-content">
                                        {item.highlight && (
                                            <span className="banh-highlight-badge">⭐ Quan trọng</span>
                                        )}
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
                                    <FlipCard
                                        key={index}
                                        className="banh-ingredient-card-wrapper"
                                        flipDirection="horizontal"
                                        front={
                                            <>
                                                <span className="banh-ingredient-name">{item.name}</span>
                                                <span className="banh-ingredient-desc">{item.desc}</span>
                                                <span style={{ marginTop: "1rem", fontSize: "0.8rem", opacity: 0.7 }}>
                                                    Nhấn để xem chi tiết
                                                </span>
                                            </>
                                        }
                                        back={
                                            <>
                                                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                                                    {item.name}
                                                </span>
                                                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", textAlign: "center" }}>
                                                    {item.detail}
                                                </p>
                                            </>
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Meaning Section */}
                <section id="meaning" className="banh-section">
                    <div className="banh-container">
                        <div className="banh-section-header animate-on-scroll">
                            <h2 className="banh-title">Ý Nghĩa Bánh Chưng</h2>
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

                {/* ✨ Gallery 2026 - Image Slider */}
                <section id="gallery2026" className="banh-section">
                    <div className="banh-container">
                        <div className="banh-section-header animate-on-scroll">
                            <span className="banh-label">Mới nhất</span>
                            <h2 className="banh-title">Hình Ảnh TẾT 2026</h2>
                            <p className="banh-subtitle">
                                {gallery2026Images.length} khoảnh khắc đáng nhớ từ chương trình gói bánh chưng
                            </p>
                        </div>

                        <div className="banh-gallery animate-on-scroll">
                            <div
                                className="banh-gallery-main"
                                onClick={() => openLightbox(currentSlide2026, '2026')}
                                onMouseEnter={() => setIsAutoPlaying2026(false)}
                                onMouseLeave={() => setIsAutoPlaying2026(true)}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={(e) => {
                                    const diff = touchStartX.current - touchEndX.current;
                                    if (Math.abs(diff) > 50) {
                                        if (diff > 0) setCurrentSlide2026((prev) => (prev + 1) % gallery2026Images.length);
                                        else setCurrentSlide2026((prev) => (prev - 1 + gallery2026Images.length) % gallery2026Images.length);
                                    }
                                }}
                            >
                                {!gallery2026Loaded[currentSlide2026] && <ImageSkeleton />}
                                <Image
                                    src={gallery2026Images[currentSlide2026].src}
                                    alt={gallery2026Images[currentSlide2026].alt}
                                    fill
                                    style={{ objectFit: "cover", opacity: gallery2026Loaded[currentSlide2026] ? 1 : 0 }}
                                    sizes="(max-width: 768px) 100vw, 70vw"
                                    onLoad={() => setGallery2026Loaded(prev => ({ ...prev, [currentSlide2026]: true }))}
                                />
                                <div className="banh-gallery-overlay">
                                    <span className="banh-gallery-zoom">Xem lớn</span>
                                </div>
                                <div className="banh-gallery-controls">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentSlide2026((prev) =>
                                                (prev - 1 + gallery2026Images.length) % gallery2026Images.length
                                            );
                                        }}
                                        aria-label="Ảnh trước"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentSlide2026((prev) =>
                                                (prev + 1) % gallery2026Images.length
                                            );
                                        }}
                                        aria-label="Ảnh tiếp theo"
                                    >
                                        ›
                                    </button>
                                </div>
                                <div className="banh-gallery-counter">
                                    {currentSlide2026 + 1} / {gallery2026Images.length}
                                </div>
                                <div className="banh-gallery-dots">
                                    {gallery2026Images.map((_, index) => (
                                        <button
                                            key={index}
                                            className={currentSlide2026 === index ? "active" : ""}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentSlide2026(index);
                                            }}
                                            aria-label={`Xem ảnh ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="banh-gallery-thumbs" ref={thumbs2026Ref}>
                                {gallery2026Images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`banh-thumb ${currentSlide2026 === index ? "active" : ""}`}
                                        onClick={() => setCurrentSlide2026(index)}
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

                {/* Gallery Section - TẾT 2025 (Video + Hình ảnh) */}
                <section id="gallery" className="banh-section banh-section-alt">
                    <div className="banh-container">
                        <div className="banh-section-header animate-on-scroll">
                            <h2 className="banh-title">Kỷ Niệm TẾT 2025</h2>
                        </div>

                        {/* Video - thuộc TẾT 2025 */}
                        <div className="banh-video-wrapper animate-on-scroll" style={{ marginBottom: '3rem' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                                Video Gói Bánh Chưng
                            </h3>
                            <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)' }}>
                                Xem lại khoảnh khắc ấm áp của chương trình
                            </p>
                            <div id="youtube-container" className="banh-video-container">
                                {!isVideoStarted ? (
                                    <>
                                        <Image
                                            src="https://img.youtube.com/vi/GSxf1XNQ-qE/maxresdefault.jpg"
                                            alt="Video Gói Bánh Chưng TẾT 2025"
                                            fill
                                            className="banh-video-thumbnail"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <button
                                            className="banh-video-play-btn"
                                            onClick={() => {
                                                setIsVideoStarted(true);
                                                setIsVideoPlaying(true);
                                            }}
                                            aria-label="Phát video"
                                        >
                                            <svg viewBox="0 0 68 48" width="68" height="48">
                                                <path className="banh-play-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000" />
                                                <path d="M 45,24 27,14 27,34" fill="#fff" />
                                            </svg>
                                            <span className="banh-play-text">Nhấn để xem video</span>
                                        </button>
                                    </>
                                ) : (
                                    <iframe
                                        className="banh-video"
                                        src="https://www.youtube.com/embed/GSxf1XNQ-qE?autoplay=1&rel=0&modestbranding=1"
                                        title="Video Gói Bánh Chưng TẾT 2025"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </div>
                        </div>

                        {/* Hình ảnh TẾT 2025 */}
                        <div className="banh-section-header animate-on-scroll" style={{ marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>Hình Ảnh</h3>
                        </div>

                        <div className="banh-gallery animate-on-scroll">
                            {/* Swipe Hint for first-time mobile users */}
                            {showSwipeHint && (
                                <div className="banh-swipe-hint">
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
                                {/* Skeleton Loading */}
                                {!imageLoaded[currentSlide] && <ImageSkeleton />}
                                <Image
                                    src={galleryImages[currentSlide].src}
                                    alt={galleryImages[currentSlide].alt}
                                    fill
                                    style={{ objectFit: "cover", opacity: imageLoaded[currentSlide] ? 1 : 0 }}
                                    sizes="(max-width: 768px) 100vw, 70vw"
                                    onLoad={() => setImageLoaded(prev => ({ ...prev, [currentSlide]: true }))}
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
                        <p>Cùng nhau đón TẾT - Gìn giữ truyền thống</p>
                        <MagneticButton
                            className="banh-btn-white"
                            onClick={() => window.location.href = "/"}
                        >
                            Về trang chủ
                        </MagneticButton>
                    </div>
                </section>

            </main >

            {/* Lightbox - Portal to document.body to fix position issues */}
            {
                mounted && lightboxOpen && (() => {
                    const activeLightboxImages = lightboxSource === '2026' ? gallery2026Images : galleryImages;
                    const safeIndex = lightboxIndex % activeLightboxImages.length;
                    return createPortal(
                        <div className="banh-lightbox" onClick={() => setLightboxOpen(false)}>
                            <button className="banh-lightbox-close" aria-label="Đóng">×</button>
                            <button
                                className="banh-lightbox-nav banh-lightbox-prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxIndex((prev) => (prev - 1 + activeLightboxImages.length) % activeLightboxImages.length);
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
                                    src={activeLightboxImages[safeIndex].src}
                                    alt={activeLightboxImages[safeIndex].alt}
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
                                    setLightboxIndex((prev) => (prev + 1) % activeLightboxImages.length);
                                }}
                                aria-label="Ảnh tiếp theo"
                            >
                                ›
                            </button>
                            <div className="banh-lightbox-counter">
                                {safeIndex + 1} / {activeLightboxImages.length}
                            </div>
                        </div>,
                        document.body
                    );
                })()
            }

            {/* Confetti Celebration Effect */}
            {
                mounted && showConfetti && createPortal(
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
                )
            }
        </>
    );
}
