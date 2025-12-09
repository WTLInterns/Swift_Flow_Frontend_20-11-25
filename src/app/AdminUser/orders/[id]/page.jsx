'use client';

import React, { useMemo, useRef, useState } from 'react';
import Sidebar from '@/components/Sidebar';

const STEPS = ['Inquiry', 'Design', 'Production', 'Machining', 'Inspection', 'Completed'];

const MOCK_ORDERS = {
  SF1005: {
    id: 'SF1005',
    customer: 'Tyrell Corporation',
    products: 'Voight-Kampff machine empathy sensors',
    status: 'Inquiry',
    date: 'Nov 20, 2025',
  },
};

// Progress with percentage component
const ProgressWithPercentage = ({ percentage, isActive, isCurrent }) => {
  return (
    <div className="w-full mt-1 px-1">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span className="font-medium">
          {isCurrent ? `${percentage}%` : isActive ? '100%' : '0%'}
        </span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: isCurrent ? '#60a5fa' : '#3b82f6'
          }}
        ></div>
      </div>
      <div className="text-[10px] text-center mt-1 text-gray-500">
        {isCurrent ? 'In Progress' : isActive ? 'Completed' : 'Pending'}
      </div>
    </div>
  );
};

export default function OrderDetailsPage({ params }) {
  const { id } = params || {};
  
  const base = MOCK_ORDERS[id] || {
    id: id || 'SF1005',
    customer: 'Unknown Customer',
    products: '—',
    status: 'Inquiry',
    date: '—',
  };

  const [currentStatus, setCurrentStatus] = useState(base.status);
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [history, setHistory] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileRef = useRef();
  const fileUploadRef = useRef();

  const order = useMemo(() => ({ ...base, status: currentStatus }), [base, currentStatus]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : '');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files to upload:', files);
    // Add your file upload logic here
  };

  const handleUpdate = () => {
    if (!currentStatus) return;
    
    setIsUpdating(true);
    const prev = history.length ? history[history.length - 1].to : base.status;
    
    // Simulate API call with timeout
    setTimeout(() => {
      const entry = {
        id: `${Date.now()}`,
        user: 'Admin User',
        from: prev,
        to: currentStatus,
        notes: notes?.trim(),
        attachment: fileName,
        at: new Date(),
      };
      setHistory((h) => [...h, entry]);
      setNotes('');
      setFileName('');
      if (fileRef.current) fileRef.current.value = '';
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar className="hidden lg:flex" />
      
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">{order.customer}</p>
          </div>

          {/* Progress Stepper */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Progress</h3>
            <div className="relative">
              {/* Background line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
              
              {/* Progress line */}
              <div 
                className="absolute top-5 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-500"
                style={{
                  width: `${(STEPS.indexOf(currentStatus) / (STEPS.length - 1)) * 100}%`
                }}
              ></div>
              
              {/* Steps */}
              <div className="flex justify-between relative">
                {STEPS.map((step, index) => {
                  const isActive = STEPS.indexOf(currentStatus) >= index;
                  const isCurrent = STEPS.indexOf(currentStatus) === index;
                  const progressPercentage = isCurrent ? 50 : isActive ? 100 : 0;
                  
                  return (
                    <div key={step} className="flex flex-col items-center flex-1 max-w-[100px]">
                      {/* Step circle */}
                      <div 
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                          isActive 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCurrent && isUpdating ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : isActive ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      {/* Step label */}
                      <span 
                        className={`text-xs mt-2 whitespace-nowrap ${
                          isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>
                      
                      {/* Progress with percentage */}
                      <ProgressWithPercentage 
                        percentage={progressPercentage} 
                        isActive={isActive}
                        isCurrent={isCurrent}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Project Details */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Project Details</h3>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Products</div>
                    <div className="text-gray-900 font-medium text-sm sm:text-base">{order.products}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Customer</div>
                    <div className="text-gray-900 font-medium text-sm sm:text-base">{order.customer}</div>
                  </div>
                </div>
              </section>

              {/* Status Update */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Update Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                    >
                      {STEPS.map((step) => (
                        <option key={step} value={step}>{step}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                    <div className="relative">
                      <input 
                        ref={fileRef}
                        onChange={onFileChange} 
                        type="file" 
                        className="w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs file:sm:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add comments about the status change..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <button 
                    onClick={handleUpdate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </section>
            </div>
            
            {/* Right sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* History Section */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">History</h3>
                <div className="space-y-4">
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((entry) => (
                        <div key={entry.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              Status changed from <span className="text-red-500">{entry.from}</span> to <span className="text-green-600">{entry.to}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(entry.at).toLocaleString()} by {entry.user}
                            </p>
                            {entry.notes && (
                              <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded-md">
                                {entry.notes}
                              </p>
                            )}
                            {entry.attachment && (
                              <div className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                {entry.attachment}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No history yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Status updates will appear here.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Upload Section - Added this new section */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                  onClick={() => fileUploadRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                    <input
                      type="file"
                      ref={fileUploadRef}
                      className="hidden"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileUploadRef.current?.click();
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Files
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}