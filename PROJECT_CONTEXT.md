# NEW ATLANTIC (Tân Đại Tây Dương) - Project Context Report

**Report Generated:** January 25, 2026
**Project Location:** `c:\Users\ADMIN\Desktop\code-NAIT\newatlantic.vn`

---

## Executive Summary

NEW ATLANTIC (Vietnamese: Tân Đại Tây Dương) is a Vietnamese industrial equipment distribution company operating since 2003. This is a Next.js-based corporate website showcasing their products, services, and company information, with a strong focus on Vietnamese Lunar New Year cultural features and modern UX enhancements.

---

## 1. What is newatlantic.vn?

### Company Information
- **Company Name:** NEW ATLANTIC / Tân Đại Tây Dương
- **Full Legal Name:** Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương
- **Founded:** May 14, 2003
- **Industry:** Industrial Equipment Distribution
- **Location:** District 7, Ho Chi Minh City, Vietnam (Headquarters)

### Company Profile
- **Business Focus:** Official distributor of international industrial equipment brands
- **Primary Brands Distributed:**
  - WILL-BURT (Telescoping masts/columns - 100+ years history)
  - HIAB (Cranes, lifting equipment, Moffett forklifts)
  - SKYMARK (Industrial machinery)
  - LOVOL (Heavy machinery)
  - EFFER (Cranes)
  - Clark Masts
  - Moffett

- **Market Position:** Top 5 largest enterprises in District 7, Ho Chi Minh City
- **Experience:** 22+ years in the industry
- **Customer Base:** 1000+ customers

### Services Offered
1. **Fire Fighting Equipment (PCCC)**
   - Supply of genuine fire safety materials
   - System design consultation
   - Professional installation
   - Regular maintenance

2. **Electrical Equipment**
   - Quality electrical equipment supply
   - Network design and installation
   - 24/7 operational support

3. **Specialized Equipment**
   - HIAB self-loading cranes
   - LOVOL & SKYMARK machinery
   - WILL-BURT telescoping masts
   - Moffett professional forklifts

### Office Locations
- **HQ:** A60 Phú Thuận, District 7, Ho Chi Minh City
- **Northern Branch:** 85 Nguyễn Phong Sắc, Cầu Giấy, Hanoi
- **Central Branch:** Triệu Giang, Triệu Phong, Quảng Trị Province

### Contact Information
- **Phone:** +84 2838 733 686
- **Email:** info@newatlantic.vn
- **Facebook:** facebook.com/aittandaitayduong

---

## 2. Recent Commits Analysis

### Commit History (Most Recent First)

1. **refactor: remove unused heroRef to clean up component code** (0cb1184)
   - Code cleanup
   - Removing unused React refs

2. **refactor: remove pull-to-refresh functionality to optimize performance** (c3a9d19)
   - Performance optimization
   - Removing mobile gesture feature

3. **feat: optimize parallax scrolling and enhance text selection for better UX** (07edb4b)
   - Parallax scrolling optimization using requestAnimationFrame
   - Enhanced text selection capabilities
   - Improved user experience

4. **feat: add UX enhancements** (401c233)
   - **Parallax background** with smooth scrolling effects
   - **Animated gradient text** for visual appeal
   - **Sticky section indicator** showing current page section
   - **Pull-to-refresh functionality** (later removed in c3a9d19)
   - Performance optimizations

5. **feat: enhance falling flowers effect** (bdf435c)
   - Improved animations for Hoa Mai (apricot blossoms) & Hoa Đào (peach blossoms)
   - Cultural elements for Vietnamese Lunar New Year (Tết)
   - CSS animations optimization

### Key Technical Improvements

**Performance Optimizations:**
- Parallax scrolling using `requestAnimationFrame` for 60fps smooth animations
- Direct DOM manipulation via refs to avoid React re-renders
- Optimized flower animations (reduced from 30 to 15 flowers)
- Cached section elements for scroll detection
- Implemented throttling for scroll events

**UX Enhancements:**
- Sticky section indicator showing "Trang chính", "Giới thiệu", "Lịch trình", "Ý nghĩa", "Hình ảnh"
- Animated gradient text with background-clip CSS
- Parallax background with 0.4 multiplier for depth effect
- Text selection improvements

**Cultural Features:**
- Falling Hoa Mai & Hoa Đào (Vietnamese traditional flowers)
- Bánh Trưng program (Rice cake wrapping tradition)
- Countdown timer to Lunar New Year event (Feb 5, 2026)
- Confetti effect when countdown reaches zero

---

## 3. Target Audience

### Primary Audience: Vietnamese Market

**Language & Localization:**
- Primary language: Vietnamese (`lang="vi"` in HTML)
- Font support includes Vietnamese characters (Inter font with Vietnamese subset)
- All content in Vietnamese
- Locale setting: `vi_VN`

**Cultural Considerations:**
- Strong emphasis on Vietnamese traditions (Tết/Lunar New Year)
- Traditional flower imagery (Hoa Mai - yellow apricot, Hoa Đào - pink peach blossoms)
- Rice cake wrapping program ("Chương Trình Gói Bánh Trưng")
- Vietnamese business culture references

**Geographic Focus:**
- Vietnam nationwide (North, Central, South branches)
- Local contact information
- Vietnamese phone numbers and addresses

### Secondary Characteristics

**B2B Focus:**
- Industrial equipment buyers
- Construction companies
- Government contractors
- Fire safety professionals
- Electrical contractors

**User Demographics:**
- Business professionals
- Procurement managers
- Technical engineers
- Safety officers

---

## 4. Technology Stack Analysis

### Core Framework & Versions

**Next.js Application:**
- **Next.js:** ^16.0.10 (Latest App Router architecture)
- **React:** ^19.2.3 (Latest version with React Compiler support)
- **React DOM:** ^19.2.3
- **Node.js:** >= 20.9.0 (Required)
- **TypeScript:** ^5 (Strict mode enabled)

**Build Tools:**
- **Turbopack:** Enabled for dev and build (`--turbopack` flag)
- **ESLint:** Next.js config
- **PostCSS:** ^4
- **Tailwind CSS:** ^4 (Latest version)

**Assessment:** ✅ **VERY MODERN** - All dependencies are at their latest versions

### Additional Libraries

**UI & Animation:**
- **Framer Motion:** ^12.23.24 (Animation library)
- **@iconify/react:** ^6.0.2 (Icon library)

**Communication:**
- **@emailjs/browser:** ^4.4.1 (Email service integration)

**AI/ML:**
- **@genkit-ai/compat-oai:** ^1.22.0 (AI toolkit compatibility)
- **replicate:** ^1.3.1 (AI model deployment)

**Rich Text Editor:**
- **react-quill-new:** ^3.7.0 (Quill editor wrapper)

**Security & Authentication:**
- **otplib:** ^13.1.1 (One-time password generation)
- **qrcode:** ^1.5.4 (QR code generation)

### Frontend Architecture

**Styling System:**
```javascript
// Tailwind CSS v4 with PostCSS
// Custom color scheme: #5f7ab8 (primary blue)
// Vietnamese font support
// Mobile-first responsive design
```

**Performance Features:**
- Image optimization (WebP, AVIF formats)
- Lazy loading components
- Request Animation Frame for smooth animations
- Caching strategies (30-day image cache, 1-year static assets)
- Code splitting
- Progressive enhancement

**SEO Optimization:**
- Server-side rendering (SSR)
- Meta tags optimization
- JSON-LD structured data (Organization, Website, LocalBusiness)
- Sitemap generation
- Canonical URLs
- Open Graph tags
- Twitter Cards

### Backend & Data

**Data Management:**
- JSON-based data storage in `/data` folder
- Server-side data fetching
- No external database (file-based CMS)

**Content Files:**
- products.json
- categories.json
- posts.json
- site-settings.json
- partner-logos.json
- office-locations.json

### Deployment & Hosting

**Platform:**
- Railway deployment support
- Git-based build ID generation
- Environment variable support (`RAILWAY_GIT_COMMIT_SHA`)

**Caching Strategy:**
```
Homepage: 60s cache, 300s stale-while-revalidate
Products: 300s cache, 600s stale-while-revalidate
Static images: 1 year immutable
Videos: 1 day cache
Admin: No cache
```

**Security Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

---

## 5. Cultural & Regional Considerations

### Vietnamese Lunar New Year (Tết) Features

**Bánh Trưng Program** (Rice Cake Wrapping Tradition)

**Event Details:**
- **Date:** February 5-8, 2026 (Lunar Calendar: 18-21/12 AL)
- **Purpose:** Traditional team building and cultural preservation
- **Location:** Company facilities

**Schedule:**
1. **Thursday, Dec 18 AL (Feb 5, 2026):** Material collection deadline
2. **Friday, Dec 19 AL (Feb 6, 2026):** Washing leaves, soaking rice and beans
3. **Saturday, Dec 20 AL (Feb 7, 2026):**
   - Drying leaves and cutting
   - Wrapping rice cakes
   - Cooking process
4. **Sunday, Dec 21 AL (Feb 8, 2026):** Distribution and celebration

**Cultural Symbolism:**
- **Square shape:** Represents earth
- **Green dong leaves:** Parental love
- **Sticky rice:** Abundance and prosperity
- **Mung beans:** Growth and development
- **Pork fat:** Wealth and prosperity

### Visual Cultural Elements

**Falling Flowers Animation:**
- **Hoa Mai** (Yellow apricot blossoms - Southern Vietnam tradition)
- **Hoa Đào** (Pink peach blossoms - Northern Vietnam tradition)
- 5 different flower types with varying sizes (18px-28px)
- Smooth falling animation using CSS keyframes
- Rotation and lateral movement for realism
- 15 flowers for desktop, reduced on mobile for performance

**Implementation:**
```css
/* Hoa Dao - Peach Blossom */
.banh-flower-0 {
  background-image: SVG (pink #ff85a2)
}

/* Hoa Mai - Apricot Blossom */
.banh-flower-1 {
  background-image: SVG (yellow #ffd700)
}
```

**Countdown Timer:**
- Flip card animation for countdown
- Target date: February 5, 2026
- Confetti celebration when countdown ends
- 100 confetti pieces in traditional colors

**Company Slogan:**
```
PHÁT TRIỂN PHỒN VINH XÂY THỊNH VƯỢNG
TỰ HÀO BỐN CHỮ TÂN ĐẠI TÂY DƯƠNG

Translation:
"DEVELOP PROSPERITY, BUILD ABUNDANCE
PROUD OF THE FOUR WORDS TAN DAI TAY DUONG"
```

### Business Culture Considerations

**Trust & Credibility:**
- 22+ years experience highlighted
- Top 5 enterprise status
- Partner logos from international brands
- Certification displays
- Customer testimonials
- Office location prominence

**Local Market Features:**
- Vietnamese phone number format
- Local address structure
- Facebook as primary social media
- Vietnamese business registration details

---

## 6. Technical Implementation Details

### Key Features

**Parallax Scrolling:**
```typescript
// Optimized with requestAnimationFrame
parallaxBgRef.current.style.transform = `translate3d(0, ${scrollTop * 0.4}px, 0)`;
```

**Section Detection:**
```typescript
// Active section indicator
for (const [sectionId, element] of sectionElements) {
  const rect = element.getBoundingClientRect();
  if (rect.top <= 150 && rect.bottom >= 150) {
    setActiveSection(sectionId);
    break;
  }
}
```

**Performance Optimizations:**
- Cached section elements in Map
- Throttled scroll events (5px threshold)
- Portal rendering for overlays (flowers, confetti, lightbox)
- CSS transforms for GPU acceleration
- Intersection Observer for scroll animations

### Special Pages

**Bánh Trưng Program Page:**
- Dedicated route: `/chuong-trinh-goi-banh-trung`
- Custom CSS file: `banh-trung.css`
- Features: Countdown, timeline, gallery, swipe hints
- Mobile-optimized with touch gestures

**Product Categories:**
1. Cột (Trụ) Tự Nâng WILL-BURT
2. Thiết Bị Nâng Hạ HIAB
3. Hàng Không SKYMARK

### Routing Structure
```
/                           - Homepage
/san-pham                   - Products listing
/san-pham/[category]        - Category pages
/san-pham/[category]/[slug] - Product details
/tin-tuc                    - News listing
/tin-tuc/[slug]             - News article
/lien-he                    - Contact page
/thu-vien-hinh-anh          - Image gallery
/page-download-catalog      - Catalog downloads
/chuong-trinh-goi-banh-trung - Rice cake program
/admin                      - Admin panel
```

---

## Summary for AI Agents

**Project Type:** Corporate e-commerce website for B2B industrial equipment distribution

**Technology Level:** Cutting-edge (Next.js 16, React 19, Tailwind CSS 4, Turbopack)

**Primary Language:** Vietnamese

**Cultural Context:** Strong Vietnamese cultural elements, especially Lunar New Year traditions

**Performance Focus:** Heavy optimization for smooth animations and fast load times

**Unique Features:**
- Falling flower animations (Hoa Mai & Hoa Đào)
- Lunar New Year countdown and rice cake wrapping program
- Parallax effects
- Mobile-first responsive design

**Development Stage:** Active development with recent UX/performance improvements

**SEO Strategy:** Comprehensive with structured data, meta tags, and Vietnamese keywords

**Target Users:** Vietnamese business customers seeking industrial equipment from international brands

---

## Files Generated During Research
- This report: `PROJECT_CONTEXT.md`

## Recommendations for Developers

1. **Maintain cultural authenticity** when modifying Tết-related features
2. **Test performance** on mobile devices due to animation-heavy design
3. **Preserve Vietnamese language** integrity in all translations
4. **Follow Next.js 16 best practices** for App Router
5. **Keep dependencies updated** - currently at latest versions
6. **Consider accessibility** improvements for animations and interactive elements
7. **Document any changes** to cultural features for stakeholder review

---

**Report End**
