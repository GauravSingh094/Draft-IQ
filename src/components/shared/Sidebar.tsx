'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Sparkles, 
  FileText,
  X 
} from 'lucide-react';
import { getStoredArticles } from '@/utils/historyStorage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    // Read live count from localStorage on mount and on sidebar open
    setArticleCount(getStoredArticles().length);
  }, [isOpen]);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'History', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-bg-darker/80 border-r border-glass/80 backdrop-blur-xl transition-all duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-glass">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-violet text-white shadow-md shadow-brand-violet/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-brand-violet bg-clip-text text-transparent">
              ScriptAI
            </span>
          </Link>
          <button 
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-glass bg-white/5 text-gray-400 hover:text-white lg:hidden transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-indigo/15 to-brand-violet/5 border border-brand-violet/20 text-white shadow-sm'
                    : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-brand-violet' : 'text-gray-400 group-hover:text-gray-200'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Session Status Section */}
        <div className="p-4 border-t border-glass">
          <div className="relative overflow-hidden rounded-2xl border border-glass/80 bg-white/3 p-4">
            {/* Soft decorative glow */}
            <div className="absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-brand-violet/20 blur-xl" aria-hidden="true" />
            
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-violet">
              <FileText className="h-4 w-4" />
              <span>Session Statistics</span>
            </div>
            
            <div className="mt-3 flex items-baseline justify-between text-xs text-gray-400">
              <span>Articles Generated</span>
              <span className="font-semibold text-white">{articleCount}</span>
            </div>
            
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden" role="presentation">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-violet transition-all duration-500"
                style={{ width: articleCount > 0 ? `${Math.min(100, (articleCount / 10) * 100)}%` : '0%' }}
              />
            </div>

            <p className="mt-2 text-[11px] text-gray-500">
              Stored locally in your browser
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
