"use client";

import { useEffect, useRef, useCallback } from "react";

export type HolidayParticleType =
    | 'tet-nguyen-dan'     // Hoa mai + Pháo hoa
    | 'tet-duong-lich'     // Confetti + Countdown sparkles
    | 'giang-sinh'         // Tuyết rơi + Ánh sao
    | 'valentine'          // Trái tim bay
    | 'tet-trung-thu'      // Đèn lồng + Moonlight
    | 'quoc-khanh'         // Pháo hoa + Stars
    | 'giai-phong-mien-nam'
    | 'quoc-te-lao-dong'
    | 'gio-to-hung-vuong';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    color: string;
    type: string;
    life: number;
    maxLife: number;
}

interface HolidayParticlesProps {
    holidayType: HolidayParticleType;
    intensity?: 'low' | 'medium' | 'high';
    className?: string;
}

// Color palettes for each holiday
const HOLIDAY_COLORS: Record<string, string[]> = {
    'tet-nguyen-dan': ['#FFD700', '#FF4500', '#DC143C', '#FF6347', '#FFA500'],
    'tet-duong-lich': ['#FFD700', '#FF69B4', '#00CED1', '#7B68EE', '#32CD32', '#FF4500'],
    'giang-sinh': ['#FFFFFF', '#FF0000', '#00FF00', '#FFD700', '#C0C0C0'],
    'valentine': ['#FF69B4', '#FF1493', '#DC143C', '#FFB6C1', '#FF6B6B'],
    'tet-trung-thu': ['#FFD700', '#FFA500', '#FF8C00', '#FFE4B5', '#FFEFD5'],
    'quoc-khanh': ['#FFD700', '#DC143C', '#FF0000', '#FFFF00'],
    'giai-phong-mien-nam': ['#FFD700', '#DC143C', '#FF0000', '#FFFF00'],
    'quoc-te-lao-dong': ['#FFD700', '#FF4500', '#DC143C', '#32CD32'],
    'gio-to-hung-vuong': ['#FFD700', '#DC143C', '#8B4513', '#DEB887'],
};

export default function HolidayParticles({
    holidayType,
    intensity = 'medium',
    className = '',
}: HolidayParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const prefersReducedMotion = useRef(false);

    // Check for reduced motion preference
    useEffect(() => {
        prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    const intensityMultiplier = intensity === 'low' ? 0.3 : intensity === 'high' ? 1.5 : 0.7;

    // Get colors for the holiday
    const colors = HOLIDAY_COLORS[holidayType] || HOLIDAY_COLORS['tet-nguyen-dan'];

    // Create particle based on holiday type
    const createParticle = useCallback((canvas: HTMLCanvasElement, forceType?: string): Particle => {
        const type = forceType || getParticleType(holidayType);
        const color = colors[Math.floor(Math.random() * colors.length)];

        const baseParticle: Particle = {
            x: Math.random() * canvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.5 + 0.5,
            size: (Math.random() * 10 + 4) * intensityMultiplier, // Smaller particles
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05, // Slower rotation
            opacity: Math.random() * 0.4 + 0.3, // More transparent
            color,
            type,
            life: 0,
            maxLife: Math.random() * 200 + 100,
        };

        // Customize based on type
        switch (type) {
            case 'sakura': // Hoa mai/đào
                baseParticle.size = Math.random() * 12 + 8;
                baseParticle.vy = Math.random() * 1.5 + 0.5;
                baseParticle.vx = Math.sin(Date.now() / 1000) * 0.5 + (Math.random() - 0.5);
                break;
            case 'firework':
                baseParticle.x = Math.random() * canvas.width;
                baseParticle.y = canvas.height;
                baseParticle.vy = -(Math.random() * 8 + 4);
                baseParticle.vx = (Math.random() - 0.5) * 2;
                baseParticle.maxLife = 60;
                break;
            case 'confetti':
                baseParticle.size = Math.random() * 10 + 5;
                baseParticle.rotationSpeed = (Math.random() - 0.5) * 0.3;
                break;
            case 'snow':
                baseParticle.size = Math.random() * 6 + 2;
                baseParticle.vy = Math.random() * 1 + 0.5;
                baseParticle.vx = Math.sin(Date.now() / 2000 + baseParticle.x) * 0.5;
                break;
            case 'star':
                baseParticle.x = Math.random() * canvas.width;
                baseParticle.y = Math.random() * canvas.height;
                baseParticle.vx = 0;
                baseParticle.vy = 0;
                baseParticle.size = Math.random() * 4 + 2;
                baseParticle.opacity = 0;
                baseParticle.maxLife = Math.random() * 100 + 50;
                break;
            case 'heart':
                baseParticle.y = canvas.height + 20;
                baseParticle.vy = -(Math.random() * 2 + 1);
                baseParticle.size = Math.random() * 15 + 10;
                break;
            case 'lantern':
                baseParticle.y = canvas.height + 50;
                baseParticle.vy = -(Math.random() * 0.5 + 0.3);
                baseParticle.vx = Math.sin(Date.now() / 3000) * 0.3;
                baseParticle.size = Math.random() * 20 + 15;
                break;
            case 'sparkle':
                baseParticle.x = Math.random() * canvas.width;
                baseParticle.y = Math.random() * canvas.height;
                baseParticle.vx = 0;
                baseParticle.vy = 0;
                baseParticle.size = Math.random() * 8 + 4;
                baseParticle.maxLife = 40;
                break;
        }

        return baseParticle;
    }, [holidayType, colors]);

    // Determine particle types for each holiday
    function getParticleType(holiday: HolidayParticleType): string {
        const types: Record<string, string[]> = {
            'tet-nguyen-dan': ['sakura', 'sakura', 'firework', 'sparkle'],
            'tet-duong-lich': ['confetti', 'confetti', 'sparkle', 'firework'],
            'giang-sinh': ['snow', 'snow', 'snow', 'star'],
            'valentine': ['heart', 'heart', 'sparkle'],
            'tet-trung-thu': ['lantern', 'star', 'sparkle'],
            'quoc-khanh': ['firework', 'firework', 'star', 'sparkle'],
            'giai-phong-mien-nam': ['firework', 'star', 'sparkle'],
            'quoc-te-lao-dong': ['confetti', 'sparkle', 'star'],
            'gio-to-hung-vuong': ['sakura', 'sparkle', 'star'],
        };
        const options = types[holiday] || types['tet-nguyen-dan'];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Draw particle
    const drawParticle = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        switch (p.type) {
            case 'sakura':
                drawSakura(ctx, p);
                break;
            case 'snow':
                drawSnowflake(ctx, p);
                break;
            case 'heart':
                drawHeart(ctx, p);
                break;
            case 'confetti':
                drawConfetti(ctx, p);
                break;
            case 'star':
                drawStar(ctx, p);
                break;
            case 'lantern':
                drawLantern(ctx, p);
                break;
            case 'firework':
                drawFirework(ctx, p);
                break;
            case 'sparkle':
                drawSparkle(ctx, p);
                break;
            default:
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
        }

        ctx.restore();
    }, []);

    // Drawing functions for each particle type
    function drawSakura(ctx: CanvasRenderingContext2D, p: Particle) {
        const petalCount = 5;
        ctx.fillStyle = p.color;
        for (let i = 0; i < petalCount; i++) {
            ctx.beginPath();
            ctx.ellipse(0, -p.size / 3, p.size / 4, p.size / 2, (i * Math.PI * 2) / petalCount, 0, Math.PI * 2);
            ctx.fill();
        }
        // Center
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }

    function drawSnowflake(ctx: CanvasRenderingContext2D, p: Particle) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI) / 3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -p.size);
            ctx.moveTo(0, -p.size * 0.6);
            ctx.lineTo(-p.size * 0.3, -p.size * 0.8);
            ctx.moveTo(0, -p.size * 0.6);
            ctx.lineTo(p.size * 0.3, -p.size * 0.8);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawHeart(ctx: CanvasRenderingContext2D, p: Particle) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const size = p.size / 2;
        ctx.moveTo(0, size / 4);
        ctx.bezierCurveTo(-size, -size / 2, -size, size / 2, 0, size);
        ctx.bezierCurveTo(size, size / 2, size, -size / 2, 0, size / 4);
        ctx.fill();
    }

    function drawConfetti(ctx: CanvasRenderingContext2D, p: Particle) {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }

    function drawStar(ctx: CanvasRenderingContext2D, p: Particle) {
        const spikes = 5;
        const outerRadius = p.size;
        const innerRadius = p.size / 2;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            if (i === 0) {
                ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            } else {
                ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
        }
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();

        // Glow effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
    }

    function drawLantern(ctx: CanvasRenderingContext2D, p: Particle) {
        // Lantern body
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size / 2, p.size / 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Top
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-p.size / 4, -p.size / 1.3, p.size / 2, p.size / 6);

        // Lines
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.5)';
        ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(i * (p.size / 6), -p.size / 1.5);
            ctx.quadraticCurveTo(i * (p.size / 4), 0, i * (p.size / 6), p.size / 1.5);
            ctx.stroke();
        }

        // Glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        gradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 150, 50, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawFirework(ctx: CanvasRenderingContext2D, p: Particle) {
        if (p.life > p.maxLife * 0.7) {
            // Explosion phase
            const progress = (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3);
            const sparkCount = 12;
            for (let i = 0; i < sparkCount; i++) {
                const angle = (i * Math.PI * 2) / sparkCount;
                const dist = progress * p.size * 3;
                ctx.beginPath();
                ctx.arc(
                    Math.cos(angle) * dist,
                    Math.sin(angle) * dist,
                    3 * (1 - progress),
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = p.color;
                ctx.fill();
            }
        } else {
            // Rising phase - trail
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();

            // Trail
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 20);
            ctx.stroke();
        }
    }

    function drawSparkle(ctx: CanvasRenderingContext2D, p: Particle) {
        const progress = p.life / p.maxLife;
        const size = p.size * Math.sin(progress * Math.PI);

        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;

        // Cross sparkle
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.stroke();

        // Diagonal
        const diag = size * 0.7;
        ctx.beginPath();
        ctx.moveTo(-diag, -diag);
        ctx.lineTo(diag, diag);
        ctx.moveTo(diag, -diag);
        ctx.lineTo(-diag, diag);
        ctx.stroke();

        // Center glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Main animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle spawn rate based on holiday (higher = slower/fewer)
        const spawnRates: Record<string, number> = {
            'tet-nguyen-dan': 150,    // Was 80
            'tet-duong-lich': 120,    // Was 60
            'giang-sinh': 100,        // Was 50
            'valentine': 180,         // Was 100
            'tet-trung-thu': 250,     // Was 150
            'quoc-khanh': 180,        // Was 100
            'giai-phong-mien-nam': 180,
            'quoc-te-lao-dong': 150,
            'gio-to-hung-vuong': 180,
        };
        const baseSpawnRate = spawnRates[holidayType] || 150;
        const spawnRate = baseSpawnRate / intensityMultiplier;

        const animate = (time: number) => {
            // Skip animation if user prefers reduced motion
            if (prefersReducedMotion.current) {
                return;
            }

            const deltaTime = time - lastTimeRef.current;
            lastTimeRef.current = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn new particles (less frequently)
            if (Math.random() < deltaTime / spawnRate) {
                particlesRef.current.push(createParticle(canvas));
            }

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter((p) => {
                p.life++;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Type-specific updates
                if (p.type === 'sakura' || p.type === 'confetti') {
                    p.vx = Math.sin(time / 1000 + p.y / 50) * 0.5;
                }
                if (p.type === 'star' || p.type === 'sparkle') {
                    p.opacity = Math.sin((p.life / p.maxLife) * Math.PI);
                }
                if (p.type === 'firework' && p.life > p.maxLife * 0.7) {
                    p.vy = 0;
                    p.vx = 0;
                }

                // Check if particle is still alive
                const isAlive =
                    p.y < canvas.height + 50 &&
                    p.y > -50 &&
                    p.x > -50 &&
                    p.x < canvas.width + 50 &&
                    p.life < p.maxLife &&
                    p.opacity > 0;

                if (isAlive) {
                    drawParticle(ctx, p);
                }

                return isAlive;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [holidayType, intensityMultiplier, createParticle, drawParticle]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
