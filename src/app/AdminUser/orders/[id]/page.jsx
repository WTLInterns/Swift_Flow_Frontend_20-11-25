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

const OrderDetailsPanel = ({ isOpen, onClose, orderId }) => {
  const base = MOCK_ORDERS[orderId] || {
    id: orderId || 'SF1005',
    customer: 'Unknown Customer',
    products: '—',
    status: 'Inquiry',
    date: '—',
  };

  const [currentStatus, setCurrentStatus] = useState(base.status);
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [history, setHistory] = useState([]);
  const fileRef = useRef();

  const order = useMemo(() => ({ ...base, status: currentStatus }), [base, currentStatus]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : '');
  };

  const handleUpdate = () => {
    if (!currentStatus) return;
    const prev = history.length ? history[history.length - 1].to : base.status;
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
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Fixed panel on right side */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 lg:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Panel header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
            <p className="text-sm text-gray-500 mt-1">{order.customer}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Panel content */}
        <div className="p-6 space-y-6">
          {/* Progress indicator */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Progress</h3>
            <div className="flex items-center justify-between overflow-x-auto">
              {STEPS.map((step, i) => {
                const activeIndex = STEPS.indexOf(currentStatus);
                const completed = i < activeIndex;
                const active = i === activeIndex;
                return (
                  <div key={step} className="flex-1 min-w-[60px] flex flex-col items-center">
                    <div className={`flex items-center justify-center h-6 w-6 rounded-full border-2 text-xs ${completed ? 'bg-blue-600 border-blue-600 text-white' : active ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'}`}>
                      {completed ? '✓' : i + 1}
                    </div>
                    <div className={`text-xs mt-1 text-center ${active ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>{step}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Customer Information */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Customer</span>
                <span className="text-sm font-medium text-gray-900">{order.customer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Products</span>
                <span className="text-sm font-medium text-gray-900">{order.products}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Units</span>
                <span className="text-sm font-medium text-gray-900">20</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Material</span>
                <span className="text-sm font-medium text-gray-900">Bi-metallic film</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Address</span>
                <span className="text-sm font-medium text-gray-900">Nexus Building, Los Angeles</span>
              </div>
            </div>
          </section>

          {/* Status Update */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">New Status</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  <option value="">Select status...</option>
                  {STEPS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Attachment</label>
                <div className="relative">
                  <input 
                    ref={fileRef}
                    onChange={onFileChange} 
                    type="file" 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Comments</label>
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
              >
                Update Status
              </button>
            </div>
          </section>

          {/* Reports */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Reports</h3>
            <div className="space-y-2">
              {['Notes Summary', 'Design Report', 'Production Report', 'Machining Report', 'Inspection Report'].map((report, i) => (
                <div key={report} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <span className="text-sm text-gray-700">{report}</span>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Status History */}
          {history.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Updates</h3>
              <div className="space-y-3">
                {history.slice(-3).map((h) => (
                  <div key={h.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-900">{h.user}</span>
                      <span className="text-xs text-gray-500">{h.at.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">{h.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">{h.to}</span>
                    </div>
                    {h.notes && (
                      <p className="text-xs text-gray-600">{h.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
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
  const fileRef = useRef();

  const order = useMemo(() => ({ ...base, status: currentStatus }), [base, currentStatus]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : '');
  };

  const handleUpdate = () => {
    if (!currentStatus) return;
    const prev = history.length ? history[history.length - 1].to : base.status;
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

          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Progress</h3>
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {STEPS.map((step, i) => {
                const activeIndex = STEPS.indexOf(currentStatus);
                const completed = i < activeIndex;
                const active = i === activeIndex;
                return (
                  <div key={step} className="flex-1 min-w-[60px] sm:min-w-[80px] flex flex-col items-center">
                    <div className={`flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 text-xs sm:text-sm font-medium ${
                      completed ? 'bg-blue-600 border-blue-600 text-white' : 
                      active ? 'border-blue-600 text-blue-600' : 
                      'border-gray-300 text-gray-400'
                    }`}>
                      {completed ? '✓' : i + 1}
                    </div>
                    <div className={`text-xs mt-1 sm:mt-2 text-center font-medium ${
                      active ? 'text-blue-600' : 'text-gray-600'
                    }`}>{step}</div>
                  </div>
                );
              })}
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
                    <div className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm bg-blue-50 text-blue-700 border border-blue-200 font-medium">{order.products}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Units</div>
                    <div className="text-gray-900 font-medium text-sm sm:text-base">20</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Material</div>
                    <div className="text-gray-900 font-medium text-sm sm:text-base">Bi-metallic film</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Customer</div>
                    <div className="text-gray-900 font-medium text-sm sm:text-base">{order.customer}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Address</div>
                    <div className="text-gray-900 font-medium text-sm sm:text-base">Nexus Building, Los Angeles</div>
                  </div>
                </div>
              </section>

              {/* Update Order Status */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Update Order Status</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Select next status</label>
                    <select 
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select status...</option>
                      {STEPS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Attachment</label>
                    <div className="relative">
                      <input 
                        ref={fileRef}
                        onChange={onFileChange} 
                        type="file" 
                        className="w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs file:sm:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {fileName && (
                        <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Selected: {fileName}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Comments</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add comments about the status change..." 
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
                      rows={3}
                    />
                  </div>
                  <button 
                    onClick={handleUpdate}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </section>

              {/* Status History */}
              {history.length > 0 && (
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Status History</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {history.map((h) => (
                      <div key={h.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{h.user}</span>
                          <span className="text-xs text-gray-500">{h.at.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">{h.from}</span>
                          <span className="text-gray-400">→</span>
                          <span className="px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">{h.to}</span>
                        </div>
                        {h.notes && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-2">{h.notes}</p>
                        )}
                        {h.attachment && (
                          <p className="text-xs text-gray-500 mt-1 sm:mt-2">Attachment: {h.attachment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Assigned Team */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Assigned Team</h3>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {['Design','Production','Machinists','Inspection'].map(team => (
                    <div key={team} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-medium text-xs sm:text-sm">?</div>
                        <div>
                          <div className="text-gray-900 font-medium text-xs sm:text-sm">Unassigned</div>
                          <div className="text-xs text-gray-500">{team}</div>
                        </div>
                      </div>
                      <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reports */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Reports</h3>
                <div className="space-y-1 sm:space-y-2">
                  {['Notes Summary','Design Report','Production Report','Machinists Report','Inspection Report'].map((r, i) => (
                    <div key={r} className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition-colors cursor-pointer ${
                      i===0 ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}>
                      <span className={`text-xs sm:text-sm font-medium ${i===0 ? 'text-blue-700' : 'text-gray-700'}`}>{r}</span>
                      <button className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

 
