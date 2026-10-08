"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion } from 'motion/react';

import githubSVG from '@/public/github.svg';
import linkedinSVG from '@/public/linkedin.svg';

const mainNavItems = [
  { href: '/', label: 'Home' },
  { href: '/About', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/Contact', label: 'Contact' },
];

const secondaryNavItems = [
  { href: '/actions', label: 'GitHub Actions' },
];

const externalLinks = [
  {
    href: 'https://github.com/Matthew-Stormblessed',
    label: 'GitHub',
    icon: githubSVG,
    ariaLabel: 'GitHub profile',
  },
  {
    href: 'https://www.linkedin.com/in/matthew-johnson-950631152',
    label: 'LinkedIn',
    icon: linkedinSVG,
    ariaLabel: 'LinkedIn profile',
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 left-0 z-50 w-full border-b border-white/10 bg-[#050505]/95 backdrop-blur supports-[backdrop-filter]:bg-[#050505]/90">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="group flex items-center">
            <span className="text-lg font-semibold tracking-tight text-white transition-colors sm:text-xl">
              Matthew Johnson
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex h-10 items-center px-3 text-sm font-medium text-white/70 transition-colors duration-200 ease-in-out hover:text-[var(--color-accent)]"
              >
                <span className="relative">
                  {item.label}
                  <span className="absolute bottom-[-4px] left-0 h-px w-0 bg-[var(--color-accent)] transition-all duration-200 ease-in-out group-hover:w-full" />
                </span>
              </Link>
            ))}
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex h-10 items-center px-3 text-sm text-white/50 transition-colors duration-200 ease-in-out hover:text-[var(--color-accent)]"
              >
                <span className="relative">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 border-l border-white/10 pl-6">
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="flex h-9 w-9 items-center justify-center rounded-md text-white/60 transition-colors duration-200 ease-in-out hover:bg-white/5 hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                <Image
                  src={link.icon}
                  alt={link.ariaLabel}
                  width={18}
                  height={18}
                  className="brightness-0 invert opacity-80"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex items-center justify-center rounded-md border border-white/15 px-3 py-2 text-white/80 transition-colors duration-200 ease-in-out hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute left-0 top-16 z-50 w-full border-b border-white/10 bg-[#050505]/98 backdrop-blur md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full rounded-md px-3 py-2 text-base font-medium text-white/90 transition-colors duration-150 ease-in-out hover:bg-white/5 hover:text-[var(--color-accent)]"
                onClick={handleCloseMenu}
              >
                {item.label}
              </Link>
            ))}
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-full rounded-md px-3 py-2 text-base text-white/60 transition-colors duration-150 ease-in-out hover:bg-white/5 hover:text-[var(--color-accent)]"
                onClick={handleCloseMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-white/10 pt-4">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 transition-colors duration-150 ease-in-out hover:bg-white/5 hover:text-[var(--color-accent)]"
                  onClick={handleCloseMenu}
                >
                  <Image
                    src={link.icon}
                    alt={link.ariaLabel}
                    width={16}
                    height={16}
                    className="brightness-0 invert opacity-80"
                  />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
