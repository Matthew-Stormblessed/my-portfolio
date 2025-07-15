"use client";
import Link from 'next/link';
import React, { use, useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-8 h-16 bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/">
          <span className="text-xl font-bold text-gray-900">MyPortfolio</span>
        </Link>
      </div>
      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-6 h-full">
        <Link href="/" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">Home</span>
        </Link>
        <Link href="/About" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">About</span>
        </Link>
        <Link href="/projects" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">Projects</span>
        </Link>
        <Link href="/Contact" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">Contact</span>
        </Link>
        <Link href="/actions" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">Github Actions</span>
        </Link>
      </div>
      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center px-3 py-2 border rounded text-gray-900 border-gray-400 hover:bg-gray-200 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-2 py-4 md:hidden z-50 animate-fade-in">
          <Link href="/" className="w-full text-center py-2 hover:bg-gray-200 text-gray-900 border-b border-gray-300" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/About" className="w-full text-center py-2 hover:bg-gray-200 text-gray-900 border-b border-gray-300" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/projects" className="w-full text-center py-2 hover:bg-gray-200 text-gray-900 border-b border-gray-300" onClick={() => setMenuOpen(false)}>
            Projects
          </Link>
          <Link href="/Contact" className="w-full text-center py-2 hover:bg-gray-200 text-gray-900 border-b border-gray-300" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/actions" className="w-full text-center py-2 hover:bg-gray-200 text-gray-900" onClick={() => setMenuOpen(false)}>
            Github Actions
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
