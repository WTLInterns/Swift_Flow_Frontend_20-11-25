'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ChartCard, StatCard } from '@/components/ChartCard';
import { BarChart, LineChart, DonutChart } from '@/components/Charts';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log('=== Dashboard Mounted ===');
    
    const checkAuth = () => {
      try {
        console.log('Checking authentication status...');
        
        // Get user data and token from localStorage
        const userDataStr = localStorage.getItem('swiftflow-user');
        const token = localStorage.getItem('swiftflow-token');
        
        console.log('Retrieved from localStorage:', { 
          userDataStr: userDataStr ? 'exists' : 'not found',
          token: token ? 'exists' : 'not found'
        });
        
        // Check if user data exists and is valid JSON
        if (!userDataStr || !token) {
          throw new Error('Missing authentication data');
        }
        
        const userData = JSON.parse(userDataStr);
        
        // Validate user data structure
        if (!userData || typeof userData !== 'object' || !userData.id || !userData.role) {
          throw new Error('Invalid user data structure');
        }
        
        console.log('User authenticated successfully:', userData);
        setUser(userData);
        
      } catch (error) {
        console.error('Authentication error:', error);
        console.log('Redirecting to login...');
        // Clear any invalid data
        localStorage.removeItem('swiftflow-user');
        localStorage.removeItem('swiftflow-token');
        router.push('/');
      }
    };
    
    // Initial check
    checkAuth();
    
    // Set up a storage event listener to handle changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'swiftflow-user' || e.key === 'swiftflow-token') {
        console.log('Auth data changed, revalidating...');
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar onMenuClick={toggleSidebar} />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {user.name}!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard 
                title="Total Orders" 
                value="1,287" 
                change={12.5} 
                trend="up"
              />
              <StatCard 
                title="Active Projects" 
                value="42" 
                change={5.2} 
                trend="up"
              />
              <StatCard 
                title="New Customers" 
                value="128" 
                change={2.3} 
                trend="up"
              />
              <StatCard 
                title="Revenue" 
                value="$48,231" 
                change={8.7} 
                trend="up"
              />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Orders by Status">
                <BarChart />
              </ChartCard>
              <ChartCard title="Active Orders by Department">
                <DonutChart />
              </ChartCard>
            </div>
            
            {/* Recent Activity */}
            <ChartCard title="Recent Activity" className="mb-6">
              <div className="space-y-4">
                {[
                  { id: 1, title: 'New order #1234 received', time: '2 minutes ago', status: 'new' },
                  { id: 2, title: 'Order #1233 has been shipped', time: '1 hour ago', status: 'shipped' },
                  { id: 3, title: 'Payment received for order #1232', time: '3 hours ago', status: 'completed' },
                  { id: 4, title: 'New customer registration', time: '5 hours ago', status: 'new' },
                ].map((item) => (
                  <div key={item.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      item.status === 'new' ? 'bg-blue-100 text-blue-600' : 
                      item.status === 'shipped' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {item.status === 'new' ? 'N' : item.status === 'shipped' ? 'S' : 'C'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View all activity
                  </button>
                </div>
              </div>
            </ChartCard>
          </div>
        </main>
      </div>
    </div>
  );
}
