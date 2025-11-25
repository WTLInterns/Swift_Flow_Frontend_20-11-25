'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function InspectionUserLayout({ children }) {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Get user from localStorage or context
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // Even if no user data, set a default user to show sidebar for InspectionUser pages
      if (pathname.includes('/InspectionUser')) {
        setUser({ role: 'inspector', name: 'Inspector', email: 'inspector@swiftflow.com' });
      }
    }
  }, [pathname]);

  // Always show sidebar for InspectionUser pages
  if (!user && !pathname.includes('/InspectionUser')) {
    return <div>{children}</div>;
  }

  const displayUser = user || { role: 'inspector', name: 'Inspector', email: 'inspector@swiftflow.com' };

  return (
    <div className="flex h-screen">
      <Sidebar user={displayUser} />
      <div className="flex-1 ml-64 overflow-auto">
        <div className="p-3 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
