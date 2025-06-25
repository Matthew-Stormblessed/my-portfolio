import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/">
          <span className="text-xl font-bold text-gray-900">MyPortfolio</span>
        </Link>
      </div>
      <div className="flex gap-6">
        <Link href="/">
          <span className="hover:text-blue-600 transition-colors">Home</span>
        </Link>
        <Link href="#about">
          <span className="hover:text-blue-600 transition-colors">About</span>
        </Link>
        <Link href="#projects">
          <span className="hover:text-blue-600 transition-colors">Projects</span>
        </Link>
        <Link href="#contact">
          <span className="hover:text-blue-600 transition-colors">Contact</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
