'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function FounderOSNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Agents', href: '#agents' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[80px] bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* LEFT: FounderOS Logo & Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] via-[#7C4DFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#6C63FF]/30 group-hover:scale-105 transition-transform duration-300">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            Founder<span className="text-[#6C63FF]">OS</span>
          </span>
        </Link>

        {/* CENTER: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-200 group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>

        {/* RIGHT: Login & Get Started Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#login"
            className="px-5 py-2.5 rounded-full text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Login
          </a>
          <a
            href="#get-started"
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:from-[#5b52e0] hover:to-[#7c4dff] shadow-lg shadow-[#6C63FF]/25 hover:shadow-[#6C63FF]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            Get Started
          </a>
        </div>

        {/* HAMBURGER BUTTON (Mobile) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white focus:outline-none transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-300 hover:text-white py-2 border-b border-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-4 flex flex-col space-y-3">
            <a
              href="#login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full text-sm font-medium text-neutral-300 bg-white/5 border border-white/10 hover:text-white transition-all"
            >
              Login
            </a>
            <a
              href="#get-started"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] shadow-lg shadow-[#6C63FF]/25 hover:shadow-[#6C63FF]/40 transition-all"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
