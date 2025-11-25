'use client';

import React, { useState } from 'react';

export default function MechanistCommunications() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ dept: '', orderId: '', priority: 'Medium', body: '' });
  
  const [inbox, setInbox] = useState([
    { id: '1', dept: 'Design', orderId: 'SF1005', priority: 'High', read: false, timestamp: '2025-11-20 10:30 AM', body: 'New design specifications available for Voight-Kampff sensors. Please review before starting machining.' },
    { id: '2', dept: 'Production', orderId: 'SF1006', priority: 'Medium', read: false, timestamp: '2025-11-20 09:15 AM', body: 'Material shipment has arrived for custom brackets. Ready for machining process.' },
    { id: '3', dept: 'Inspection', orderId: 'SF1004', priority: 'Low', read: true, timestamp: '2025-11-19 04:45 PM', body: 'Previous batch passed quality inspection. Documentation uploaded.' },
  ]);

  const [sent, setSent] = useState([
    { id: '4', dept: 'Production', orderId: 'SF1005', priority: 'High', read: true, timestamp: '2025-11-20 11:00 AM', body: 'Machining completed for SF1005. Ready for inspection phase.' },
    { id: '5', dept: 'Design', orderId: 'SF1006', priority: 'Medium', read: true, timestamp: '2025-11-19 03:30 PM', body: 'Technical clarification needed on tolerance specifications for custom brackets.' },
  ]);

  const createMessage = () => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const dateStr = `${new Date().toLocaleDateString('en-US', options)} at ${time}`;
    const newMsg = { 
      id: Date.now().toString(), 
      dept: form.dept, 
      orderId: form.orderId || '', 
      priority: form.priority, 
      read: false, 
      timestamp: dateStr, 
      body: form.body.trim() 
    };
    setSent(prev => [newMsg, ...prev]);
    setShowModal(false);
    setForm({ dept: '', orderId: '', priority: 'Medium', body: '' });
    setActiveTab('sent');
  };

  const markAsRead = (msgId) => {
    setInbox(prev => prev.map(msg => msg.id === msgId ? { ...msg, read: true } : msg));
  };

  return (
    <div className="w-full">
      {/* Page content - layout is handled by ClientLayout */}
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Communications Center</h1>
                <p className="text-sm text-gray-600 mt-1">Send and receive messages with production teams</p>
              </div>
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md">
                <span>＋</span> New Message
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'inbox'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Inbox {inbox.filter(m => !m.read).length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {inbox.filter(m => !m.read).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'sent'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sent
              </button>
            </nav>
          </div>

          {/* Messages */}
          <div className="divide-y divide-gray-200">
            {activeTab === 'inbox' && inbox.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-6 hover:bg-gray-50 cursor-pointer ${!msg.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(msg.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">From: {msg.dept}</span>
                      {msg.orderId && (
                        <span className="text-sm text-gray-500">Order: {msg.orderId}</span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        msg.priority === 'High' ? 'bg-red-100 text-red-800' :
                        msg.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.priority}
                      </span>
                      {!msg.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900">{msg.body}</p>
                    <p className="text-xs text-gray-500 mt-2">{msg.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'sent' && sent.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">To: {msg.dept}</span>
                      {msg.orderId && (
                        <span className="text-sm text-gray-500">Order: {msg.orderId}</span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        msg.priority === 'High' ? 'bg-red-100 text-red-800' :
                        msg.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.priority}
                      </span>
                    </div>
                    <p className="text-gray-900">{msg.body}</p>
                    <p className="text-xs text-gray-500 mt-2">{msg.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeTab === 'inbox' && inbox.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No messages in your inbox
            </div>
          )}

          {activeTab === 'sent' && sent.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No sent messages
            </div>
          )}
        </div>

        {/* New Message Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
                  <p className="text-sm text-gray-600 mt-1">Send a message to another department</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Department</label>
                    <select 
                      value={form.dept} 
                      onChange={(e) => setForm(f => ({ ...f, dept: e.target.value }))}
                      className="w-full border border-gray-200 rounded-md px-3 py-2"
                    >
                      <option value="">Select department...</option>
                      <option value="Design">Design</option>
                      <option value="Production">Production</option>
                      <option value="Inspection">Inspection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order ID (Optional)</label>
                    <input 
                      type="text" 
                      value={form.orderId}
                      onChange={(e) => setForm(f => ({ ...f, orderId: e.target.value }))}
                      placeholder="e.g., SF1005"
                      className="w-full border border-gray-200 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select 
                      value={form.priority} 
                      onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="w-full border border-gray-200 rounded-md px-3 py-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      value={form.body}
                      onChange={(e) => setForm(f => ({ ...f, body: e.target.value }))}
                      placeholder="Type your message here..."
                      rows={4}
                      className="w-full border border-gray-200 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={createMessage}
                    disabled={!form.dept || !form.body.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
