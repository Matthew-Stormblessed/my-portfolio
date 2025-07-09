import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 h-16 bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/">
          <span className="text-xl font-bold text-gray-900">MyPortfolio</span>
        </Link>
      </div>
      <div className="flex gap-6 h-full">
        <Link href="/" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">Home</span>
        </Link>
        <Link href="About" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">About</span>
        </Link>
        <Link href="projects" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">Projects</span>
        </Link>
        <Link href="Contact" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">Contact</span>
        </Link>
        <Link href="actions" className="h-full flex items-center hover:bg-gray-300">
          <span className="transition-colors text-gray-900 px-3 h-full flex items-center">CI/CD</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
