'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-bg-deep text-white">
      {/* Decorative Glow Mesh & Animated Blobs */}
      <div className="glowing-mesh mesh-purple -top-40 -left-40 animate-blob-1" />
      <div className="glowing-mesh mesh-indigo top-1/3 -right-40 animate-blob-2" />
      <div className="glowing-mesh mesh-purple bottom-10 left-1/4 animate-blob-1" />

      {/* Sidebar Drawer Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Layout Area */}
      <div className="flex flex-col min-h-screen lg:pl-64">
        {/* Top Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Viewport Sub-routing Content */}
        <main className="flex-1 p-6 md:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
