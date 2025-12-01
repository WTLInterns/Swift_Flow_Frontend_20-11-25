'use client'

import { useState } from 'react'

export default function AccountantDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')

  return (
    <main className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Accountant Dashboard</h1>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="mt-3 sm:mt-0 px-3 py-2 sm:px-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Receivables */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Receivables</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">₹1,22,27,002.22</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 ml-2">New</span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 relative">
                <div className="bg-blue-500 h-2 sm:h-3 rounded-full" style={{width: '15%'}}></div>
                <div className="absolute right-0 top-0 h-2 sm:h-3 bg-gray-400 rounded-full" style={{width: '85%'}}></div>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-600">CURRENT</span>
                <span className="font-medium text-gray-900">₹18,90,353.00</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-600">OVERDUE</span>
                <span className="font-medium text-gray-900">₹1,03,36,649.22</span>
              </div>
            </div>
          </div>

          {/* Total Payables */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Total Payables</h3>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">₹86,61,580.02</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 ml-2">New</span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 relative">
                <div className="bg-blue-500 h-2 sm:h-3 rounded-full" style={{width: '5%'}}></div>
                <div className="absolute right-0 top-0 h-2 sm:h-3 bg-gray-400 rounded-full" style={{width: '95%'}}></div>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-600">CURRENT</span>
                <span className="font-medium text-gray-900">₹4,22,821.00</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-600">OVERDUE</span>
                <span className="font-medium text-gray-900">₹82,30,059.02</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Cash Flow</h3>
            <p className="text-xs sm:text-sm text-gray-600">A summary of your incoming and outgoing funds.</p>
          </div>
          
          <div className="relative h-48 sm:h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-6 sm:-ml-8">
              <span>₹10k</span>
              <span>₹7.5k</span>
              <span>₹5k</span>
              <span>₹2.5k</span>
              <span>₹0k</span>
            </div>
            
            {/* Chart area - Area Chart */}
            <div className="ml-8 sm:ml-12 h-full relative">
              {/* SVG Area Chart */}
              <svg className="w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 62.5, 125, 187.5, 250].map((y, index) => (
                  <line
                    key={index}
                    x1="0"
                    y1={y}
                    x2="600"
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Outgoing area (red) */}
                <path
                  d="M 0,200 L 85,180 L 170,150 L 255,165 L 340,120 L 425,140 L 510,110 L 600,100 L 600,250 L 0,250 Z"
                  fill="rgba(239, 68, 68, 0.3)"
                  stroke="none"
                />
                
                {/* Incoming area (blue/purple) */}
                <path
                  d="M 0,150 L 85,120 L 170,100 L 255,110 L 340,80 L 425,90 L 510,60 L 600,50 L 600,250 L 0,250 Z"
                  fill="rgba(99, 102, 241, 0.4)"
                  stroke="none"
                />
                
                {/* Outgoing line */}
                <path
                  d="M 0,200 L 85,180 L 170,150 L 255,165 L 340,120 L 425,140 L 510,110 L 600,100"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                
                {/* Incoming line */}
                <path
                  d="M 0,150 L 85,120 L 170,100 L 255,110 L 340,80 L 425,90 L 510,60 L 600,50"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 sm:px-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month) => (
                  <span key={month} className="text-xs text-gray-500">{month}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 sm:space-x-6 mt-4 sm:mt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
              <span className="text-xs sm:text-sm text-gray-600">Incoming</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-xs sm:text-sm text-gray-600">Outgoing</span>
            </div>
          </div>
        </div>

        {/* Sales Activity and Purchases */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sales Activity */}
          <div className="lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Sales Activity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-gray-100 p-1.5 sm:p-2 rounded">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">5</p>
                <p className="text-xs sm:text-sm text-gray-600">Estimates</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-gray-100 p-1.5 sm:p-2 rounded">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs sm:text-sm text-gray-600">Sales Orders</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-gray-100 p-1.5 sm:p-2 rounded">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">₹25.4L</p>
                <p className="text-xs sm:text-sm text-gray-600">Invoices</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-gray-100 p-1.5 sm:p-2 rounded">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs sm:text-sm text-gray-600">Delivery Challans</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-gray-100 p-1.5 sm:p-2 rounded">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">₹18.2L</p>
                <p className="text-xs sm:text-sm text-gray-600">Payments Received</p>
              </div>
            </div>
          </div>

          {/* Purchases */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Purchases</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 sm:p-3 rounded-lg mr-2 sm:mr-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-gray-900">Bills</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 sm:p-3 rounded-lg mr-2 sm:mr-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-gray-900">Payments Made</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
