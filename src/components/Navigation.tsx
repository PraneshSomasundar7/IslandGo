"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/creator-recruitment", label: "Creator Recruitment" },
  { href: "/content-gaps", label: "Content Gaps" },
  { href: "/viral-content", label: "Viral Content" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-amber-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-slate-900 hover:text-[#FF6B35] transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            IslandGo AI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 transition-colors duration-200"
            aria-label="Toggle menu"
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-amber-200 animate-in slide-in-from-top duration-200">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "bg-[#FF6B35]/20 text-[#FF6B35]"
                      : "text-slate-700 hover:bg-amber-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
