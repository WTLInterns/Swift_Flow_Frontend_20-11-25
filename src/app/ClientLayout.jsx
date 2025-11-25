'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // Check if user is authenticated for protected routes
    const userData = JSON.parse(localStorage.getItem('swiftflow-user') || 'null');
    setUser(userData);
    
    const isProtectedRoute = pathname?.startsWith('/AdminUser') || pathname?.startsWith('/DesignUser') || pathname?.startsWith('/MechanistUser') || pathname?.startsWith('/InspectionUser');
    
    if (isProtectedRoute && !userData) {
      router.push('/login');
    }
  }, [pathname, router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isLoginRoute = pathname === '/login';

  if (isLoginRoute) {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        {children}
      </AuthProvider>
    );
  }

  // Check if this is a page that should show the sidebar
  const showSidebar = pathname?.startsWith('/DesignUser/design-queue') || 
                    pathname?.startsWith('/DesignUser/communications') ||
                    pathname?.startsWith('/DesignUser/dashboard') ||
                    pathname?.startsWith('/MechanistUser/dashboard') ||
                    pathname?.startsWith('/MechanistUser/communications') ||
                    pathname?.startsWith('/MechanistUser/machine-jobs');

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Show sidebar only for specific pages */}
        {showSidebar && (
          <>
            {/* Mobile sidebar backdrop */}
            <div 
              className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div 
              className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } lg:translate-x-0 bg-white border-r border-gray-200`}
            >
              <Sidebar user={user} closeSidebar={() => setSidebarOpen(false)} />
            </div>
            
            {/* Mobile header */}
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                {pathname.includes('MechanistUser') ? 'Mechanist' : pathname.includes('InspectionUser') ? 'Inspector' : 'Designer'} Dashboard
              </h1>
              <div className="w-8"></div> {/* Spacer for flex alignment */}
            </header>
          </>
        )}
        
        {/* Main content */}
        <div className="flex flex-col">
          <main className={`${showSidebar ? 'lg:pl-64' : ''} flex-1`}>
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
