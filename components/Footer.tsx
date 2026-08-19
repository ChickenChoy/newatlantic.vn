'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Category, SiteSettings, OfficeLocation, FooterLink } from '@/types';
import { openCookiePreferences } from './CookieConsent';
import { trackPhoneCall, trackEmailClick } from '@/lib/analytics';

export interface FooterProps {
  categories: Category[];
  siteSettings: SiteSettings;
  offices: OfficeLocation[];
  footerLinks: FooterLink[];
}

/**
 * Column heading. The display face at its smallest step plus a short accent
 * rule, so five headings read as one system instead of five competing titles —
 * the previous `text-xl` headings sat at the same weight as the company name.
 */
function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="font-display mb-6 text-d6 uppercase leading-display tracking-display text-white">
      {children}
      <span aria-hidden="true" className="mt-3 block h-px w-8 bg-accent" />
    </h4>
  );
}

/**
 * One navigation row. An accent rule grows from nothing and nudges the label,
 * so every column gets the same acknowledgement on hover — the old footer mixed
 * `hover:translate-x-1` in one column with a bare colour change in the next.
 */
function FooterNavLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="h-px w-0 bg-accent transition-all duration-300 ease-brand group-hover:mr-2 group-hover:w-3.5"
      />
      {label}
    </>
  );

  const className =
    'group inline-flex items-center text-sm leading-6 text-white/60 transition-colors duration-300 ease-brand hover:text-white';

  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={className}>
          {inner}
        </Link>
      )}
    </li>
  );
}

/** Contact row icon: a hairline pill, matching the map's legend swatches. */
function ContactIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-white/14 bg-white/[0.06] text-accent"
    >
      {children}
    </span>
  );
}

const PIN_ICON = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const PHONE_ICON = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const MAIL_ICON = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

export default function Footer({ categories, siteSettings, offices, footerLinks }: FooterProps) {
  // Get quick links from footer links
  const quickLinks = footerLinks
    .filter(l => l.section === 'quick')
    .sort((a, b) => a.order - b.order);

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

  // The catalogue, capped so the column stays a column. Follows the header's
  // convention: the canonical route is the slug, `href` is an external mirror.
  const catalogue = categories.slice(0, 6);

  const enabledSocials = siteSettings.socialLinks.filter(social => social.enabled);

  return (
    <footer className="relative overflow-hidden bg-navy text-white/80">
      {/* Same three depth layers as the partner-network panel, so the footer
          reads as the continuation of that material rather than as a new block:
          a specular hairline along the seam, a cool highlight from the top
          left, and a warm accent bloom in the far corner. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_10%_0%,rgba(255,255,255,0.06),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_92%_100%,rgba(255,95,0,0.14),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-site px-5 py-16 md:px-gutter md:py-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-10">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-3.5">
              <div className="relative h-12 w-12 shrink-0">
                <Image
                  src={siteSettings.footerLogo || siteSettings.logo}
                  alt={siteSettings.companyName}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-display text-xl uppercase leading-none tracking-display text-white">
                  {siteSettings.companyName}
                </div>
                <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {siteSettings.companySlogan}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-[1.7] text-white/60">
              {siteSettings.companyDescription}
            </p>

            {enabledSocials.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {enabledSocials.map(social => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/14 bg-white/[0.06] text-white/70 transition-colors duration-300 ease-brand hover:border-accent hover:bg-accent hover:text-white"
                    aria-label={social.platform}
                  >
                    {social.platform === 'facebook' && (
                      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {social.platform === 'youtube' && (
                      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    )}
                    {social.platform === 'linkedin' && (
                      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                    {social.platform === 'zalo' && (
                      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.666c-.207.608-.63 1.093-1.222 1.403-.593.31-1.32.394-2.097.394h-5.05c-.776 0-1.504-.084-2.097-.394-.592-.31-1.015-.795-1.222-1.403-.208-.608-.208-1.332-.208-2.166V9.5c0-.834 0-1.558.208-2.166.207-.608.63-1.093 1.222-1.403.593-.31 1.321-.394 2.097-.394h5.05c.777 0 1.504.084 2.097.394.592.31 1.015.795 1.222 1.403.208.608.208 1.332.208 2.166v3c0 .834 0 1.558-.208 2.166z" />
                      </svg>
                    )}
                    {social.platform === 'instagram' && (
                      <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Catalogue. Uses the `categories` prop the old footer accepted and
              never rendered — six deep links into the product tree. */}
          {catalogue.length > 0 && (
            <div className="lg:col-span-2">
              <ColumnTitle>Danh mục</ColumnTitle>
              <ul className="space-y-3">
                {catalogue.map(category => (
                  <FooterNavLink
                    key={category.id}
                    href={`/san-pham/${category.slug}`}
                    label={category.name}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Quick Links - Dynamic from Admin */}
          <div className="lg:col-span-2">
            <ColumnTitle>Liên kết nhanh</ColumnTitle>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <FooterNavLink
                  key={link.id}
                  href={link.href}
                  label={link.label}
                  external={link.isExternal}
                />
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <ColumnTitle>Dịch vụ</ColumnTitle>
            <ul className="space-y-3">
              {serviceLinks.map(link => (
                <FooterNavLink
                  key={link.id}
                  href={link.href}
                  label={link.label}
                  external={link.isExternal}
                />
              ))}
            </ul>
          </div>

          {/* Contact Info - Dynamic from offices and site settings */}
          <div className="lg:col-span-3">
            <ColumnTitle>Liên hệ</ColumnTitle>

            <div className="space-y-4">
              {headquarters && (
                <div className="flex items-start gap-3">
                  <ContactIcon>{PIN_ICON}</ContactIcon>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                      {headquarters.name}
                    </div>
                    <p className="mt-1 text-sm leading-[1.6] text-white/70">{headquarters.address}</p>
                  </div>
                </div>
              )}

              {branch && (
                <div className="flex items-start gap-3">
                  <ContactIcon>{PIN_ICON}</ContactIcon>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                      {branch.name}
                    </div>
                    <p className="mt-1 text-sm leading-[1.6] text-white/70">{branch.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* The hotline is the footer's one call to action, so it gets the
                only filled accent element in the column and a real card. */}
            {siteSettings.hotline && (
              <a
                href={`tel:${siteSettings.hotline.replace(/\s/g, '')}`}
                onClick={() => trackPhoneCall()}
                className="group mt-6 flex items-center gap-3.5 rounded-card border border-white/14 bg-white/[0.05] p-3.5 transition-colors duration-300 ease-brand hover:border-accent/60 hover:bg-accent/10"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-accent text-white"
                >
                  {PHONE_ICON}
                </span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    Hotline
                  </span>
                  <span className="font-display mt-1 block text-lg leading-none tracking-display text-white">
                    {siteSettings.hotline}
                  </span>
                </span>
              </a>
            )}

            <div className="mt-4 space-y-3">
              {siteSettings.phone && siteSettings.phone !== siteSettings.hotline && (
                <a
                  href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
                  onClick={() => trackPhoneCall()}
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors duration-300 ease-brand hover:text-accent"
                >
                  <ContactIcon>{PHONE_ICON}</ContactIcon>
                  {siteSettings.phone}
                </a>
              )}
              {siteSettings.email && (
                <a
                  href={`mailto:${siteSettings.email}`}
                  onClick={() => trackEmailClick()}
                  className="flex items-center gap-3 break-all text-sm text-white/70 transition-colors duration-300 ease-brand hover:text-accent"
                >
                  <ContactIcon>{MAIL_ICON}</ContactIcon>
                  {siteSettings.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative border-t border-white/14">
        <div className="mx-auto w-full max-w-site px-5 py-6 md:px-gutter">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <p className="text-xs leading-6 text-white/50">{siteSettings.copyright}</p>

            {/* Hairline dividers instead of a wide gap, so the policy row reads
                as one unit and stacks cleanly on a phone. */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:gap-x-5">
              {policyLinks.map(link => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-white/50 transition-colors duration-300 ease-brand hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 md:block" />
              <button
                type="button"
                onClick={() => openCookiePreferences()}
                className="cursor-pointer text-white/50 transition-colors duration-300 ease-brand hover:text-accent"
              >
                Tuỳ chọn cookie
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
