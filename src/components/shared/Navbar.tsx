'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Cpu, ShieldCheck, WifiOff } from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Sync with browser online status
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get Page Title from path
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/history':
        return 'Article History';
      case '/settings':
        return 'Configuration Settings';
      default:
        return 'ScriptAI';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-glass bg-bg-deep/30 px-6 backdrop-blur-md md:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-glass bg-white/3 text-gray-300 hover:bg-white/5 hover:text-white lg:hidden transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
            {getPageTitle()}
          </h1>
          <p className="hidden text-xs text-gray-400 md:block">
            AI-Powered Article Generation Platform
          </p>
        </div>
      </div>

      {/* Right: Status Badges & Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Network Status Badge — reflects real browser connectivity */}
        {isOnline ? (
          <div
            role="status"
            aria-live="polite"
            aria-label="Network connected"
            className="hidden items-center gap-1.5 rounded-full border border-brand-emerald/20 bg-brand-emerald/10 px-3 py-1 text-xs font-semibold text-brand-emerald sm:flex"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>API Connected</span>
          </div>
        ) : (
          <div
            role="status"
            aria-live="polite"
            aria-label="Network offline"
            className="hidden items-center gap-1.5 rounded-full border border-brand-rose/20 bg-brand-rose/10 px-3 py-1 text-xs font-semibold text-brand-rose sm:flex"
          >
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline</span>
          </div>
        )}

        {/* System Model Info */}
        <div className="hidden items-center gap-1.5 rounded-full border border-glass bg-white/3 px-3 py-1 text-xs text-gray-300 sm:flex">
          <Cpu className="h-3.5 w-3.5 text-brand-violet animate-pulse-slow" aria-hidden="true" />
          <span>Gemini Pro v1.5</span>
        </div>

        {/* Notifications Button */}
        <button
          aria-label="View notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-glass bg-white/3 text-gray-300 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-violet ring-2 ring-bg-deep" aria-hidden="true" />
        </button>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-pink p-[1px]" aria-hidden="true">
          <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-bg-darker text-xs font-bold text-white select-none">
            AI
          </div>
        </div>
      </div>
    </header>
  );
}
