import Link from 'next/link';
import Image from 'next/image';
import { Category, SiteSettings, OfficeLocation, FooterLink } from '@/types';

export interface FooterProps {
  categories: Category[];
  siteSettings: SiteSettings;
  offices: OfficeLocation[];
  footerLinks: FooterLink[];
}

export default function Footer({ categories, siteSettings, offices, footerLinks }: FooterProps) {

  // Build quick links from categories
  const categoryLinks = categories.slice(0, 3).map(cat => ({
    label: cat.name,
    href: `/san-pham/${cat.slug}`,
  }));

  // Get service links from footer links
  const serviceLinks = footerLinks
    .filter(l => l.section === 'service')
    .sort((a, b) => a.order - b.order);

  // Get policy links from footer links
  const policyLinks = footerLinks
    .filter(l => l.section === 'policy')
    .sort((a, b) => a.order - b.order);

  // Get headquarters and first branch
  const headquarters = offices.find(o => o.type === 'headquarters');
  const branch = offices.find(o => o.type === 'branch');

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src={siteSettings.logo}
                  alt={siteSettings.companyName}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{siteSettings.companyName}</div>
                <div className="text-xs text-gray-400">{siteSettings.companySlogan}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {siteSettings.companyDescription}
            </p>
            <div className="flex gap-3">
              {siteSettings.socialLinks
                .filter(social => social.enabled)
                .map(social => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-[#14b8a6] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg"
                    aria-label={social.platform}
                  >
                    {social.platform === 'facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    {social.platform === 'youtube' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )}
                    {social.platform === 'linkedin' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                    {social.platform === 'zalo' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.666c-.207.608-.63 1.093-1.222 1.403-.593.31-1.32.394-2.097.394h-5.05c-.776 0-1.504-.084-2.097-.394-.592-.31-1.015-.795-1.222-1.403-.208-.608-.208-1.332-.208-2.166V9.5c0-.834 0-1.558.208-2.166.207-.608.63-1.093 1.222-1.403.593-.31 1.321-.394 2.097-.394h5.05c.777 0 1.504.084 2.097.394.592.31 1.015.795 1.222 1.403.208.608.208 1.332.208 2.166v3c0 .834 0 1.558-.208 2.166z"/>
                      </svg>
                    )}
                    {social.platform === 'instagram' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    )}
                  </a>
                ))}
            </div>
          </div>

          {/* Quick Links - Dynamic from Categories */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#5f7ab8] transition-all duration-300 hover:translate-x-1 inline-block">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-gray-400 hover:text-[#5f7ab8] transition-all duration-300 hover:translate-x-1 inline-block">
                  Sản phẩm
                </Link>
              </li>
              {categoryLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tin-tuc" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Dịch vụ</h4>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map(link => (
                <li key={link.id}>
                  {link.isExternal ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Dynamic from offices and site settings */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Liên hệ</h4>
            <div className="space-y-4 text-sm">
              {headquarters && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white mb-1">{headquarters.name}</div>
                    <p className="text-gray-400">{headquarters.address}</p>
                  </div>
                </div>
              )}
              {branch && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#5f7ab8] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white mb-1">{branch.name}</div>
                    <p className="text-gray-400">{branch.address}</p>
                  </div>
                </div>
              )}
              <div className="pt-2 space-y-2">
                <a href={`tel:${siteSettings.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-300 hover:text-[#5f7ab8] transition-colors">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {siteSettings.phone}
                </a>
                <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-3 text-gray-300 hover:text-[#5f7ab8] transition-colors">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {siteSettings.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">
              {siteSettings.copyright}
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm justify-center">
              {policyLinks.map(link => (
                <Link key={link.id} href={link.href} className="text-gray-400 hover:text-[#5f7ab8] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
